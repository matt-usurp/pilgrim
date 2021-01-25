import { PilgrimHandler } from '../handler';
import { PilgrimMiddleware } from '../middleware';
import { PilgrimProvider } from '../provider';
import { PilgrimResponse, PilgrimResponseFactory } from '../response';
import { HandlerBuilder } from './builder';

type TestSource = { test: true; };
type TestContext = { from: string; };

type TestHttpResponseData = {
  headers: Record<string, string>;
  body: string;
};

type TestHttpResponse = PilgrimResponse.Response<'http', TestHttpResponseData>;

const http = (data: TestHttpResponseData): TestHttpResponse => {
  return (new PilgrimResponseFactory).create<TestHttpResponse>('http', data);
};

type TestProviderComposer<
  ChainResponse,
  ProviderResponse
> = (
  PilgrimProvider.InvokerComposer<
    TestSource,
    TestContext,
    ChainResponse,
    () => Promise<ProviderResponse>
  >
);

type TestHandlerBuilder<
  ResponseConstraint,
  Response extends ResponseConstraint,
  ProviderResponse
> = (
  HandlerBuilder<
    TestSource,
    TestProviderComposer<Response, ProviderResponse>,
    ResponseConstraint,
    TestContext,
    Response
  >
);

/**
 * A test wrapper that appends its own string to the executors response.
 */
const composingTextWrapper: TestProviderComposer<string, string> = (executor) => async() => {
  const previous = await executor({
    source: {
      test: true,
    },

    context: {
      from: 'text-composer-context-value',
    },
  });

  return `text-composer(${JSON.stringify(previous)})`;
};

/**
 * A pass through wrapper that just gives the executions response.
 */
const passThroughWrapper: TestProviderComposer<any, any> = (executor) => async() => {
  return executor({
    source: {
      test: true,
    },

    context: {
      from: 'pass-through-context-value',
    },
  });
};

describe('src/application/handler/builder.ts', (): void => {
  describe('HandlerBuilder', (): void => {
    describe('custom wrapper implementation', (): void => {
      it('given wrapper that ignores executor, returns fixed value', async(): Promise<void> => {
        const wrapper: TestProviderComposer<string, string> = () => async() => {
          return 'assert:wrapper:response';
        };

        const handler = (new HandlerBuilder(wrapper)).handle(async() => {
          return 'ignored:handler:response';
        });

        const result = await handler();

        expect(result).toBe('assert:wrapper:response');
      });
    });

    describe('use cases', (): void => {
      it('given no middleware, response from handler is given as execution response', async() => {
        const builder: TestHandlerBuilder<string, string, string> = new HandlerBuilder(composingTextWrapper);
        const handler = builder.handle(async() => {
          return 'handler-response';
        });

        const response = await handler();

        expect(response).toBe('text-composer("handler-response")');
      });

      it('given no middleware, base context is given to handler', async() => {
        const builder: TestHandlerBuilder<string, string, string> = new HandlerBuilder(composingTextWrapper);
        const handler = builder.handle(async({ context }) => {
          return context.from;
        });

        const response = await handler();

        expect(response).toBe('text-composer("text-composer-context-value")');
      });

      it('given single middleware, middleware changes response from handler, new response given as execution response', async() => {
        const builder: TestHandlerBuilder<string, string, string> = new HandlerBuilder(composingTextWrapper);
        const handler =builder
          .use<PilgrimMiddleware.Middleware<any, any, any, string, string>>(async({ context, next }) => {
            const previous = await next(context);

            return `test-middleware:${previous}`;
          })
          .handle(async() => {
            return 'handler-response';
          });

        const response = await handler();

        expect(response).toBe('text-composer("test-middleware:handler-response")');
      });

      it('given single middleware, middleware changes given context, handler receives new context', async() => {
        const builder: TestHandlerBuilder<string, string, string> = new HandlerBuilder(composingTextWrapper);
        const handler = builder
          .use<PilgrimMiddleware.Middleware<any, any, { theme: string }, string, string>>(async({ context, next } ) => {
            return next({
              ...context,

              theme: 'dark',
            });
          })
          .handle(async({ context }) => {
            return `handler-response:${context.theme}`;
          });

        const response = await handler();

        expect(response).toEqual('text-composer("handler-response:dark")');
      });

      it('given multiple middleware, each can change response of previous, given as execution response', async() => {
        const builder: TestHandlerBuilder<TestHttpResponse, TestHttpResponse, TestHttpResponse> = new HandlerBuilder(passThroughWrapper);
        const handler = builder
          .use<PilgrimMiddleware.Middleware<any, any, any, TestHttpResponse, TestHttpResponse>>(async({ context, next }) => {
            const previous = await next(context);

            if (previous.type === 'http') {
              return {
                ...previous,

                headers: {
                  'content-type': 'application/json',
                }
              };
            }

            return previous;
          })
          .use<PilgrimMiddleware.Middleware<any, any, any, TestHttpResponse, TestHttpResponse>>(async({ context, next }) => {
            const previous = await next(context);

            if (previous.type === 'http') {
              return {
                ...previous,

                body: JSON.stringify(previous.body),
              };
            }

            return previous;
          })
          .handle<PilgrimHandler.Handler<any, TestHttpResponse>>(async() => {
            return http({
              headers: {},
              body: {} as unknown as string
            });
          });

        const response = await handler();

        expect(response).toEqual({
          type: 'http',
          headers: {
            'content-type': 'application/json',
          },
          body: '{}',
        });
      });

      it('given two middleware, altering contexts are merged for handler, handler recieves merged context', async() => {
        const builder: TestHandlerBuilder<TestHttpResponse, TestHttpResponse, TestHttpResponse> = new HandlerBuilder(passThroughWrapper);
        const handler = builder
          .use<PilgrimMiddleware.Middleware<any, any, { headers: Record<string, string | number> }, any, any>>(async({ context, next }) => {
            return next({
              ...context,

              headers: {
                'content-type': 'text/html',
              }
            });
          })
          .use<PilgrimMiddleware.Middleware<any, any, { headers: Record<string, string | number> }, any, any>>(async({ context, next }) => {
            return next({
              ...context,

              headers: {
                'content-type': 'application/json',
                'context-length': 5,
              }
            });
          })
          .handle(async({ context }) => {
            return context as any;
          });

        const response = await handler();

        expect(response).toEqual({
          from: 'pass-through-context-value',
          headers: {
            'content-type': 'application/json',
            'context-length': 5,
          }
        });
      });

      it('given multiple middleware, altering contexts are deep merged, handler given deep merged context', async() => {
        const builder: TestHandlerBuilder<any, any, any> = new HandlerBuilder(passThroughWrapper);
        const handler = builder
          .use<PilgrimMiddleware.Middleware<any, any, { some: any }, any, any>>(async({ context, next }) => {
            return next({
              ...context,

              some: {
                nested: {
                  context: {
                    a: 1
                  }
                }
              }
            });
          })
          .use<PilgrimMiddleware.Middleware<any, any, { some: any }, any, any>>(async({ context, next }) => {
            return next({
              ...context,

              some: {
                nested: {
                  context: {
                    b: 2
                  }
                }
              }
            });
          })
          .use<PilgrimMiddleware.Middleware<any, any, { some: any }, any, any>>(async({ context, next }) => {
            return next({
              ...context,

              some: {
                nested: {
                  context: {
                    c: 3
                  }
                }
              }
            });
          })
          .handle(async({ context }) => {
            return context as any;
          });

        const response = await handler();

        expect(response).toEqual({
          from: 'pass-through-context-value',
          some: {
            nested: {
              context: {
                a: 1,
                b: 2,
                c: 3
              }
            }
          }
        });
      });

      it('given several middleware, execution order is as expected', async() => {
        const builder: TestHandlerBuilder<string, string, string> = new HandlerBuilder(composingTextWrapper);
        const handler = builder
          .use<PilgrimMiddleware.Middleware<any, any, any, string, string>>(async({ context, next }) => {
            const previous = await next(context);

            return `first:${previous}`;
          })
          .use<PilgrimMiddleware.Middleware<any, any, any, string, string>>(async({ context, next }) => {
            const previous = await next(context);

            return `second:${previous}`;
          })
          .use<PilgrimMiddleware.Middleware<any, any, any, string, string>>(async({ context, next }) => {
            const previous = await next(context);

            return `third:${previous}`;
          })
          .handle(async() => {
            return 'assert:response';
          });

        const response = await handler();

        expect(response).toBe('text-composer("first:second:third:assert:response")');
      });
    });
  });
});
