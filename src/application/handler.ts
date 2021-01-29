import { Pilgrim } from '../main';

/**
 * The generic pattern for handler functions.
 */
export type HandlerFunction<Tooling, Response> = (tooling: Tooling) => Promise<Response>;

/**
 * Handler tooling given to a handler function.
 * These tools are intended to be access through parameter destructuring.
 */
export type HandlerTooling<Context> = {
  readonly context: Context;
};

/**
 * Handler tooling given to the handler function that also has knowledge of the event source.
 * These tools are intended to be access through parameter destructuring.
 */
export type HandlerToolingWithSource<Source, Context> = (
  & HandlerTooling<Context>
  & {
    readonly source: Source;
  }
);

/**
 * @deprecated use Pilgrim.Handler instead.
 */
export namespace PilgrimHandler {
  /**
   * @deprecated use Pilgrim.Handler instead.
   */
  export type Handler<Context extends Pilgrim.Context.Constraint, Response> = Pilgrim.Handler<Context, Response>;

  export namespace Handler {
    /**
     * @deprecated use Pilgrim.Handler.WithSource instead.
     */
    export type SourceAware<Source, Context extends Pilgrim.Context.Constraint, Response> = Pilgrim.Handler.WithSource<Source, Context, Response>;
  }
}
