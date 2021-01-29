import * as AwsLambda from 'aws-lambda';
import { Pilgrim } from '../../../main';
import { Lambda } from '../lambda';

/**
 * An event source definition.
 */
export type EventSource<
  Inbound,
  Response extends Pilgrim.Response.Constraint
> = {
  readonly Event: Inbound;
  readonly Response: Response;
};

/**
 * A mapping of event sources available for AWS Lambda.
 *
 * The key is an identifier that can be used to quickly construct event sources.
 * For more information see the `Lambda.Source` type in the `~/provider/aws` file.
 */
export interface LambdaEventSource {
  readonly 'aws:alb:request': EventSource<AwsLambda.ALBEvent, Lambda.Response<AwsLambda.ALBResult>>;
  readonly 'aws:apigw:authorizer:request': EventSource<AwsLambda.APIGatewayRequestAuthorizerEvent, Lambda.Response<AwsLambda.APIGatewayAuthorizerResult>>;
  readonly 'aws:apigw:authorizer:token': EventSource<AwsLambda.APIGatewayTokenAuthorizerEvent, Lambda.Response<AwsLambda.APIGatewayAuthorizerResult>>;
  readonly 'aws:apigw:proxy:v1': EventSource<AwsLambda.APIGatewayProxyEvent, Lambda.Response<AwsLambda.APIGatewayProxyResult>>;
  readonly 'aws:apigw:proxy:v2': EventSource<AwsLambda.APIGatewayProxyEventV2, Lambda.Response<AwsLambda.APIGatewayProxyResultV2>>;
  readonly 'aws:appsync': EventSource<AwsLambda.AppSyncResolverEvent<Record<string, unknown>>, Pilgrim.Response.Nothing>;
  readonly 'aws:cloudformation:custom-resource': EventSource<AwsLambda.CloudFormationCustomResourceEvent, Lambda.Response<AwsLambda.CloudFormationCustomResourceResponse>>;
  readonly 'aws:cloudfront:request': EventSource<AwsLambda.CloudFrontRequestEvent, Lambda.Response<AwsLambda.CloudFrontRequestResult>>;
  readonly 'aws:cloudfront:response': EventSource<AwsLambda.CloudFrontResponseEvent, Lambda.Response<AwsLambda.CloudFrontResponseResult>>;
  readonly 'aws:cloudwatch:log': EventSource<AwsLambda.CloudWatchLogsEvent, Pilgrim.Response.Nothing>;
  readonly 'aws:cloudwatch:logs-log': EventSource<AwsLambda.CloudWatchLogsLogEvent, Pilgrim.Response.Nothing>;
  readonly 'aws:cloudwatch:scheduled': EventSource<AwsLambda.ScheduledEvent, Pilgrim.Response.Nothing>;
  readonly 'aws:codebuild:state': EventSource<AwsLambda.CodeBuildCloudWatchStateEvent, Pilgrim.Response.Nothing>;
  readonly 'aws:codepipeline:job': EventSource<AwsLambda.CodePipelineEvent, Pilgrim.Response.Nothing>;
  readonly 'aws:codepipeline:cloudwatch': EventSource<AwsLambda.CodePipelineCloudWatchEvent, Pilgrim.Response.Nothing>;
  readonly 'aws:cognito:create-auth-challenge': EventSource<AwsLambda.CreateAuthChallengeTriggerEvent, Lambda.Response<AwsLambda.CreateAuthChallengeTriggerEvent>>;
  readonly 'aws:cognito:define-auth-challenge': EventSource<AwsLambda.DefineAuthChallengeTriggerEvent, Lambda.Response<AwsLambda.DefineAuthChallengeTriggerEvent>>;
  readonly 'aws:cognito:custom-message': EventSource<AwsLambda.CustomMessageTriggerEvent, Lambda.Response<AwsLambda.CustomMessageTriggerEvent>>;
  readonly 'aws:cognito:pre-authentication': EventSource<AwsLambda.PreAuthenticationTriggerEvent, Lambda.Response<AwsLambda.PreAuthenticationTriggerEvent>>;
  readonly 'aws:cognito:post-authentication': EventSource<AwsLambda.PostAuthenticationTriggerEvent, Lambda.Response<AwsLambda.PostAuthenticationTriggerEvent>>;
  readonly 'aws:cognito:post-confirmation': EventSource<AwsLambda.PostConfirmationTriggerEvent, Lambda.Response<AwsLambda.PostConfirmationTriggerEvent>>;
  readonly 'aws:cognito:pre-signup': EventSource<AwsLambda.PreSignUpTriggerEvent, Lambda.Response<AwsLambda.PreSignUpTriggerEvent>>;
  readonly 'aws:cognito:pre-token-generation': EventSource<AwsLambda.PreTokenGenerationTriggerEvent, Lambda.Response<AwsLambda.PreTokenGenerationTriggerEvent>>;
  readonly 'aws:cognito:user-migration': EventSource<AwsLambda.UserMigrationTriggerEvent, Lambda.Response<AwsLambda.UserMigrationTriggerEvent>>;
  readonly 'aws:cognito:verify-auth-challenge-response': EventSource<AwsLambda.VerifyAuthChallengeResponseTriggerEvent, Lambda.Response<AwsLambda.VerifyAuthChallengeResponseTriggerEvent>>;
  readonly 'aws:connect:contact-flow': EventSource<AwsLambda.ConnectContactFlowEvent, Lambda.Response<AwsLambda.ConnectContactFlowResult>>;
  readonly 'aws:dynamodb:stream': EventSource<AwsLambda.DynamoDBStreamEvent, Pilgrim.Response.Nothing>;
  readonly 'aws:eventbridge': EventSource<AwsLambda.EventBridgeEvent<string, Record<string, unknown>>, Pilgrim.Response.Nothing>;
  readonly 'aws:iot': EventSource<AwsLambda.IoTEvent, Pilgrim.Response.Nothing>;
  readonly 'aws:kinesis:firehose-transform': EventSource<AwsLambda.FirehoseTransformationEvent, Lambda.Response<AwsLambda.FirehoseTransformationResult>>;
  readonly 'aws:kinesis:stream': EventSource<AwsLambda.KinesisStreamEvent, Pilgrim.Response.Nothing>;
  readonly 'aws:lex': EventSource<AwsLambda.LexEvent, Lambda.Response<AwsLambda.LexResult>>;
  readonly 'aws:msk': EventSource<AwsLambda.MSKEvent, Pilgrim.Response.Nothing>;
  readonly 'aws:s3:object': EventSource<AwsLambda.S3Event, Pilgrim.Response.Nothing>;
  readonly 'aws:s3:batch': EventSource<AwsLambda.S3BatchEvent, Lambda.Response<AwsLambda.S3BatchResult>>;
  readonly 'aws:ses': EventSource<AwsLambda.SESEvent, Pilgrim.Response.Nothing>;
  readonly 'aws:sns': EventSource<AwsLambda.SNSEvent, Pilgrim.Response.Nothing>;
  readonly 'aws:sqs': EventSource<AwsLambda.SQSEvent, Pilgrim.Response.Nothing>;
}
