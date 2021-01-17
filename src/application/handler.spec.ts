import { HandlerBuilder, HandlerWrapper } from './handler';

type TestInbound = { test: true; };
type TestContext = { foo: string; };

type TestWrapperInvocationFunction = () => unknown;
type TestWrapper = HandlerWrapper<TestInbound, TestContext, TestWrapperInvocationFunction>;

type TestHandlerBuilder = HandlerBuilder<TestInbound, TestContext, TestWrapperInvocationFunction>;

/**
 * A test wrapper that appends its own string to the executors response.
 */
const composingTextWrapper: TestWrapper = (executor) => async() => {
  const result = await executor({
    inbound: {
      test: true,
    },

    context: {
      foo: 'baz',
    },
  });

  return `wrapper(${JSON.stringify(result)})`;
};

/**
 * A pass through wrapper that just gives the executions response.
 */
const passThroughWrapper: TestWrapper = (executor) => async() => {
  return executor({
    inbound: {
      test: true,
    },

    context: {
      foo: 'baz',
    },
  });
};

describe('src/application/handler.ts', (): void => {
  describe('HandlerBuilder', (): void => {
    describe('custom wrapper implementation', (): void => {
      it('given wrapper that ignores executor, returns fixed value', async(): Promise<void> => {
        const wrapper: TestWrapper = () => async() => {
          return 'assert:wrapper:response';
        };

        const builder = new HandlerBuilder('test:provider', wrapper);
        const handler = builder.handle(async() => {
          return 'ignored:handler:response';
        });

        const result = await handler();

        expect(result).toBe('assert:wrapper:response');
      });
    });

    describe('use cases', (): void => {
      it('given no middleware, base context is given to handler', async() => {
        const builder: TestHandlerBuilder = new HandlerBuilder('test:provider', composingTextWrapper);
        const handler = builder.handle(async({ context }) => {
          return context.foo;
        });

        const response = await handler();

        expect(response).toBe('wrapper("baz")');
      });

      it('given no middleware, response from handler is given as execution response', async() => {
        const builder: TestHandlerBuilder = new HandlerBuilder('test:provider', composingTextWrapper);
        const handler = builder.handle(async() => {
          return 'handler-response';
        });

        const response = await handler();

        expect(response).toBe('wrapper("handler-response")');
      });

      it('given single middleware, middleware changes response from handler, new response given as execution response', async() => {
        const builder: TestHandlerBuilder = new HandlerBuilder('test:provider', composingTextWrapper);
        const handler = builder
          .use(async({ context, next }) => {
            const previous = await next(context);

            return `middleware:${previous}`;
          })
          .handle(async() => {
            return 'handler-response';
          });

        const response = await handler();

        expect(response).toBe('wrapper("middleware:handler-response")');
      });

      it('given single middleware, middleware changes given context, handler receives new context', async() => {
        const builder: TestHandlerBuilder = new HandlerBuilder('test:provider', passThroughWrapper);
        const handler = builder
          .use(async({ next } ) => {
            return next({
              theme: 'dark',
            });
          })
          .handle(async({ context }) => {
            return `handler-response:${context.theme}`;
          });

        const response = await handler();

        expect(response).toEqual('handler-response:dark');
      });

      it('given multiple middleware, each can change response of previous, given as execution response', async() => {
        const builder: TestHandlerBuilder = new HandlerBuilder('test:provider', passThroughWrapper);
        const handler = builder
          .use(async({ context, next } ) => {
            const previous = await next(context);

            return {
              ...previous,
              headers: {
                'content-type': 'application/json',
              }
            };
          })
          .use(async({ context, next} ) => {
            const previous = await next(context);

            return {
              ...previous,
              body: JSON.stringify(previous.body),
            };
          })
          .handle(async() => {
            return {
              headers: {},
              body: {}
            };
          });

        const response = await handler();

        expect(response).toEqual({
          headers: {
            'content-type': 'application/json',
          },
          body: '{}',
        });
      });

      it('given two middleware, altering contexts are merged for handler, handler recieves merged context', async() => {
        const builder: TestHandlerBuilder = new HandlerBuilder('test:provider', passThroughWrapper);
        const handler = builder
          .use(async({ next } ) => {
            return next({
              headers: {
                'content-type': 'text/html',
              }
            });
          })
          .use(async({ next} ) => {
            return next({
              headers: {
                'content-type': 'application/json',
                'context-length': 5,
              }
            });
          })
          .handle(async({ context }) => {
            return context;
          });

        const response = await handler();

        expect(response).toEqual({
          foo: 'baz',
          headers: {
            'content-type': 'application/json',
            'context-length': 5,
          }
        });
      });

      it('given multiple middleware, altering contexts are deep merged, handler given deep merged context', async() => {
        const builder: TestHandlerBuilder = new HandlerBuilder('test:provider', passThroughWrapper);
        const handler = builder
          .use(async({ next }) => {
            return next({
              some: {
                nested: {
                  context: {
                    a: 1
                  }
                }
              }
            });
          })
          .use(async({ next }) => {
            return next({
              some: {
                nested: {
                  context: {
                    b: 2
                  }
                }
              }
            });
          })
          .use(async({ next }) => {
            return next({
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
          foo: 'baz',
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
        const builder: TestHandlerBuilder = new HandlerBuilder('test:provider', composingTextWrapper);
        const handler = builder
          .use(async({ context, next }) => {
            const previous = await next(context);

            return `first:${previous}`;
          })
          .use(async({ context, next }) => {
            const previous = await next(context);

            return `second:${previous}`;
          })
          .use(async({ context, next }) => {
            const previous = await next(context);

            return `third:${previous}`;
          })
          .handle(async() => {
            return 'assert:response';
          });

        const response = await handler();

        expect(response).toBe('wrapper("first:second:third:assert:response")');
      });

      // @todo DELETE ONCE OTHERS ARE DONE
      it('given simple middleware, middleware executed to modify response', async() => {
        const builder: TestHandlerBuilder = new HandlerBuilder('test:provider', composingTextWrapper);
        const handler = builder
          .use(async({ context, next }) => {
            const previous = await next(context);

            return `middleware:${previous}`;
          })
          .handle(async() => {
            return 'assert:response';
          });

        const response = await handler();

        expect(response).toBe('wrapper("middleware:assert:response")');
      });
    });
  });
});
