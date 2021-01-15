import { ObjectLike } from '../common/object';
import { Middleware } from './middleware';
import deepmerge from 'deepmerge';

export type Handler<Context> = (
  tools: {
    context: Context;
  }
) => Promise<any>

export type HandlerWrapperInstance<GivenInbound, Result> = (tools: { inbound: GivenInbound }) => Promise<Result>;
export type HandlerWrapper<GivenInbound, Result extends Function> = (instance: HandlerWrapperInstance<GivenInbound, any>) => Result;

export class HandlerBuilder<
  CurrentInbound,
  CurrentContext extends ObjectLike,
  ComposeFunction extends Function,
> {
  private middlewares: Middleware<CurrentInbound, ObjectLike, any>[] = [];

  public constructor(
    public readonly provider: string,
    private wrapper: HandlerWrapper<any, any>,
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
    const composed = this.middlewares.reduceRight((previous, middleware) => {
      return async(given) => {
        context

        // previous.bind(undefined)
        return middleware({
          context,
        });
      };
    }, () => {
      throw new Error('The final handler has been reached, please return a response instead of calling the next function!');
    });

    return this.wrapper(async () => {
      return handler({} as any);
    });
  };
}
