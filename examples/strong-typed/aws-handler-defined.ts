import { aws, Lambda } from '../../src/provider/aws';

/**
 * Pseudo-code for defining a handler.
 *
 * The context here can be anything, however the base context given is always "Lambda.Context".
 * This means that anything additional in the context must be provided by middleware.
 * Note, TypeScript will show this error in the handler usage.
 */
declare const handler: Lambda.Handler<
  Lambda.Context,
  Lambda.Event.GetResponse<'aws:apigw:proxy:v2'>
>;

const target = aws<'aws:apigw:proxy:v2'>()
  .handle(handler);

// The response is a function that lambda can trigger.
// In this case we just export it and define in the lambda configuration "file.target" for the function.
export { target };
