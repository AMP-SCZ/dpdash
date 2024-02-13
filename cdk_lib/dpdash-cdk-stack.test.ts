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
      ...overrides
    }
  }

  const createTemplate = () => {
    const app = new cdk.App()
    const dpDashCdkStack = new DpdashCdkStack(app, "DPDashCDKStack")
    return Template.fromStack(dpDashCdkStack)
  }

  beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  it('creates a DocumentDB Cluster', async () => {
    setEnv()
    const template = createTemplate()

    template.hasResource('AWS::DocDB::DBCluster', {})
    template.hasResource('AWS::DocDB::DBInstance', {})
  })
})
