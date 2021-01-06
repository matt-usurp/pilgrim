import { ObjectLike } from '../common/object';
import { Middleware } from './middleware';

export type Handler<Context> = (
  tools: {
    context: Context;
  }
) => Promise<Response>

export type HandlerWrapperInstance<GivenInbound, Result> = (tools: { inbound: GivenInbound }) => Promise<Result>;
export type HandlerWrapper<GivenInbound, Result extends Function> = (instance: HandlerWrapperInstance<GivenInbound, any>) => Promise<Result>;

export class HandlerBuilder<
  CurrentInbound,
  CurrentContext extends ObjectLike,
> {
  private middlewares: Middleware<CurrentInbound, ObjectLike, any>[] = [];

  public constructor(
    private provider: string,
    private wrapper: HandlerWrapper<any, any>,
  ) {};

  public use<GivenMiddleware extends Middleware<CurrentInbound, UnknownNextContext, UnknownGivenContext>, UnknownGivenContext extends CurrentContext, UnknownNextContext extends ObjectLike>(
    middleware: GivenMiddleware,
  ): HandlerBuilder<
    CurrentInbound,
    GivenMiddleware extends Middleware<CurrentInbound, infer InferNewContext, UnknownGivenContext>
      ? CurrentContext & InferNewContext
      : CurrentContext
  > {
    this.middlewares.push(middleware);

    return this;
  };

  public handle<GivenHandler extends Handler<UnknownGivenContext>, UnknownGivenContext extends CurrentContext>(handler: GivenHandler): void {
    return;
  };
}
