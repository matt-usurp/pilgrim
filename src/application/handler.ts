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
