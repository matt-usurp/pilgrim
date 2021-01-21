import { aws } from './aws';

describe('src/provider/aws.ts', (): void => {
  describe('HandlerBuilder', (): void => {
    it('no middleware', async() => {
      const handler = aws<'aws:apigw:proxy:v1'>()
        .handle(async() => {
          return 'assert:response';
        });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await handler({} as any, {} as any, {} as any);

      expect(response).toBe('assert:response');
    });

    it('composing middleware', async() => {
      const handler = aws<'aws:apigw:proxy:v1'>()
        .use(async({ context, next }) => {
          const previous = await next(context);

          return `middleware:${previous}`;
        })
        .handle(async() => {
          return 'assert:response';
        });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await handler({} as any, {} as any, {} as any);

      expect(response).toBe('middleware:assert:response');
    });
  });
});
