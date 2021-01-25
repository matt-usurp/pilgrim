import { HandlerBuilder } from '../application/handler/builder';
import { Lambda, LambdaProviderComposer, LambdaSources } from './aws/lambda';

// Re-export the lambda namespace.
// Providing a slightly better DUX for importing.
export { Lambda };

const composer: LambdaProviderComposer = (executor) => async(event, context) => {
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
export function aws<K extends keyof LambdaSources>(): (
  HandlerBuilder<
    Lambda.Source<K>,
    LambdaProviderComposer,
    any,
    Lambda.Context,
    any
  >
) {
  return new HandlerBuilder(composer);
}
