import { aws } from '../../src/provider/aws';

const target = aws<'aws:apigw:proxy:v2'>()
  .handle(async({ context }) => {
    context.request;

    // This is the expected return type for the specified event above.
    // Resolved as: APIGatewayProxyResultV2
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return {} as any;
  });

// The response is a function that lambda can trigger.
// In this case we just export it and define in the lambda configuration "file.target" for the function.
export { target };
