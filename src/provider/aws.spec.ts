import * as AwsLambda from 'aws-lambda';
import { Pilgrim } from '../main';
import { aws, response, Lambda } from './aws';

declare module './aws/lambda/sources' {
  interface LambdaEventSource {
    readonly 'test:event': EventSource<string, Lambda.Response<string>>;
  }
}

type TestSource = Lambda.Source<'test:event'>;
type TestMiddleware = (
  Lambda.Middleware<
    TestSource,
    Pilgrim.Inherit,
    Pilgrim.Inherit,
    Lambda.Response<string>,
    Lambda.Response<string>
  >
);

/**
 * Callback should never be used.
 * This is however a required parameter for the handler.
 */
const callback: AWSLambda.Callback = () => {
  throw new Error('Unexpected function call: callback');
};

/**
 * Partial context.
 */
const context: Pick<AwsLambda.Context, 'awsRequestId' | 'functionName' | 'functionVersion'> = {
  awsRequestId: 'test-request-id',
  functionName: 'test-function',
  functionVersion: '1.1.2',
};

describe('src/provider/aws.ts', (): void => {
  describe('aws()', (): void => {
    it('no middleware, handler has access to basic context provided', async() => {
      const handler = aws<'test:event'>()
        .handle(async({ context }) => {
          return response.event(`assert:response(${context.request.id})`);
        });

      const awaited = await handler(
        'lambda-event-here',
        context as unknown as AwsLambda.Context,
        callback,
      );

      expect(awaited).toBe('assert:response(test-request-id)');
    });

    it('with middleware, middleware has access to source', async() => {
      const handler = aws<'test:event'>()
        .use<TestMiddleware>(async({ source, context, next }) => {
          const previous = await next(context);

          if (previous.type === 'aws:event') {
            return response.event(`middleware(${previous.value}):${source.event}:${source.context.functionName}`);
          }

          return previous;
        })
        .handle(async({ context }) => {
          return response.event(`assert:response(${context.request.id})`);
        });

        const awaited = await handler(
          'lambda-event-here',
          context as unknown as AwsLambda.Context,
          callback,
        );

      expect(awaited).toBe('middleware(assert:response(test-request-id)):lambda-event-here:test-function');
    });
  });
});
