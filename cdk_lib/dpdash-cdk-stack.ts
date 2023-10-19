import * as cdk from 'aws-cdk-lib';
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as efs from "aws-cdk-lib/aws-efs";
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as iam from "aws-cdk-lib/aws-iam";
import * as certificate_manager from "aws-cdk-lib/aws-certificatemanager";
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";
import { Construct } from 'constructs';

const APP_NAME = "DpDash";

export class DpdashCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    if (process.env.CERT_ARN) {
      const certificateArn = process.env.CERT_ARN;

      const secrets = {
        mongoDbUser: ecs.Secret.fromSsmParameter(ssm.StringParameter.fromSecureStringParameterAttributes(this, `${APP_NAME}MongoDbUser`, {
          parameterName: 'DPDASH_MONGODB_ADMIN_USER',
          version: 1,
        })),
        mongoDbPassword: ecs.Secret.fromSsmParameter(ssm.StringParameter.fromSecureStringParameterAttributes(this, `${APP_NAME}MongoDbPassword`, {
          parameterName: 'DPDASH_MONGODB_ADMIN_PASSWORD',
          version: 1,
        })),
        sessionSecret: ecs.Secret.fromSsmParameter(ssm.StringParameter.fromSecureStringParameterAttributes(this, `${APP_NAME}SessionSecret`, {
          parameterName: 'DPDASH_SESSION_SECRET',
          version: 1,
        })),
        importApiUsers: ecs.Secret.fromSsmParameter(ssm.StringParameter.fromSecureStringParameterAttributes(this, `${APP_NAME}ImportApiUsers`, {
          parameterName: 'DPDASH_IMPORT_API_USERS',
          version: 1,
        })),
        importApiKeys: ecs.Secret.fromSsmParameter(ssm.StringParameter.fromSecureStringParameterAttributes(this, `${APP_NAME}ImportApiKeys`, {
          parameterName: 'DPDASH_IMPORT_API_KEYS',
          version: 1,
        })),
      }
      const vpc = new ec2.Vpc(this, `${APP_NAME}Vpc`, {
        availabilityZones: [`${cdk.Aws.REGION}a`, `${cdk.Aws.REGION}b`],
      });
  
      const efsSecurityGroup = new ec2.SecurityGroup(this,`${APP_NAME}EfsSg`, {
        vpc,
      });
  
      const mongoRepository = ecr.Repository.fromRepositoryName(this, `${APP_NAME}MongoRepository`, "mongo");
      const dpdashRepository = ecr.Repository.fromRepositoryName(this, `${APP_NAME}DpdashRepository`, "dpdash");
  
      const mongoTaskDefinition = new ecs.FargateTaskDefinition(this, `${APP_NAME}MongoTaskDefinition`, {
        memoryLimitMiB: 512,
        cpu: 256,
      });
  
      const fileSystem = new efs.FileSystem(this, `${APP_NAME}EfsFileSystem`, { 
        vpc,
        securityGroup: efsSecurityGroup,
        encrypted: true,
        vpcSubnets: {
          subnets: vpc.privateSubnets,
        },
        removalPolicy: cdk.RemovalPolicy.DESTROY,
       });
  
      const accessPoint = new efs.AccessPoint(this, `${APP_NAME}VolumeAccessPoint`,  {
        fileSystem: fileSystem,
     })
  
      mongoTaskDefinition.addVolume({
        name: "mongo-data",
        efsVolumeConfiguration: {
          fileSystemId: fileSystem.fileSystemId,
          authorizationConfig: {
            accessPointId: accessPoint.accessPointId,
            iam: "ENABLED", 
          },
          transitEncryption: "ENABLED",
        },
      });
  
      mongoTaskDefinition.addToTaskRolePolicy(
        new iam.PolicyStatement({
          actions: [
            'elasticfilesystem:ClientRootAccess',
            'elasticfilesystem:ClientWrite',
            'elasticfilesystem:ClientMount',
            'elasticfilesystem:DescribeMountTargets',
          ],
          resources: [
            fileSystem.fileSystemArn,
          ],
        })
      );
      
      mongoTaskDefinition.addToTaskRolePolicy(
        new iam.PolicyStatement({
          actions: ['ec2:DescribeAvailabilityZones'],
          resources: ['*'],
        })
      );
      
      const mongoContainer = mongoTaskDefinition.addContainer(`${APP_NAME}MongoContainer`, {
        image: ecs.ContainerImage.fromEcrRepository(mongoRepository, "5.0.21"),
        portMappings: [{ containerPort: 27017 }],        
        logging: ecs.LogDrivers.awsLogs({ streamPrefix: `${APP_NAME}MongoContainer` }),
        secrets: {
          MONGO_INITDB_ROOT_USERNAME: secrets.mongoDbUser,
          MONGO_INITDB_ROOT_PASSWORD: secrets.mongoDbPassword,
        },
      });
  
      mongoContainer.addMountPoints({
        containerPath: "/data/db",
        readOnly: false,
        sourceVolume: "mongo-data",
      });
  
      const mongoService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, `${APP_NAME}MongoService`, {
        vpc: vpc,
        cpu: 512,
        taskDefinition: mongoTaskDefinition,
        taskSubnets: {
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        listenerPort: 27017,
        maxHealthyPercent: 100,
        minHealthyPercent: 0,
        desiredCount: 1,
        assignPublicIp: false,
        publicLoadBalancer: false,
      });
  
  
      mongoService.targetGroup.configureHealthCheck({
        port: "27017",
      });
  
      
      efsSecurityGroup.addIngressRule(
          mongoService.service.connections.securityGroups[0],
          ec2.Port.tcp(2049) // Enable NFS service within security group
      )
      
      new ecs_patterns.ApplicationLoadBalancedFargateService(this, `${APP_NAME}AppService`, {
        vpc: vpc,
        taskImageOptions: { 
          image: ecs.ContainerImage.fromEcrRepository(dpdashRepository, "latest"),
          containerPort: 8000,
          environment: {
            MONGODB_HOST: mongoService.loadBalancer.loadBalancerDnsName,
          },
          secrets: {
            MONGODB_USER: secrets.mongoDbUser,
            MONGODB_PASSWORD: secrets.mongoDbPassword,
            SESSION_SECRET: secrets.sessionSecret,
            IMPORT_API_USERS: secrets.importApiUsers,
            IMPORT_API_KEYS: secrets.importApiKeys,
          },
          logDriver: ecs.LogDrivers.awsLogs({ streamPrefix: `${APP_NAME}AppContainer` }),
        },
        assignPublicIp: true,
        publicLoadBalancer: true,
        redirectHTTP: true,
        certificate: certificate_manager.Certificate.fromCertificateArn(this, `${APP_NAME}Certificate`, certificateArn),
        taskSubnets: {
          subnets: vpc.publicSubnets.concat(vpc.privateSubnets),
        },
      });
    } else {
      throw new Error("CertificateArn is not defined")
    }
  }
}
