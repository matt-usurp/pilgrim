import deepmerge from 'deepmerge';
import { ContextConstraint } from './context';
import { Middleware, MiddlewareNextFunction } from './middleware';

/**
 * A handler function that executes the main functionality.
 *
 * This handler is not aware of inbound information and requires a well defined context.
 */
export type Handler<
  Context,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Result = any,
> = (
  tooling: {
    context: Context;
  },
) => Promise<Result>;

/**
 * A handler function that executes the main functionality.
 *
 * This handler has access to any generated context up-to this point.
 * But also is aware of the inbound information from the event source.
 *
 * This is not recommended for general use but cases where inbound information is consumed directly.
 */
export type HandlerWithInbound<
  Inbound,
  Context,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Result = any,
> = (
  tooling: {
    inbound: Inbound;
    context: Context;
  },
) => Promise<Result>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HandlerWrapperProviderFunction = (...args: any[]) => any;

/**
 * A handler wrapper for invocation.
 *
 * This function  takes the given "executor" function and prepares a new function that can be executed by the provider.
 * For example, if this were lambda it would construct a LambdaHandler function that takes an event and function context.
 */
export type HandlerWrapper<
  GivenInbound,
  BaseContext extends ContextConstraint,
  ProviderInvocationFunction extends HandlerWrapperProviderFunction,
> = (
  executor: HandlerWrapperExecutor<GivenInbound, BaseContext, BaseContext>,
) => ProviderInvocationFunction;

/**
 * A handler wrapper executor for invoking handler functions.
 *
 * This function is what the handler builder implements and provides the abstract wrapper function.
 * Note, in all cases this will need a manually composed base context and the inbound.
 */
export type HandlerWrapperExecutor<GivenInbound, BaseContext extends ContextConstraint, FunctionResult> = (
  tooling: {
    inbound: GivenInbound,
    context: BaseContext,
  },
) => Promise<FunctionResult>;

export class HandlerBuilder<
  GivenInbound,
  CurrentContext extends ContextConstraint,
  ComposeFunction extends HandlerWrapperProviderFunction,
> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly middlewares: Middleware<GivenInbound, ContextConstraint, any>[] = [];

  public constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly wrapper: HandlerWrapper<any, any, any>,
  ) {}

  /**
   * Provide a middleware function to mutate the current context.
   */
  public use<
    GivenMiddleware extends Middleware<GivenInbound, UnknownNextContext, UnknownGivenContext>,
    UnknownGivenContext extends CurrentContext,
    UnknownNextContext extends ContextConstraint,
  >(
    middleware: GivenMiddleware,
  ): HandlerBuilder<
    GivenInbound,
    GivenMiddleware extends Middleware<GivenInbound, infer InferNewContext, UnknownGivenContext>
      ? CurrentContext & InferNewContext
      : CurrentContext,
    ComposeFunction
  > {
    this.middlewares.push(middleware);

    return this;
  }

  /**
   * Provide a handler to finalise the execution.
   */
  public handle<
    GivenHandler extends Handler<UnknownGivenContext>,
    UnknownGivenContext extends CurrentContext,
  >(handler: GivenHandler): ComposeFunction {
    return this.wrapper(async({ inbound, context }) => {
      const exector: MiddlewareNextFunction = async(context) => handler({ context });
      const composed = this.build(inbound, exector);

      return composed(context);
    });
  }

  /**
   * Provide a handler (with knowledge of the inbound) to finalise the execution.
   *
   * This is not the recommended kind of handler to use for general use.
   * Preferrably you have a combination of middleware and a context to provide.
   *
   * However sometimes some handlers just need to know the inbound details straight up.
   * That might be processing some kind of raw event payload (e.g SNS, SES, SQS) where a middleware makes no sense.
   * This is the use-case for this kind of handler.
   */
  public handleWithInbound<
    GivenHandler extends HandlerWithInbound<GivenInbound, UnknownGivenContext>,
    UnknownGivenContext extends CurrentContext,
  >(handler: GivenHandler): ComposeFunction {
    return this.wrapper(async({ inbound, context }) => {
      const exector: MiddlewareNextFunction = async(context) => handler({ inbound, context });
      const composed = this.build(inbound, exector);

      return composed(context);
    });
  }

  /**
   * Build a middleware wrapped executor function.
   */
  private build(inbound: GivenInbound, exector: MiddlewareNextFunction): MiddlewareNextFunction {
    return this.middlewares.reduceRight<MiddlewareNextFunction>((previous, middleware) => {
      return async(context) => {
        const next: MiddlewareNextFunction = async(newcontext) => {
          const merged = deepmerge(context, newcontext);

          return previous(merged);
        };

        return middleware({ inbound, context, next });
      };
    }, exector);
  }
}
