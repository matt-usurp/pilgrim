import { aws, Lambda, response } from '../../src/provider/aws';

type LambdaEventSource = Lambda.Event<'aws:apigw:proxy:v2'>;

/**
 * Defining the handler type.
 *
 * The context here can be anything, however the base context given is always "Lambda.Context".
 * This means that anything additional in the context must be provided by middleware.
 * Note, TypeScript will show this error in the handler usage.
 */
type MyHandler = Lambda.Handler<LambdaEventSource, Lambda.Context>;

const handler: MyHandler = async() => {
  return response.event({});
};

const target = aws<LambdaEventSource>()
  .handle(handler);

// The response is a function that lambda can trigger.
// In this case we just export it and define in the lambda configuration "file.target" for the function.
export { target };
