import { App, CfnParameter, Stack, StackProps } from 'aws-cdk-lib';
import { LoggingLevel, SlackChannelConfiguration } from 'aws-cdk-lib/aws-chatbot';
import { ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const topic = new Topic(this, 'CDKDeployTopic', {
      topicName: 'cdk-deploying-stacks',
    });

    const slackWorkspaceId = new CfnParameter(this, 'SlackWorkspaceId', {
      type: 'String',
      description: 'Enter slack workspace id',
    });
    const slackChannelId = new CfnParameter(this, 'SlackChannelId', {
      type: 'String',
      description: 'Enter slack channel id',
    });

    const slack = new SlackChannelConfiguration(this, 'MySlack', {
      slackChannelConfigurationName: 'cdk-deploying-stacks',
      slackWorkspaceId: slackWorkspaceId.valueAsString,
      slackChannelId: slackChannelId.valueAsString,
      notificationTopics: [topic],
      loggingLevel: LoggingLevel.INFO,
    });
    slack.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess'),
    );
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new MyStack(app, 'slack-channels-dev', { env: devEnv });
// new MyStack(app, 'slack-channels-prod', { env: prodEnv });

app.synth();