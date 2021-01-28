import { aws, response } from '../../src/provider/aws';
import { withPilgrimHttpResponseSupport } from '../../src/provider/aws/middleware/http-response-support';

const target = aws<'aws:apigw:proxy:v2'>()
  .use(withPilgrimHttpResponseSupport)
  .handle(async({ context }) => {
    context.request;

    // Middleware has provided the ability to use the Pilgrim.Response.Http kind.
    // This is transformed in to any of the proxy compatible response types.
    return response.http({
      status: 200,
    });
  });

// The response is a function that lambda can trigger.
// In this case we just export it and define in the lambda configuration "file.target" for the function.
export { target };
