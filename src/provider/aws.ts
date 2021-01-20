import { HandlerBuilder } from '../application/handler';
import { Lambda, LambdaEvents, LambdaHandlerEnhanced, LambdaWrapper } from './aws/lambda';

// Re-export the lambda namespace.
// Providing a slightly better DUX for importing.
export { Lambda };

/**
 * A typical implementation of the lambda wrapper.
 */
const wrapper: LambdaWrapper = (executor) => async(event, context) => {
  return executor({
    inbound: {
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
 * An AWS application helper.
 */
export class AmazonWebServiceApplication {
  /**
   * Create a handler that can be invoked by lambda.
   *
   * The result of this call is a fluent interface that can be used to apply middleware.
   * The final call should be the handle function which will wrap up the pipeline.
   * The response from the handle function should be exported and used as the function pointer in the lambda configuration.
   */
  public lambda<K extends keyof LambdaEvents>(
    provider: K,
  ): HandlerBuilder<Lambda.Inbound<K>, Lambda.Context, LambdaHandlerEnhanced> {
    return new HandlerBuilder(provider, wrapper);
  }
}
