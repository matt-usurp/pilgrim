import { ObjectLike } from '../common/object';

export type MiddlewareNext<Context extends ObjectLike, Response> = (context: Context) => Promise<Response>;

export type Middleware<
  GivenInbound,
  NextContext extends ObjectLike,
  GivenContext extends ObjectLike = ObjectLike,
> = (
  tools: {
    inbound: GivenInbound,
    context: GivenContext,
    next: MiddlewareNext<NextContext, Response>,
  }
) => Promise<Response>;
