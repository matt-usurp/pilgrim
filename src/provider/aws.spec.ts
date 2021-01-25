import * as AwsLambda from 'aws-lambda';
import { aws, Lambda } from './aws';

declare module './aws/lambda/sources' {
  interface LambdaEventSource {
    readonly 'test:event': EventSource<string, string>;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TestMiddleware = Lambda.Middleware<Lambda.Source<'test:event'>, any, any, string, string>;

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
          return `assert:response(${context.request.id})`;
        });

      const response = await handler(
        'lambda-event-here',
        context as unknown as AwsLambda.Context,
        callback,
      );

      expect(response).toBe('assert:response(test-request-id)');
    });

    it('with middleware, middleware has access to source', async() => {
      const handler = aws<'test:event'>()
        .use<TestMiddleware>(async({ source, context, next }) => {
          const previous = await next(context);

          return `middleware(${previous}):${source.event}:${source.context.functionName}`;
        })
        .handle(async({ context }) => {
          return `assert:response(${context.request.id})`;
        });

        const response = await handler(
          'lambda-event-here',
          context as unknown as AwsLambda.Context,
          callback,
        );

      expect(response).toBe('middleware(assert:response(test-request-id)):lambda-event-here:test-function');
    });
  });
});
