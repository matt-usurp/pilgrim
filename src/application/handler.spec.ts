import { HandlerBuilder, HandlerWrapper } from './handler';

type TestWrapper = HandlerWrapper<any, any>;

describe('src/application/handler.ts', (): void => {
  describe('HandlerBuilder', (): void => {
    describe('custom wrapper implementation', (): void => {
      it('given wrapper with fixed return, returns that value', async (): Promise<void> => {
        const wrapper: TestWrapper = () => async () => {
          return 'assert:wrapper:response';
        };

        const builder = new HandlerBuilder('test:provider', wrapper);
        const handler = builder.handle(async () => {
          return 'ignore:handler:response';
        })

        const result = await handler();

        expect(result).toBe('assert:wrapper:response');
      });

      it('given wrapper with concat return, uses given instance return', async (): Promise<void> => {
        const wrapper: TestWrapper = (instance) => async () => {
          const result = await instance({} as any);

          return `assert:wrapper:response//${result}`;
        };

        const builder = new HandlerBuilder('test:provider', wrapper);
        const handler = builder.handle(async () => {
          return 'ignore:handler:response';
        })

        const result = await handler();

        expect(result).toBe('assert:wrapper:response//ignore:handler:response');
      });
    });
  });
});
