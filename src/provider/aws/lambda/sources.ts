import * as AwsLambda from 'aws-lambda';

/**
 * An event source definition.
 */
export type EventSource<Inbound, Response> = {
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
  readonly 'aws:alb:request': EventSource<AwsLambda.ALBEvent, AwsLambda.ALBResult>;
  readonly 'aws:apigw:authorizer:request': EventSource<AwsLambda.APIGatewayRequestAuthorizerEvent, AwsLambda.APIGatewayAuthorizerResult>;
  readonly 'aws:apigw:authorizer:token': EventSource<AwsLambda.APIGatewayTokenAuthorizerEvent, AwsLambda.APIGatewayAuthorizerResult>;
  readonly 'aws:apigw:proxy:v1': EventSource<AwsLambda.APIGatewayProxyEvent, AwsLambda.APIGatewayProxyResult>;
  readonly 'aws:apigw:proxy:v2': EventSource<AwsLambda.APIGatewayProxyEventV2, AwsLambda.APIGatewayProxyResultV2>;
  readonly 'aws:appsync': EventSource<AwsLambda.AppSyncResolverEvent<Record<string, unknown>>, void>;
  readonly 'aws:cloudformation:custom-resource': EventSource<AwsLambda.CloudFormationCustomResourceEvent, AwsLambda.CloudFormationCustomResourceResponse>;
  readonly 'aws:cloudfront:request': EventSource<AwsLambda.CloudFrontRequestEvent, AwsLambda.CloudFrontRequestResult>;
  readonly 'aws:cloudfront:response': EventSource<AwsLambda.CloudFrontResponseEvent, AwsLambda.CloudFrontResponseResult>;
  readonly 'aws:cloudwatch:log': EventSource<AwsLambda.CloudWatchLogsEvent, void>;
  readonly 'aws:cloudwatch:logs-log': EventSource<AwsLambda.CloudWatchLogsLogEvent, void>;
  readonly 'aws:cloudwatch:scheduled': EventSource<AwsLambda.ScheduledEvent, void>;
  readonly 'aws:codebuild:state': EventSource<AwsLambda.CodeBuildCloudWatchStateEvent, void>;
  readonly 'aws:codepipeline:job': EventSource<AwsLambda.CodePipelineEvent, void>;
  readonly 'aws:codepipeline:cloudwatch': EventSource<AwsLambda.CodePipelineCloudWatchEvent, void>;
  readonly 'aws:cognito:create-auth-challenge': EventSource<AwsLambda.CreateAuthChallengeTriggerEvent, AwsLambda.CreateAuthChallengeTriggerEvent>;
  readonly 'aws:cognito:define-auth-challenge': EventSource<AwsLambda.DefineAuthChallengeTriggerEvent, AwsLambda.DefineAuthChallengeTriggerEvent>;
  readonly 'aws:cognito:custom-message': EventSource<AwsLambda.CustomMessageTriggerEvent, AwsLambda.CustomMessageTriggerEvent>;
  readonly 'aws:cognito:pre-authentication': EventSource<AwsLambda.PreAuthenticationTriggerEvent, AwsLambda.PreAuthenticationTriggerEvent>;
  readonly 'aws:cognito:post-authentication': EventSource<AwsLambda.PostAuthenticationTriggerEvent, AwsLambda.PostAuthenticationTriggerEvent>;
  readonly 'aws:cognito:post-confirmation': EventSource<AwsLambda.PostConfirmationTriggerEvent, AwsLambda.PostConfirmationTriggerEvent>;
  readonly 'aws:cognito:pre-signup': EventSource<AwsLambda.PreSignUpTriggerEvent, AwsLambda.PreSignUpTriggerEvent>;
  readonly 'aws:cognito:pre-token-generation': EventSource<AwsLambda.PreTokenGenerationTriggerEvent, AwsLambda.PreTokenGenerationTriggerEvent>;
  readonly 'aws:cognito:user-migration': EventSource<AwsLambda.UserMigrationTriggerEvent, AwsLambda.UserMigrationTriggerEvent>;
  readonly 'aws:cognito:verify-auth-challenge-response': EventSource<AwsLambda.VerifyAuthChallengeResponseTriggerEvent, AwsLambda.VerifyAuthChallengeResponseTriggerEvent>;
  readonly 'aws:connect:contact-flow': EventSource<AwsLambda.ConnectContactFlowEvent, AwsLambda.ConnectContactFlowResult>;
  readonly 'aws:dynamodb:stream': EventSource<AwsLambda.DynamoDBStreamEvent, void>;
  readonly 'aws:eventbridge': EventSource<AwsLambda.EventBridgeEvent<string, Record<string, unknown>>, void>;
  readonly 'aws:iot': EventSource<AwsLambda.IoTEvent, void>;
  readonly 'aws:kinesis:firehose-transform': EventSource<AwsLambda.FirehoseTransformationEvent, AwsLambda.FirehoseTransformationResult>;
  readonly 'aws:kinesis:stream': EventSource<AwsLambda.KinesisStreamEvent, void>;
  readonly 'aws:lex': EventSource<AwsLambda.LexEvent, AwsLambda.LexResult>;
  readonly 'aws:msk': EventSource<AwsLambda.MSKEvent, void>;
  readonly 'aws:s3:object': EventSource<AwsLambda.S3Event, void>;
  readonly 'aws:s3:batch': EventSource<AwsLambda.S3BatchEvent, AwsLambda.S3BatchResult>;
  readonly 'aws:ses': EventSource<AwsLambda.SESEvent, void>;
  readonly 'aws:sns': EventSource<AwsLambda.SNSEvent, void>;
  readonly 'aws:sqs': EventSource<AwsLambda.SQSEvent, void>;
}
