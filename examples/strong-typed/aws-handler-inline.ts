import { aws } from '../../src/provider/aws';

const target = aws<'aws:apigw:proxy:v2'>()
  .handle(async({ context }) => {
    context.request;
  });

// The response is a function that lambda can trigger.
// In this case we just export it and define in the lambda configuration "file.target" for the function.
export { target };
