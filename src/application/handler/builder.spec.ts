import { Pilgrim } from '../../main';
import * as response from '../../response';
import { ProviderCompositionFunction } from '../provider';
import { HandlerBuilder } from './builder';

type TestSource = { test: true; };
type TestContext = { from: string; };

type TestHttpResponseData = {
  status: number;
  headers: Record<string, string>;
  body: unknown;
};

type TestStringResponse = Pilgrim.Response<'test:string', string>;
type TestHttpResponse = Pilgrim.Response<'test:http', TestHttpResponseData>;

const str = (value: string): TestStringResponse => {
  return response.create<TestStringResponse>('test:string', value);
};

const http = (value: TestHttpResponseData): TestHttpResponse => {
  return response.create<TestHttpResponse>('test:http', value);
};

type TestProviderComposer<
  ChainResponse extends Pilgrim.Response.Constraint,
  ProviderResponse
> = (
  ProviderCompositionFunction<
    TestSource,
    TestContext,
    ChainResponse,
    () => Promise<ProviderResponse>
  >
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PassThroughTestProviderComposer = TestProviderComposer<any, any>;

type TestHandlerBuilder<
  Response extends Pilgrim.Response.Constraint,
  ProviderResponse
> = (
  HandlerBuilder<
    TestSource,
    TestProviderComposer<Response, ProviderResponse>,
    TestContext,
    Response
  >
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PassThroughTestHandlerBuilder = TestHandlerBuilder<any, any>;

/**
 * A test wrapper that appends its own string to the executors response.
 */
const composingTextWrapper: TestProviderComposer<TestStringResponse, string> = (executor) => async() => {
  const previous = await executor({
    source: {
      test: true,
    },

    context: {
      from: 'text-composer-context-value',
    },
  });

  const unwrapped = response.unwrap(previous);

  return `text-composer(${JSON.stringify(unwrapped)})`;
};

/**
 * A pass through wrapper that just gives the executions response.
 */
const passThroughWrapper: PassThroughTestProviderComposer = (executor) => async() => {
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
        const wrapper: TestProviderComposer<TestStringResponse, string> = () => async() => {
          return 'assert:wrapper:response';
        };

        const handler = (new HandlerBuilder(wrapper)).handle(async() => {
          return str('ignored:handler:response');
        });

        const result = await handler();

        expect(result).toBe('assert:wrapper:response');
      });
    });

    describe('use cases', (): void => {
      it('given no middleware, response from handler is given as execution response', async() => {
        const builder: TestHandlerBuilder<TestStringResponse, string> = new HandlerBuilder(composingTextWrapper);
        const handler = builder.handle(async() => {
          return str('handler-response');
        });

        const response = await handler();

        expect(response).toBe('text-composer("handler-response")');
      });

      it('given no middleware, base context is given to handler', async() => {
        const builder: TestHandlerBuilder<TestStringResponse, string> = new HandlerBuilder(composingTextWrapper);
        const handler = builder.handle(async({ context }) => {
          return str(context.from);
        });

        const response = await handler();

        expect(response).toBe('text-composer("text-composer-context-value")');
      });

      it('given single middleware, middleware changes response from handler, new response given as execution response', async() => {
        type CaseMiddleware = (
          Pilgrim.Middleware<
            TestSource,
            Pilgrim.Inherit,
            Pilgrim.Inherit,
            TestStringResponse,
            TestStringResponse
          >
        );

        const builder: TestHandlerBuilder<TestStringResponse, string> = new HandlerBuilder(composingTextWrapper);
        const handler = builder
          .use<CaseMiddleware>(async({ context, next }) => {
            const previous = await next(context);

            return str(`test-middleware:${previous.value}`);
          })
          .handle(async() => {
            return str('handler-response');
          });

        const response = await handler();

        expect(response).toBe('text-composer("test-middleware:handler-response")');
      });

      it('given single middleware, middleware changes given context, handler receives new context', async() => {
        type CaseMiddleware = (
          Pilgrim.Middleware<
            TestSource,
            Pilgrim.Inherit,
            { theme: string },
            TestStringResponse,
            TestStringResponse
          >
        );

        const builder: TestHandlerBuilder<TestStringResponse, string> = new HandlerBuilder(composingTextWrapper);
        const handler = builder
          .use<CaseMiddleware>(async({ context, next } ) => {
            return next({
              ...context,

              theme: 'dark',
            });
          })
          .handle(async({ context }) => {
            return str(`handler-response:${context.theme}`);
          });

        const response = await handler();

        expect(response).toEqual('text-composer("handler-response:dark")');
      });

      it('given multiple middleware, each can change response of previous, given as execution response', async() => {
        type CaseMiddlewareOne = (
          Pilgrim.Middleware<
            TestSource,
            Pilgrim.Inherit,
            Pilgrim.Inherit,
            TestHttpResponse,
            Pilgrim.Response.Http
          >
        );

        type CaseMiddlewareTwo = (
          Pilgrim.Middleware<
            TestSource,
            Pilgrim.Inherit,
            Pilgrim.Inherit,
            TestHttpResponse,
            TestHttpResponse
          >
        );

        const builder: TestHandlerBuilder<Pilgrim.Response.Http, Pilgrim.Response.Http> = new HandlerBuilder(passThroughWrapper);
        const handler = builder
          .use<CaseMiddlewareOne>(async({ context, next }) => {
            const previous = await next(context);

            if (previous.type === 'test:http') {
              return {
                type: 'http',
                value: {
                  status: previous.value.status,
                  headers: previous.value.headers,
                  body: JSON.stringify(previous.value.body),
                },
              };
            }

            return previous;
          })
          .use<CaseMiddlewareTwo>(async({ context, next }) => {
            const previous = await next(context);

            if (previous.type === 'test:http') {
              return {
                type: 'test:http',
                value: {
                  ...previous.value,

                  headers: {
                    'content-type': 'application/nonsense',
                  },
                },
              };
            }

            return previous;
          })
          .handle<Pilgrim.Handler<Pilgrim.Inherit, TestHttpResponse>>(async() => {
            return http({
              status: 200,
              headers: {},
              body: {
                foo: 'handler:response',
                bar: true,
              },
            });
          });

        const response = await handler();

        expect(response.value).toEqual({
          status: 200,
          headers: {
            'content-type': 'application/nonsense',
          },
          body: '{"foo":"handler:response","bar":true}',
        });
      });

      it('given two middleware, altering contexts are merged for handler, handler receives merged context', async() => {
        type ExtraMiddlewareContext = {
          headers: Record<string, string | number>
        };

        type CaseMiddleware = (
          Pilgrim.Middleware<
            TestSource,
            Pilgrim.Inherit,
            ExtraMiddlewareContext,
            Pilgrim.Inherit,
            Pilgrim.Inherit
          >
        );

        const builder: TestHandlerBuilder<TestHttpResponse, TestHttpResponse> = new HandlerBuilder(passThroughWrapper);
        const handler = builder
          .use<CaseMiddleware>(async({ context, next }) => {
            return next({
              ...context,

              headers: {
                'content-type': 'text/html',
              }
            });
          })
          .use<CaseMiddleware>(async({ context, next }) => {
            return next({
              ...context,

              headers: {
                'content-type': 'application/json',
                'context-length': 5,
              }
            });
          })
          .handle(async({ context }) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        type CaseMiddleware = (
          Pilgrim.Middleware<
            TestSource,
            Pilgrim.Inherit,
            { some: unknown },
            Pilgrim.Inherit,
            Pilgrim.Inherit
          >
        );

        const builder: PassThroughTestHandlerBuilder = new HandlerBuilder(passThroughWrapper);
        const handler = builder
          .use<CaseMiddleware>(async({ context, next }) => {
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
          .use<CaseMiddleware>(async({ context, next }) => {
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
          .use<CaseMiddleware>(async({ context, next }) => {
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
            return context;
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
        type CaseMiddleware = (
          Pilgrim.Middleware<
            TestSource,
            Pilgrim.Inherit,
            Pilgrim.Inherit,
            TestStringResponse,
            TestStringResponse
          >
        );

        const builder: TestHandlerBuilder<TestStringResponse, string> = new HandlerBuilder(composingTextWrapper);
        const handler = builder
          .use<CaseMiddleware>(async({ context, next }) => {
            const previous = await next(context);

            return str(`first:${previous.value}`);
          })
          .use<CaseMiddleware>(async({ context, next }) => {
            const previous = await next(context);

            return str(`second:${previous.value}`);
          })
          .use<CaseMiddleware>(async({ context, next }) => {
            const previous = await next(context);

            return str(`third:${previous.value}`);
          })
          .handle(async() => {
            return str('assert:response');
          });

        const response = await handler();

        expect(response).toBe('text-composer("first:second:third:assert:response")');
      });
    });
  });
});
