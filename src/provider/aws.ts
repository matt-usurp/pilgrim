import { HandlerBuilder } from '../application/handler/builder';
import { Lambda, LambdaProviderCompositionFunction } from './aws/lambda';
import { LambdaEventSource } from './aws/lambda/sources';

// Re-export the lambda namespace.
// Providing a slightly better DUX for importing.
export { Lambda };

const composer: LambdaProviderCompositionFunction = (executor) => async(event, context) => {
  return executor({
    source: {
      event,
      context,
    },

    context: {
      request: {
        id: context.awsRequestId,
      },
    },
  });
};

/**
 * Create a handler that can be invoked by lambda.
 *
 * The result of this call is a fluent interface that can be used to apply middleware.
 * The final call should be the handle function which will wrap up the pipeline.
 * The response from the handle function should be exported and used as the function pointer in the lambda configuration.
 */
export function aws<K extends keyof LambdaEventSource>(): (
  HandlerBuilder<
    Lambda.Source<K>,
    LambdaProviderCompositionFunction,
    any,
    Lambda.Context,
    any
  >
) {
  return new HandlerBuilder(composer);
}
