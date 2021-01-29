import { Grok } from '../language/grok';
import { Pilgrim } from '../main';
import { PilgrimHandler } from './handler';
import { PilgrimResponse } from './response';

/**
 * Pilgrim middleware types.
 *
 * These are used by the core library.
 * Aliases are provided through the main pilgrim namespace.
 *
 * @see Pilgrim.Middleware for the public namespace.
 */
export namespace PilgrimMiddleware {
  /**
   * A value that represents inherit.
   *
   * Although this value is essentially any it should not be abused.
   * It is recommended to use this type instead of "any" directly as the implementation might change.
   * Currently "any" is resolved to inherit values but at some point it might change to a marked symbol.
   */
  export type Inherit = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  );

  /**
   * Inherit types are provided to middleware for certain use cases.
   *
   * In most cases they are used to ensure the given data is passed down the chain.
   * Forgetting the merge or pass an inherit type will cause a build failure.
   */
  export namespace Inherit {
    /**
     * A marked context that is provided to all middleware.
     * This ensure the context is merged as expected down to the handler.
     */
    export type Context = Marking.ContextMarking;

    /**
     * A marked response that is required to be returned by all middleware.
     * This is returned from the next function and ensures all responses bubble down the chain.
     */
    export type Response = (
      & PilgrimResponse.Preset.Inherit
      & Marking.ResponseMarking
    );

    /**
     * Marking types that make inherit values unique and unconstrustable.
     */
    export namespace Marking {
      export type ContextMarking = { readonly PilgrimMiddlewareInheritContextMarking: unique symbol; };
      export type ResponseMarking = { readonly PilgrimMiddlewareInheritResponseMarking: unique symbol; };
    }
  }

  /**
   * Invoker is the main function body representation of the middleware.
   * The type is complex and ensure that data flows as expected.
   */
  export type Invoker<
    Source,
    ContextInbound extends Pilgrim.Context.Constraint,
    ContextOutbound extends Pilgrim.Context.Constraint,
    ResponseInbound,
    ResponseOutbound,
  > = (
    (
      tooling: (
        Invoker.Tooling<
          Source,
          Grok.If<
            Grok.Is.Any<ContextInbound>,
            Inherit.Context,
            Inherit.Context & ContextInbound
          >,
          Invoker.Next<
            Grok.If<
              Grok.Is.Any<ContextOutbound>,
              Inherit.Context,
              Inherit.Context & ContextOutbound
            >,
            Grok.If<
              Grok.Is.Any<ResponseInbound>,
              Inherit.Response,
              Grok.Mutator.Remove<Inherit.Response | ResponseInbound>
            >
          >
        >
      )
    ) => Promise<(
      Grok.If<
        Grok.Is.Any<ResponseOutbound>,
        Inherit.Response,
        Inherit.Response | ResponseOutbound
      >
    )>
  );

  export namespace Invoker {
    /**
     * The next function provided to middleware.
     */
    export type Next<Context, Response> = (context: Context) => Promise<Response>;

    /**
     * Tooling refers to the object given to middleware functions.
     * This tooling is aware of context (so far) and the event source.
     *
     * Additionally middlewares have a next function that allows them to continue the execution chain.
     *
     * @see PilgrimMiddleware.Invoker.Next
     */
    export type Tooling<Source, Context, NextFunction> = (
      & PilgrimHandler.Handler.Invoker.ToolingSourceAware<Source, Context>
      & {
        readonly next: NextFunction;
      }
    );
  }

  /**
   * A middleware allows for the validation and passing down of context to the handler.
   * Along with context middleware can also catch or mutate responses.
   *
   * @see Pilgrim.Middleware
   */
  export type Middleware<
    Source,
    ContextInbound extends Pilgrim.Context.Constraint,
    ContextOutbound extends Pilgrim.Context.Constraint,
    ResponseInbound,
    ResponseOutbound,
  > = (
    & Invoker<Source, ContextInbound, ContextOutbound, ResponseInbound, ResponseOutbound>
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
     * A constraint for middleware types.
     */
    export type Constraint = (
      Middleware<
        // Any usage is allowed for constraints.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any,
        // Any usage is allowed for constraints.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any,
        // Any usage is allowed for constraints.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any,
        // Any usage is allowed for constraints.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any,
        // Any usage is allowed for constraints.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any
      >
    );
  }
}
