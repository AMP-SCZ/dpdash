import * as cdk from 'aws-cdk-lib'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as ecs from 'aws-cdk-lib/aws-ecs'
import * as ssm from 'aws-cdk-lib/aws-ssm'
import * as ecr from 'aws-cdk-lib/aws-ecr'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as docdb from 'aws-cdk-lib/aws-docdb'
import * as certificate_manager from 'aws-cdk-lib/aws-certificatemanager'
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns'
import * as secrets_manager from 'aws-cdk-lib/aws-secretsmanager'
import { Construct } from 'constructs'

export class DpdashCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, {
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
      },
      ...props,
    })
    const IS_DEV = process.env.DPDASH_INFRA_STAGING === '1'
    const APP_NAME = IS_DEV ? 'DpDashDev' : 'DPDash'

    if (
      !process.env.BASE_DOMAIN ||
      !process.env.ADMIN_EMAIL ||
      !process.env.EMAIL_SENDER
    ) {
      throw new Error(
        'Missing required environment variables: BASE_DOMAIN, ADMIN_EMAIL, EMAIL_SENDER'
      )
    }

    if (!process.env.CERT_ARN || !process.env.SES_IDENTITY_ARN) {
      throw new Error(
        'Missing required environment variables: CERT_ARN, SES_IDENTITY_ARN'
      )
    }

    const certArn = process.env.CERT_ARN
    const sesIdentityArn = process.env.SES_IDENTITY_ARN

    const secrets = {
      sessionSecretDev: ecs.Secret.fromSsmParameter(
        ssm.StringParameter.fromSecureStringParameterAttributes(
          this,
          `${APP_NAME}SessionDevSecret`,
          {
            parameterName: 'DPDASH_SESSION_SECRET' + (IS_DEV ? '_DEV' : ''),
            version: 1,
          }
        )
      ),
      importApiUsersDev: ecs.Secret.fromSsmParameter(
        ssm.StringParameter.fromSecureStringParameterAttributes(
          this,
          `${APP_NAME}ImportApiUsers`,
          {
            parameterName: 'DPDASH_IMPORT_API_USERS' + (IS_DEV ? '_DEV' : ''),
            version: 1,
          }
        )
      ),
      importApiKeysDev: ecs.Secret.fromSsmParameter(
        ssm.StringParameter.fromSecureStringParameterAttributes(
          this,
          `${APP_NAME}ImportApiKeysDev`,
          {
            parameterName: 'DPDASH_IMPORT_API_KEYS' + (IS_DEV ? '_DEV' : ''),
            version: 1,
          }
        )
      ),
    }
    const vpc = new ec2.Vpc(this, `${APP_NAME}Vpc`, {
      availabilityZones: [`${cdk.Aws.REGION}a`, `${cdk.Aws.REGION}b`],
    })

    const ddbPassSecret = new secrets_manager.Secret(
      this,
      'DocumentDB Password',
      {
        secretName: 'DPDASH_MONGODB_ADMIN_PASSWORD' + (IS_DEV ? '_DEV' : ''),
        generateSecretString: {
          excludePunctuation: true,
          excludeCharacters: "/¥'%:;{}",
        },
      }
    )

    const mongoCluster = new docdb.DatabaseCluster(
      this,
      `${APP_NAME}DatabaseDbCluster`,
      {
        vpc: vpc,
        masterUser: {
          username: 'dpdash',
          password: ddbPassSecret.secretValue,
        },
        instances: 1,
        instanceType: ec2.InstanceType.of(
          ec2.InstanceClass.MEMORY5,
          ec2.InstanceSize.LARGE
        ),
        vpcSubnets: {
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
      }
    )

    const dpdashRepository = ecr.Repository.fromRepositoryName(
      this,
      `${APP_NAME}DpdashRepository`,
      'dpdash'
    )

    const appTaskDefinition = new ecs.FargateTaskDefinition(
      this,
      `${APP_NAME}AppTaskDefinition`,
      {
        memoryLimitMiB: process.env.DEV_APP_MEMORY
          ? Number(process.env.DEV_APP_MEMORY)
          : 2048,
        cpu: process.env.DEV_APP_CPU ? Number(process.env.DEV_APP_CPU) : 1024,
        family: IS_DEV ? 'dpDashDevTaskDefinition' : 'dpDashTaskDefinition',
        taskRole: new iam.Role(this, `${APP_NAME}AppTaskRole`, {
          assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
          inlinePolicies: {
            readDbPassword: new iam.PolicyDocument({
              statements: [
                new iam.PolicyStatement({
                  actions: ['secretsmanager:GetSecretValue'],
                  resources: [ddbPassSecret.secretArn],
                }),
              ],
            }),
            sendEmail: new iam.PolicyDocument({
              statements: [
                new iam.PolicyStatement({
                  actions: ['ses:SendEmail', 'ses:SendRawEmail'],
                  resources: [sesIdentityArn],
                }),
              ],
            }),
          },
        }),
      }
    )

    appTaskDefinition.addContainer(`${APP_NAME}AppContainer`, {
      image: ecs.ContainerImage.fromEcrRepository(dpdashRepository, 'latest'),
      portMappings: [{ containerPort: 8000 }],
      environment: {
        MONGODB_HOST: mongoCluster.clusterEndpoint.hostname,
        MONGODB_USER: 'dpdash',
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        EMAIL_SENDER: process.env.EMAIL_SENDER,
        HOME_URL: `https://${process.env.BASE_DOMAIN}/admin`,
      },
      secrets: {
        MONGODB_PASSWORD: ecs.Secret.fromSecretsManager(ddbPassSecret),
        SESSION_SECRET: secrets.sessionSecretDev,
        IMPORT_API_USERS: secrets.importApiUsersDev,
        IMPORT_API_KEYS: secrets.importApiKeysDev,
      },
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: `${APP_NAME}AppContainer`,
      }),
    })

    const dpDashServiceSg = new ec2.SecurityGroup(
      this,
      `${APP_NAME}ServiceSG`,
      {
        vpc: vpc,
        allowAllOutbound: true,
      }
    )

    const dpDashService =
      new ecs_patterns.ApplicationLoadBalancedFargateService(
        this,
        `${APP_NAME}AppService`,
        {
          serviceName: IS_DEV ? 'dpDashDevService' : 'dpDashService',
          loadBalancerName: IS_DEV ? 'dpDashDevService' : 'dpDashLoadBalancer',
          cluster: new ecs.Cluster(this, `${APP_NAME}Cluster`, {
            vpc,
            clusterName: IS_DEV ? 'dpDashDevCluster' : 'dpDashCluster',
          }),
          taskDefinition: appTaskDefinition,
          securityGroups: [dpDashServiceSg],
          assignPublicIp: true,
          publicLoadBalancer: true,
          redirectHTTP: true,
          certificate: certificate_manager.Certificate.fromCertificateArn(
            this,
            `${APP_NAME}Certificate`,
            certArn
          ),
          taskSubnets: {
            subnets: vpc.publicSubnets.concat(vpc.privateSubnets),
          },
        }
      )

    const mongoClusterSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(
      this,
      `${APP_NAME}MongoSG`,
      mongoCluster.securityGroupId,
      {
        mutable: false,
      }
    )

    mongoClusterSecurityGroup.addIngressRule(
      ec2.Peer.securityGroupId(dpDashServiceSg.securityGroupId),
      ec2.Port.tcp(27017)
    )
  }
}
