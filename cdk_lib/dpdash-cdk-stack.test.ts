import { Capture, Match, Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import { DpdashCdkStack } from './dpdash-cdk-stack';

describe('DPDashCDKStack', () => {
  const OLD_ENV = process.env
  const setEnv = (overrides = {}) => {
    process.env = {
      CDK_DEFAULT_ACCOUNT: '000000000000',
      CDK_DEFAULT_REGION: 'us-east-1',
      EMAIL_SENDER: 'noreply@dpdash.example.com',
      ADMIN_EMAIL: 'alice@example.com',
      BASE_DOMAIN: 'dpdash.example.com',
      APP_MEMORY: '2048',
      APP_CPU: '1024',
      DPDASH_DEV: '1',
      ...overrides
    }
  }

  const createTemplate = () => {
    const app = new cdk.App()
    const dpDashCdkStack = new DpdashCdkStack(app, "DPDashCDKStack")
    return Template.fromStack(dpDashCdkStack)
  }

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('creates a DocumentDB Cluster', () => {
    setEnv()
    const template = createTemplate()

    template.hasResource('AWS::DocDB::DBCluster', {})
    template.hasResource('AWS::DocDB::DBInstance', {})
  })

  it('creates an Application Load Balanced Fargate Service', () => {
    setEnv()
    const template = createTemplate()

    template.hasResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {})
    template.hasResource('AWS::ECS::Cluster', {})
    template.hasResource('AWS::ECS::Service', {})
  })
})
