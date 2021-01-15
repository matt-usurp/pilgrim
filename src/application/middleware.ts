import { ObjectLike } from '../common/object';
import { ContextConstraint } from './context';

/**
 * The middleware next function that is given within middlewares tooling.
 *
 * This function takes in the next context which can be the entire context or a partial context.
 * The given context is then deep-merged on top of the existing context that was originally given to the middleware.
 * This is done so that middleware types can contain partial contextual typing without needing to know about previous middlewares.
 */
export type MiddlewareNextFunction<
  GivenContext extends ContextConstraint,
  FunctionResult,
> = (context: GivenContext) => Promise<FunctionResult>;

/**
 * A middleware.
 *
 * A middleware provides context to the next inline middlewares or handlers.
 * They are provided with inbound information from the providers source (events and such).
 * Within the tooling is a next function that must be called if you wish to continue the chain of execution.
 * Otherwise return a new response to effectively end execution at that point.
 */
export type Middleware<
  GivenInbound,
  NextContext extends ObjectLike,
  GivenContext extends ObjectLike = ObjectLike,
  Response = any,
> = (
  tooling: {
    inbound: GivenInbound,
    context: GivenContext,
    next: MiddlewareNextFunction<NextContext, Response>,
  }
) => Promise<Response>;
