import { ExecutionTypes } from '@matt-usurp/pilgrim/provider/aws';
import { Context as LambdaProvidedContext } from 'aws-lambda';
import { ContextConstraint } from '../../application/context';
import { Handler } from '../../application/handler';
import { Middleware } from '../../application/middleware';

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
 * A representation of what an inbound can look like.
 *
 * @constraint This is a constraint type that should only be used in extends clauses.
 */
export type LambdaInboundConstraint = CreateLambdaInbound<keyof ExecutionTypes>;

/**
 * A pseudo-type function for creating LambdaInbound types using the execution identifier.
 */
export type CreateLambdaInbound<ExecutionTypeIdentifier extends keyof ExecutionTypes> = LambdaInbound<ExecutionTypes[ExecutionTypeIdentifier][0]>;

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
export type LambdaHandler<Context> = Handler<Context, void>;

/**
 * An implementation of middleware specialised for lambda.
 */
export type LambdaMiddleware<
  GivenInbound extends LambdaInboundConstraint,
  NextContext extends ContextConstraint,
  GivenContext extends ContextConstraint = ContextConstraint,
> = Middleware<GivenInbound, NextContext, GivenContext>;

/**
 * A lambda middleware that doesn't consume the inbound event.
 */
export type LambdaMiddlewareInboundless<
  NextContext extends ContextConstraint,
  GivenContext extends ContextConstraint = ContextConstraint,
> = LambdaMiddleware<LambdaInboundConstraint, NextContext, GivenContext>;

/**
 * A lambda middleware that is suited for validation of given context or inbound.
 */
export type LambdaMiddlewareValidator<
  GivenInbound extends LambdaInboundConstraint,
  GivenContext extends ContextConstraint,
> = LambdaMiddleware<GivenInbound, GivenContext, GivenContext>;

/**
 * A lambda middleware that is suited for validation of given context only.
 * This middleware is not typed to know about the given inbound.
 */
export type LambdaMiddlewareValidatorInboundless<
  GivenContext extends ContextConstraint,
> = LambdaMiddlewareInboundless<GivenContext, GivenContext>;
