import { AmazonWebServiceApplication } from './aws';

const application = new AmazonWebServiceApplication();

describe('src/provider/aws.ts', (): void => {
  describe('AmazonWebServiceApplication', (): void => {
    it('lambda() passes provider to HandlerBuilder', (): void => {
      const builder = application.lambda('aws:apigw:proxy:v1');

      expect(builder.provider).toBe('aws:apigw:proxy');
    });
  });

  describe('HandlerBuilder', (): void => {
    it('no middleware', async () => {
      const handler = application.lambda('aws:apigw:proxy:v1')
        .handle(async () => {
          return 'assert:response';
        });

      const response = await handler({} as any, {} as any, {} as any);

      expect(response).toBe('assert:response');
    });

    it('composing middleware', async () => {
      const handler = application.lambda('aws:apigw:proxy:v1')
        .use(async ({ context, next }) => {
          const previous = await next(context);

          return `middleware:${previous}`;
        })
        .handle(async () => {
          return 'assert:response';
        });

      const response = await handler({} as any, {} as any, {} as any);

      expect(response).toBe('middleware:assert:response');
    });
  });
});
