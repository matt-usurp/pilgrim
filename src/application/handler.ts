import deepmerge from 'deepmerge';
import { ContextConstraint } from './context';
import { Middleware, MiddlewareNextFunction } from './middleware';

/**
 * The handler function that executes the main functions.
 */
export type Handler<Context, Result> = (
  tooling: {
    context: Context;
  },
) => Promise<Result>

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
  executor: HandlerWrapperExecutor<GivenInbound, BaseContext, any>,
) => ProviderInvocationFunction;

/**
 * A handler wrapper executor for invoking handler functions.
 *
 * This function is what the handler builder implements and provides the abstract wrapper function.
 * Note, in all cases this will need a manually composed base context and the inbound.
 */
export type HandlerWrapperExecutor<GivenInbound, BaseContext extends ContextConstraint, FunctionResult> = (
  tools: {
    inbound: GivenInbound,
    context: BaseContext,
  },
) => Promise<FunctionResult>;

export class HandlerBuilder<
  CurrentInbound,
  CurrentContext extends ContextConstraint,
  ComposeFunction extends HandlerWrapperProviderFunction,
> {
  private middlewares: Middleware<CurrentInbound, ContextConstraint, any>[] = [];

  public constructor(
    public readonly provider: string,
    private readonly wrapper: HandlerWrapper<any, any, any>,
  ) {}

  public use<
    GivenMiddleware extends Middleware<CurrentInbound, UnknownNextContext, UnknownGivenContext>,
    UnknownGivenContext extends CurrentContext,
    UnknownNextContext extends ContextConstraint,
  >(
    middleware: GivenMiddleware,
  ): HandlerBuilder<
    CurrentInbound,
    GivenMiddleware extends Middleware<CurrentInbound, infer InferNewContext, UnknownGivenContext>
      ? CurrentContext & InferNewContext
      : CurrentContext,
    ComposeFunction
  > {
    this.middlewares.push(middleware);

    return this;
  }

  public handle<
    GivenHandler extends Handler<UnknownGivenContext, any>,
    UnknownGivenContext extends CurrentContext,
  >(handler: GivenHandler): ComposeFunction {
    return this.wrapper(async ({ inbound, context }) => {
      const wrapped = this.middlewares.reduceRight<MiddlewareNextFunction<any, any>>(
        (previous, middleware) => {
          return async(context) => {
            const next: MiddlewareNextFunction<any, any> = (newcontext) => {
              const merged = deepmerge(context, newcontext);

              return previous(merged);
            };

            return middleware({ inbound, context, next });
          };
        },
        (context) => handler({ context }),
      );

      return wrapped(context);
    });
  }
}
