import { PilgrimContext } from './application/context';
import { PilgrimHandler } from './application/handler';
import { PilgrimMiddleware } from './application/middleware';

export namespace Pilgrim {
  /**
   * A value that can be used in place where a value should be inherited.
   *
   * @see PilgrimMiddleware.Inherit
   */
  export type Inherit = PilgrimMiddleware.Inherit;

  /**
   * A handler function that takes the given context and returns a specified response.
   *
   * Handlers are not made aware of the event source by default.
   * Additional context can be provided by using middleware which does have access to the event source.
   * If your use case needs direct access to the event source without middleware use the source aware handler.
   *
   * @see Pilgrim.Middleware for more information on middleware and context
   * @see Pilgrim.Handler.SourceAware for an event source aware handler implementation
   */
  export type Handler<Context, Response> = PilgrimHandler.Handler<Context, Response>;

  export namespace Handler {
    /**
     * A handler function that takes the given context and event source.
     *
     * This handler is not recommended but is provided for use cases where middleware can be considered over engineering.
     *
     * @see Pilgrim.Handler for the more recommended handler implementation
     * @see Pilgrim.Middleware for more information on middleware and context
     */
    export type SourceAware<Source, Context, Response> = PilgrimHandler.Handler.SourceAware<Source, Context, Response>;
  }

  /**
   * A middleware that defines the mutation of context and resources.
   * The middleware has access to the event source so it can provided it to the handler via context.
   * This middleware is handy for cases where validation needs to happen on known event source details.
   *
   * @see PilgrimMiddleware.Middleware for more information on middleware
   * @see PilgrimHandler.Handler for more information on handler
   */
  export type Middleware<
    Source,
    ContextInbound extends PilgrimContext.Context.Constraint,
    ContextOutbound extends PilgrimContext.Context.Constraint,
    ResponseInbound,
    ResponseOutbound,
  > = PilgrimMiddleware.Middleware<Source, ContextInbound, ContextOutbound, ResponseInbound, ResponseOutbound>;

  export namespace Middleware {
    /**
     * A middleware that defines the mutation of context and resources.
     * This middleware doesn't have access to event source so context is frabicated through some process.
     * This middleware is handy for cases where validation needs to happen on known context.
     *
     * @see PilgrimMiddleware.Middleware for more information on middleware
   * @see PilgrimHandler.Handler for more information on handler
     */
    export type WithoutSource<
      ContextInbound extends PilgrimContext.Context.Constraint,
      ContextOutbound extends PilgrimContext.Context.Constraint,
      ResponseInbound,
      ResponseOutbound,
    > = PilgrimMiddleware.Middleware<never, ContextInbound, ContextOutbound, ResponseInbound, ResponseOutbound>;
  }
}
