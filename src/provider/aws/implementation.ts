import { Context as LambdaProvidedContext } from 'aws-lambda';
import { Handler } from '../../application/handler';
import { Middleware } from '../../application/middleware';
import { ObjectLike } from '../../common/object';
import { ExecutionTypes } from '@matt-usurp/pilgrim/provider/aws';

/**
 * An inbound implementation that is passed to all middlewares.
 *
 * In this case Lambda itself passes a context that is used as the function context.
 * This has all the information about the functions execution.
 * This is combined with the event so middleware has access to function meta data.
 */
export type LambdaInbound<GivenEvent> = {
  context: LambdaProvidedContext;
  event: GivenEvent;
};

/**
 * A pseudo-type function for creating LambdaInbound types using the execution identifier.
 */
export type CreateLambdaInbound<K extends keyof ExecutionTypes> = LambdaInbound<ExecutionTypes[K][0]>;

/**
 * The context that will be auto-prepared for use with the middlewares and handlers.
 */
export type LambdaContext = {
  request: {
    id: string;
  };
};

/**
 * An implementation of handler specialised for lambda.
 */
export type LambdaHandler<Context> = Handler<Context>;

/**
 * An implementation of middleware specialised for lambda.
 */
export type LambdaMiddleware<
  GivenInbound extends LambdaInbound<any>,
  NextContext extends ObjectLike,
  GivenContext extends ObjectLike = ObjectLike,
> = Middleware<GivenInbound, NextContext, GivenContext>;

/**
 * A lambda middleware that doesn't consume the inbound event.
 */
export type LambdaMiddlewareInboundless<
  NextContext extends ObjectLike,
  GivenContext extends ObjectLike = ObjectLike,
> = LambdaMiddleware<LambdaInbound<any>, NextContext, GivenContext>;

/**
 * A lambda middleware that is suited for validation of given context or inbound.
 */
export type LambdaMiddlewareValidator<
  GivenInbound extends LambdaInbound<any>,
  GivenContext extends ObjectLike,
> = LambdaMiddleware<GivenInbound, GivenContext, GivenContext>;

/**
 * A lambda middleware that is suited for validation of given context only.
 * This middleware is not typed to know about the given inbound.
 */
export type LambdaMiddlewareValidatorInboundless<
  GivenContext extends ObjectLike,
> = LambdaMiddlewareInboundless<GivenContext, GivenContext>;
