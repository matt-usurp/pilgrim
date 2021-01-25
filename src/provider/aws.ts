import { HandlerBuilder } from '../application/handler/builder';
import { PilgrimProvider } from '../application/provider';
import { Lambda, LambdaHandler } from './aws/lambda';
import { LambdaEventSource } from './aws/lambda/sources';

// Re-export the lambda namespace.
// Providing a slightly better DUX for importing.
export { Lambda };

type LambdaProviderCompositionFunction<HandlerEvent, HandlerResponse, InvokerResponse> = (
  PilgrimProvider.CompositionFunction<
    Lambda.Source.Constraint,
    Lambda.Context,
    InvokerResponse,
    LambdaHandler<HandlerEvent, HandlerResponse>
  >
);

type ComposerFunction = LambdaProviderCompositionFunction<
  // Generic composer needs greedy event to not cause type errors.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // Generic composer needs greedy response to not cause type errors.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // Generic composer needs greedy invoker response to not cause type errors.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
>;

/**
 * Default aws provider composition function for lambda.
 */
const composer: ComposerFunction = (executor) => async(event, context) => {
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
    LambdaProviderCompositionFunction<
      Lambda.Event<K>['Event'],
      Lambda.Event<K>['Response'],
      Lambda.Event<K>['Response']
    >,
    // Response constraint cannot be enforced right now as we do not enforce a common response type.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    Lambda.Context,
    Lambda.Event<K>['Response']
  >
) {
  return new HandlerBuilder(composer);
}
