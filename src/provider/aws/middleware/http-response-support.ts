import { Pilgrim } from '../../../main';
import { Lambda, response } from '../../aws';

type VersionOne = Lambda.Event.GetResponse<'aws:apigw:proxy:v1'>;
type VersionTwo = Lambda.Event.GetResponse<'aws:apigw:proxy:v2'>;

export type HttpResponseSupportMiddleware = (
  Pilgrim.Middleware.WithoutSource<
    Pilgrim.Inherit,
    Pilgrim.Inherit,
    Pilgrim.Response.Http,
    VersionOne | VersionTwo
  >
);

export const withPilgrimHttpResponseSupport: HttpResponseSupportMiddleware = async({ context, next }) => {
  const result = await next(context);

  if (result.type === 'http') {
    const unwrapped = response.unwrap(result);
    const headers = unwrapped.headers ?? {};

    return response.event({
      statusCode: unwrapped.status,
      body: unwrapped.body ?? '',
      headers,
    });
  }

  return result;
};
