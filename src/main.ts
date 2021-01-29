import { HandlerFunction, HandlerTooling, HandlerToolingWithSource } from './application/handler';
import { MiddlewareFunction } from './application/middleware';
import { HttpResponseData } from './application/response';
import { Grok } from './language/grok';

export * as response from './response';

export namespace Pilgrim {
  /**
   * A value that represents inherit.
   *
   * Although this value is essentially any at the moment it should not be abused.
   * It is recommended to use this type instead of "any" directly as the implementation might change at a later date.
   */
  export type Inherit = (
    // Any used until inherit can be better considered in its use cases.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  );

  /**
   * Context refers to information that is being passed down to the handler.
   * By default this is governed by the provider implementation being used.
   * Middleware can enhance the context by using the given event source.
   */
  export namespace Context {
    /**
     * A constraint for contexts.
     */
    export type Constraint = Record<string, unknown>;
  }

  /**
   * Create a custom response.
   */
  export type Response<ResponseType extends string, Value> = {
    readonly type: ResponseType;
    readonly value: Value;
  };

  export namespace Response {
    /**
     * A constraint for responses.
     */
    export type Constraint = Pilgrim.Response<string, unknown>;

    /**
     * A nothing response.
     */
    export type Nothing = Pilgrim.Response<'nothing', never>;

    /**
     * A http response.
     */
    export type Http = Pilgrim.Response<'http', HttpResponseData>;
  }

  /**
   * A handler function that takes the given context and returns a specified response.
   *
   * Handlers are provided with tooling that only have access to the context.
   * Context is data provided by middleware that is gathered from context.
   * A handler does not have access to an event source by default.
   *
   * In some use cases it would be long winded to build middleware where the handler needs direct access to the event source.
   * For this case you can make use of the the `Pilgrim.Handler.WithSource` which can access the event source.
   * Note, that this needs to be given to the `handleWithSource()` instead.
   *
   * @see Pilgrim.Middleware for more information on middleware.
   * @see Pilgrim.Handler.WithSource for more information on event source aware handlers.
   */
  export type Handler<
    Context extends Pilgrim.Context.Constraint,
    Response
  > = HandlerFunction<HandlerTooling<Context>, Response>;

  export namespace Handler {
    /**
     * An extended handler function with the event source supplied within its tooling.
     *
     * @see Pilgrim.Handler for more information on handlers.
     * @see Pilgrim.Middleware for more information on middleware.
     */
    export type WithSource<
      Source,
      Context extends Pilgrim.Context.Constraint,
      Response
    > = HandlerFunction<HandlerToolingWithSource<Source, Context>, Response>;

    /**
     * @deprecated use Pilgrim.Handler.WithSource
     */
    export type SourceAware<Source, Context extends Pilgrim.Context.Constraint, Response> = WithSource<Source, Context, Response>;
  }

  /**
   * A middleware function that takes the given event source and provided context for handlers.
   *
   * Middleware are a way of extracting common tasks that operate on event sources.
   * A good example is parsing http GET arguments and exposing them through context with sensible defaults.
   * This removes lots of boiler plate from your handler and also makes your handler easier to test.
   *
   * @see Pilgrim.Handler.Handler for more information on handlers.
   */
  export type Middleware<
    Source,
    ContextInbound extends Pilgrim.Context.Constraint,
    ContextOutbound extends Pilgrim.Context.Constraint,
    ResponseInbound,
    ResponseOutbound,
  > = (
    & MiddlewareFunction<Source, ContextInbound, ContextOutbound, ResponseInbound, ResponseOutbound>
    & {
      readonly Source?: Source;
      readonly ContextInbound?: Grok.Data.Covariant<ContextInbound>;
      readonly ContextOutbound?: Grok.Data.Covariant<ContextOutbound>;
      readonly ResponseInbound?: ResponseInbound;
      readonly ResponseOutbound?: ResponseOutbound;
    }
  );

  export namespace Middleware {
    /**
     * A middleware function that doesn't have care about the event source.
     *
     * This kind of middleware is commonly used when external services are used or a middleware uses existing context.
     * In most cases this will not be the middleware you would want to use.
     *
     * @see Pilgrim.Middleware for more information on middlewares.
     * @see Pilgrim.Handler.Handler for more information on handlers.
     */
    export type WithoutSource<
      ContextInbound extends Pilgrim.Context.Constraint,
      ContextOutbound extends Pilgrim.Context.Constraint,
      ResponseInbound,
      ResponseOutbound,
    > = (
      Pilgrim.Middleware<
        // Any usage so we don't care about source constraints.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any,
        ContextInbound,
        ContextOutbound,
        ResponseInbound,
        ResponseOutbound
      >
    );
  }
}
