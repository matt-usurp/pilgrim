import { Pilgrim } from '../../src/main';
import { aws, Lambda } from '../../src/provider/aws';

/**
 * Sources are used to provide specific type information to middleware functions.
 */
type LambdaEventSource = Lambda.Event<'aws:apigw:proxy:v2'>;

/**
 * This represents our handler.
 *
 * As you can see here the lambda requires some context that needs resolving.
 * If we were to just try and consume this handler with `aws('..').handler(handler)` we would get an error.
 * The base context is `Lambda.Context` and we have no way to provide the required context information.
 */
declare const handler: Lambda.Handler<LambdaEventSource, { user: string; }>;

/**
 * Here we define a middleware.
 *
 * It takes the same inbound as we need access to the event information.
 * However it is possible to use an "WithoutSource" variation if you are fabricating context.
 * We define that it returns some additional context that when used should satisfy our handler.
 */
declare const middleware: (
  Lambda.Middleware<
    LambdaEventSource,
    Pilgrim.Inherit, // Context expected inbound (from up chain)
    { user: string }, // Context provided by this middleware (outbound)
    Pilgrim.Inherit, // Response mutation parameters.
    Pilgrim.Inherit // Response mutation parameters.
  >
);

const target = aws<'aws:apigw:proxy:v2'>()
  .use(middleware)
  .handle(handler);

// The response is a function that lambda can trigger.
// In this case we just export it and define in the lambda configuration "file.target" for the function.
export { target };
