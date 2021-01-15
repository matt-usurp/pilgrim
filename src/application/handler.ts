import deepmerge from 'deepmerge';
import { ObjectLike } from '../common/object';
import { Middleware, MiddlewareNext } from './middleware';

export type Handler<Context> = (
  tools: {
    context: Context;
  }
) => Promise<any>

/**
 * A handler wrapper for invocation.
 *
 * This function  takes the given "executor" function and prepares a new function that can be executed by the provider.
 * For example, if this were lambda it would construct a LambdaHandler function that takes an event and function context.
 */
export type HandlerWrapper<GivenInbound, BaseContext, ProviderInvocationFunction extends Function> = (
  executor: HandlerWrapperExecutor<GivenInbound, BaseContext, any>,
) => ProviderInvocationFunction;

/**
 * A handler wrapper executor for invoking handler functions.
 *
 * This function is what the handler builder implements and provides the abstract wrapper function.
 * Note, in all cases this will need a manually composed base context and the inbound.
 */
export type HandlerWrapperExecutor<GivenInbound, BaseContext, Result> = (
  tools: {
    inbound: GivenInbound,
    context: BaseContext,
  },
) => Promise<Result>;

export class HandlerBuilder<
  CurrentInbound,
  CurrentContext extends ObjectLike,
  ComposeFunction extends Function,
> {
  private middlewares: Middleware<CurrentInbound, ObjectLike, any>[] = [];

  public constructor(
    public readonly provider: string,
    private wrapper: HandlerWrapper<any, any, any>,
  ) {};

  public use<GivenMiddleware extends Middleware<CurrentInbound, UnknownNextContext, UnknownGivenContext>, UnknownGivenContext extends CurrentContext, UnknownNextContext extends ObjectLike>(
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
  };

  public handle<GivenHandler extends Handler<UnknownGivenContext>, UnknownGivenContext extends CurrentContext>(handler: GivenHandler): ComposeFunction {
    return this.wrapper(async ({ inbound, context }) => {

      // need to create essentially a chain of middleware
      // where given context is merged to with the next context
      // which triggers the next context, repeating
      const wrapped = this.middlewares.reduceRight<MiddlewareNext<any, any>>((previous, middleware) => {
        return async(context) => {
          const next: MiddlewareNext<any, any> = (newcontext) => {
            const merged = deepmerge(context, newcontext);

            return previous(merged);
          };

          // previous.bind(undefined)
          return middleware({ inbound, context, next });
        };
      }, (context) => {
        return handler({ context })
      });

      return wrapped(context);
    });
  };
}
