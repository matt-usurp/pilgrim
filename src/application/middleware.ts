import { Grok } from '../language/grok';
import { Pilgrim } from '../main';
import { HandlerToolingWithSource } from './handler';

/**
 * A context marking that makes a context unique.
 * This value is merged use to ensure that context is merged and provided where needed.
 *
 * If you are discovering this type due to an error, you need to merge context and provide it to next.
 */
export type MiddlewareContextMarking = {
  /**
   * @deprecated this value should not be used in your code!
   */
  readonly PilgrimMiddlewareInheritContextMarking: unique symbol;
};

/**
 * An inherit value for context values.
 *
 * If you are discovering this type due to an error, you need to merge context and provide it to next.
 */
export type MiddlewareContextInherit = MiddlewareContextMarking;

/**
 * A response marking that makes a response unique.
 * This value is used as part of the inherit response making sure its always returned.
 *
 * If you are discovering this type due to an error, you need to return the result from your next function.
 * The proper way to do response mutations in middleware is to test out your expected response.
 * Then return everything else in a default block so other middlewares can continue to operate on other responses.
 */
export type MiddlewareResponseMarking = {
  /**
   * @deprecated this value should not be used in your code!
   */
  readonly PilgrimMiddlewareInheritResponseMarking: unique symbol;
};

/**
 * An inherit value for responses from the middleware next function.
 *
 * If you are discovering this type due to an error, you need to return the result from your next function.
 * The proper way to do response mutations in middleware is to test out your expected response.
 * Then return everything else in a default block so other middlewares can continue to operate on other responses.
 */
export type MiddlewareResponseInherit = (
  & Pilgrim.Response<'middleware:inherit', never>
  & MiddlewareResponseMarking
);

/**
 * A generic pattern for middleware functions.
 *
 * This type is a little complex as certain values are replaced or merged with inherit values.
 * This is to ensure that all context and responses are passed through the chain.
 */
export type MiddlewareFunction<
  Source,
  ContextInbound extends Pilgrim.Context.Constraint,
  ContextOutbound extends Pilgrim.Context.Constraint,
  ResponseInbound,
  ResponseOutbound,
> = (
  (
    tooling: (
      MiddlewareTooling<
        Source,
        Grok.If<
          Grok.Is.Any<ContextInbound>,
          MiddlewareContextInherit,
          MiddlewareContextInherit & ContextInbound
        >,
        MiddlewareNextFunction<
          Grok.If<
            Grok.Is.Any<ContextOutbound>,
            MiddlewareContextInherit,
            MiddlewareContextInherit & ContextOutbound
          >,
          Grok.If<
            Grok.Is.Any<ResponseInbound>,
            MiddlewareResponseInherit,
            Grok.Mutator.Remove<MiddlewareResponseInherit | ResponseInbound>
          >
        >
      >
    )
  ) => Promise<(
    Grok.If<
      Grok.Is.Any<ResponseOutbound>,
      MiddlewareResponseInherit,
      MiddlewareResponseInherit | ResponseOutbound
    >
  )>
);

/**
 * A next function for moving up the chain.
 */
export type MiddlewareNextFunction<Context, Response> = (context: Context) => Promise<Response>;

/**
 * Middleware tooling given to a middleware function.
 * These tools are intended to be access through parameter destructuring.
 */
export type MiddlewareTooling<Source, Context, NextFunction> = (
  & HandlerToolingWithSource<Source, Context>
  & {
    readonly next: NextFunction;
  }
);
