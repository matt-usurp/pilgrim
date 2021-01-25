import * as AwsLambda from 'aws-lambda';

/**
 * A mapping of event sources available for AWS Lambda.
 *
 * The key is an identifier that can be used to quickly construct event sources.
 * For more information see the `Lambda.Source` type in the `~/provider/aws` file.
 */
export interface LambdaEventSource {
  readonly 'aws:alb:request': [AwsLambda.ALBEvent, AwsLambda.ALBResult];
  readonly 'aws:apigw:authorizer:request': [AwsLambda.APIGatewayRequestAuthorizerEvent, AwsLambda.APIGatewayAuthorizerResult];
  readonly 'aws:apigw:authorizer:token': [AwsLambda.APIGatewayTokenAuthorizerEvent, AwsLambda.APIGatewayAuthorizerResult];
  readonly 'aws:apigw:proxy:v1': [AwsLambda.APIGatewayProxyEvent, AwsLambda.APIGatewayProxyResult];
  readonly 'aws:apigw:proxy:v2': [AwsLambda.APIGatewayProxyEventV2, AwsLambda.APIGatewayProxyResultV2];
  readonly 'aws:appsync': [AwsLambda.AppSyncResolverEvent<Record<string, unknown>>, void];
  readonly 'aws:cloudformation:custom-resource': [AwsLambda.CloudFormationCustomResourceEvent, AwsLambda.CloudFormationCustomResourceResponse];
  readonly 'aws:cloudfront:request': [AwsLambda.CloudFrontRequestEvent, AwsLambda.CloudFrontRequestResult];
  readonly 'aws:cloudfront:response': [AwsLambda.CloudFrontResponseEvent, AwsLambda.CloudFrontResponseResult];
  readonly 'aws:cloudwatch:log': [AwsLambda.CloudWatchLogsEvent, void];
  readonly 'aws:cloudwatch:logs-log': [AwsLambda.CloudWatchLogsLogEvent, void];
  readonly 'aws:cloudwatch:scheduled': [AwsLambda.ScheduledEvent, void];
  readonly 'aws:codebuild:state': [AwsLambda.CodeBuildCloudWatchStateEvent, void];
  readonly 'aws:codepipeline:job': [AwsLambda.CodePipelineEvent, void];
  readonly 'aws:codepipeline:cloudwatch': [AwsLambda.CodePipelineCloudWatchEvent, void];
  readonly 'aws:cognito:create-auth-challenge': [AwsLambda.CreateAuthChallengeTriggerEvent, AwsLambda.CreateAuthChallengeTriggerEvent];
  readonly 'aws:cognito:define-auth-challenge': [AwsLambda.DefineAuthChallengeTriggerEvent, AwsLambda.DefineAuthChallengeTriggerEvent];
  readonly 'aws:cognito:custom-message': [AwsLambda.CustomMessageTriggerEvent, AwsLambda.CustomMessageTriggerEvent];
  readonly 'aws:cognito:pre-authentication': [AwsLambda.PreAuthenticationTriggerEvent, AwsLambda.PreAuthenticationTriggerEvent];
  readonly 'aws:cognito:post-authentication': [AwsLambda.PostAuthenticationTriggerEvent, AwsLambda.PostAuthenticationTriggerEvent];
  readonly 'aws:cognito:post-confirmation': [AwsLambda.PostConfirmationTriggerEvent, AwsLambda.PostConfirmationTriggerEvent];
  readonly 'aws:cognito:pre-signup': [AwsLambda.PreSignUpTriggerEvent, AwsLambda.PreSignUpTriggerEvent];
  readonly 'aws:cognito:pre-token-generation': [AwsLambda.PreTokenGenerationTriggerEvent, AwsLambda.PreTokenGenerationTriggerEvent];
  readonly 'aws:cognito:user-migration': [AwsLambda.UserMigrationTriggerEvent, AwsLambda.UserMigrationTriggerEvent];
  readonly 'aws:cognito:verify-auth-challenge-response': [AwsLambda.VerifyAuthChallengeResponseTriggerEvent, AwsLambda.VerifyAuthChallengeResponseTriggerEvent];
  readonly 'aws:connect:contact-flow': [AwsLambda.ConnectContactFlowEvent, AwsLambda.ConnectContactFlowResult];
  readonly 'aws:dynamodb:stream': [AwsLambda.DynamoDBStreamEvent, void];
  readonly 'aws:eventbridge': [AwsLambda.EventBridgeEvent<string, Record<string, unknown>>, void];
  readonly 'aws:iot': [AwsLambda.IoTEvent, void];
  readonly 'aws:kinesis:firehose-transform': [AwsLambda.FirehoseTransformationEvent, AwsLambda.FirehoseTransformationResult];
  readonly 'aws:kinesis:stream': [AwsLambda.KinesisStreamEvent, void];
  readonly 'aws:lex': [AwsLambda.LexEvent, AwsLambda.LexResult];
  readonly 'aws:msk': [AwsLambda.MSKEvent, void];
  readonly 'aws:s3:object': [AwsLambda.S3Event, void];
  readonly 'aws:s3:batch': [AwsLambda.S3BatchEvent, AwsLambda.S3BatchResult];
  readonly 'aws:ses': [AwsLambda.SESEvent, void];
  readonly 'aws:sns': [AwsLambda.SNSEvent, void];
  readonly 'aws:sqs': [AwsLambda.SQSEvent, void];
}
