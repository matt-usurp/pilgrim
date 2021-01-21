import * as AwsLambda from 'aws-lambda';
import { ContextConstraint } from '../../application/context';
import { Handler as ApplicationHandler, HandlerWrapper } from '../../application/handler';
import { Middleware as ApplicationMiddleware } from '../../application/middleware';

export interface LambdaEvents {
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
  readonly 'aws:cognito:create-auth-challenge': [AwsLambda.CreateAuthChallengeTriggerEvent, void];
  readonly 'aws:cognito:define-auth-challenge': [AwsLambda.DefineAuthChallengeTriggerEvent, void];
  readonly 'aws:cognito:custom-message': [AwsLambda.CustomMessageTriggerEvent, void];
  readonly 'aws:cognito:pre-authentication': [AwsLambda.PreAuthenticationTriggerEvent, void];
  readonly 'aws:cognito:post-authentication': [AwsLambda.PostAuthenticationTriggerEvent, void];
  readonly 'aws:cognito:post-confirmation': [AwsLambda.PostConfirmationTriggerEvent, void];
  readonly 'aws:cognito:pre-signup': [AwsLambda.PreSignUpTriggerEvent, void];
  readonly 'aws:cognito:pre-token-generation': [AwsLambda.PreTokenGenerationTriggerEvent, void];
  readonly 'aws:cognito:user-migration': [AwsLambda.UserMigrationTriggerEvent, void];
  readonly 'aws:cognito:verify-auth-challenge-response': [AwsLambda.VerifyAuthChallengeResponseTriggerEvent, void];
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

export type LambdaHandlerEnhanced = AwsLambda.Handler<LambdaEvents[keyof LambdaEvents][0]>;
export type LambdaWrapper = HandlerWrapper<LambdaInboundConstraint, Lambda.Context, LambdaHandlerEnhanced>;

/**
 * An inbound implementation that is passed to all middlewares.
 *
 * In this case Lambda itself passes a context that is used as the function context.
 * This has all the information about the functions execution.
 * This is combined with the event so middleware has access to function meta data.
 *
 * @internal
 */
export type LambdaInboundKind<GivenEvent> = {
  context: AwsLambda.Context;
  event: GivenEvent;
};

/**
 * A representation of what an inbound can look like.
 *
 * @internal
 * @constraint This is a constraint type that should only be used in extends clauses.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LambdaInboundConstraint = Lambda.Inbound<any>;

/**
 * A grouping of lambda specific types.
 *
 * These are public types that help with the developer experience.
 */
export namespace Lambda {
  /**
   * A pseudo-type function for creating "Lambda.Inbound.Kind" types using the given event identifier.
   *
   * @api
   */
  export type Inbound<K extends keyof LambdaEvents> = LambdaInboundKind<LambdaEvents[K][0]>;

  /**
   * The context that will be auto-prepared for use with the middlewares and handlers.
   *
   * @api
   */
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
  export type Handler<GivenContext extends ContextConstraint> = ApplicationHandler<GivenContext, void>;

  /**
   * A grouping of extra or enhanced types for the handler.
   */
  export namespace Handler {
    /**
     * An impleemntation of the handler without knowledge of context.
     *
     * @api
     */
    export type Contextless = Handler<Lambda.Context>;
  }

  /**
   * An implementation of middleware specialised for lambda.
   *
   * @api
   */
  export type Middleware<
    GivenInbound extends LambdaInboundConstraint,
    NextContext extends ContextConstraint,
    GivenContext extends ContextConstraint = ContextConstraint,
  > = ApplicationMiddleware<GivenInbound, NextContext, GivenContext>;

  /**
   * A grouping of extra or enhanced types for middleware.
   */
  export namespace Middleware {
    /**
    * A lambda middleware that doesn't consume the inbound event.
    *
    * @api
    */
    export type Eventless<
      NextContext extends ContextConstraint,
      GivenContext extends ContextConstraint = ContextConstraint,
    > = Middleware<LambdaInboundConstraint, NextContext, GivenContext>;

    /**
    * A lambda middleware that is suited for validation of given context or inbound.
    *
    * @api
    */
    export type Validator<
      GivenInbound extends LambdaInboundConstraint,
      GivenContext extends ContextConstraint,
    > = Middleware<GivenInbound, GivenContext, GivenContext>;

    export namespace Validator {
      /**
      * A lambda middleware that is suited for validation of given context only.
      * This middleware is not typed to know about the given inbound.
      *
      * @api
      */
      export type Eventless<
        GivenContext extends ContextConstraint,
      > = Middleware.Eventless<GivenContext, GivenContext>;
    }
  }
}
