import { Pilgrim } from '../main';

/**
 * Pilgrim handler types.
 *
 * These are used by the core library.
 * Aliases are provided through the main pilgrim namespace.
 *
 * @see Pilgrim.Handler for the public namespace.
 */
export namespace PilgrimHandler {
  /**
   * A handler that has access to the compiled context.
   *
   * Context can be mutated through the middleware system.
   * Middleware are made aware of the event source so they can provide validated context.
   *
   * @see Pilgrim.Handler
   */
  export type Handler<
    Context extends Pilgrim.Context.Constraint,
    Response
  > = Handler.Invoker<Handler.Invoker.Tooling<Context>, Response>;

  export namespace Handler {
    /**
     * An event source aware handler.
     *
     * @see PilgrimHandler.Handler
     * @see Pilgrim.Handler.SourceAware
     */
    export type SourceAware<Source, Context, Response> = Handler.Invoker<Handler.Invoker.ToolingSourceAware<Source, Context>, Response>;

    /**
     * Invoker is the main function body representation of the handler.
     */
    export type Invoker<Tooling, Response> = (tooling: Tooling) => Promise<Response>;

    export namespace Invoker {
      /**
       * Tooling refers to the object given to handler functions.
       * This tooling is aware of the compiled context.
       */
      export type Tooling<Context> = {
        readonly context: Context;
      };

      /**
       * Tooling refers to the object given to handler functions.
       * This tooling is aware of the compiled context as well as the event source.
       */
      export type ToolingSourceAware<Source, Context> = (
        & Invoker.Tooling<Context>
        & {
          readonly source: Source;
        }
      );
    }
  }
}
