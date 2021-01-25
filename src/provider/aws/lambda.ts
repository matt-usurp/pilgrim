import * as AwsLambda from 'aws-lambda';
import { PilgrimContext } from '../../application/context';
import { PilgrimHandler } from '../../application/handler';
import { PilgrimMiddleware } from '../../application/middleware';
import { PilgrimProvider } from '../../application/provider';

export interface LambdaSources {
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

export type LambdaHandler = AwsLambda.Handler;
export type LambdaProviderComposer = PilgrimProvider.InvokerComposer<LambdaSourceConstraint, Lambda.Context, any, LambdaHandler>;

/**
 * An source implementation that is passed to all middlewares.
 *
 * In this case Lambda itself passes a context that is used as the function context.
 * This has all the information about the functions execution.
 * This is combined with the event so middleware has access to function meta data.
 *
 * @internal
 */
export type LambdaSourceKind<GivenEvent> = {
  context: AwsLambda.Context;
  event: GivenEvent;
};

/**
 * A representation of what a source can look like.
 *
 * @internal
 * @constraint This is a constraint type that should only be used in extends clauses.
 */
export type LambdaSourceConstraint = Lambda.Source<any>;

/**
 * A grouping of lambda specific types.
 *
 * These are public types that help with the developer experience.
 */
export namespace Lambda {
  export type Event<K extends keyof LambdaSources> = LambdaSources[K];
  export type Source<K extends keyof LambdaSources> = LambdaSourceKind<LambdaSources[K][0]>;

  export type Context = {
    request: {
      id: string;
    };
  };

  /**
   * An implementation of handler specialised for lambda.
   * The given context will always inclue the "Lambda.Context" although not required to extend it.
   *
   * @api
   */
  export type Handler<GivenContext extends PilgrimContext.Context.Constraint> = PilgrimHandler.Handler<GivenContext, any>;

  /**
   * An implementation of middleware specialised for lambda.
   *
   * @api
   */
  export type Middleware<
    Source,
    ContextInbound extends PilgrimContext.Context.Constraint,
    ContextOutbound extends PilgrimContext.Context.Constraint,
    ResponseInbound extends PilgrimMiddleware.Response.Constraint,
    ResponseOutbound extends PilgrimMiddleware.Response.Constraint,
  > = PilgrimMiddleware.Middleware<Source, ContextInbound, ContextOutbound, ResponseInbound, ResponseOutbound>;

  /**
   * A grouping of extra or enhanced types for middleware.
   */
  export namespace Middleware {
    /**
    * A lambda middleware that doesn't consume the inbound event.
    *
    * @api
    */
    export type WithoutSource<
      ContextInbound extends PilgrimContext.Context.Constraint,
      ContextOutbound extends PilgrimContext.Context.Constraint,
      ResponseInbound extends PilgrimMiddleware.Response.Constraint,
      ResponseOutbound extends PilgrimMiddleware.Response.Constraint,
    > = Middleware<LambdaSourceConstraint, ContextInbound, ContextOutbound, ResponseInbound, ResponseOutbound>;
  }
}
