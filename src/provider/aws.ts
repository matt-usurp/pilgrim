import { HandlerBuilder } from '../application/handler/builder';
import { ProviderCompositionFunction } from '../application/provider';
import { Pilgrim } from '../main';
import { never } from './../response';
import { Lambda, LambdaHandler } from './aws/lambda';

export * as response from './aws/response';
export { Lambda };

type LambdaProviderCompositionFunction<
  HandlerEvent,
  HandlerResponse,
  InvokerResponse extends Pilgrim.Response.Constraint
> = (
  ProviderCompositionFunction<
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
  Lambda.Response.Constraint | Pilgrim.Response.Nothing
>;

/**
 * Default aws provider composition function for lambda.
 */
const composer: ComposerFunction = (executor) => async(event, context) => {
  const value = await executor({
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

  if (value.type === 'nothing') {
    return;
  }

  if (value.type === 'aws:event') {
    return value.value;
  }

  never(value);
};

/**
 * Create a handler that can be invoked by lambda.
 *
 * The result of this call is a fluent interface that can be used to apply middleware.
 * The final call should be the handle function which will wrap up the pipeline.
 * The response from the handle function should be exported and used as the function pointer in the lambda configuration.
 */
export function aws<K extends keyof Lambda.Event.Supported>(): (
  HandlerBuilder<
    Lambda.Source<K>,
    LambdaProviderCompositionFunction<
      Lambda.Event.GetEvent<K>,
      Lambda.Event.GetResponse<K>['value'],
      Lambda.Event.GetResponse<K>
    >,
    Lambda.Context,
    Lambda.Event.GetResponse<K>
  >
) {
  return new HandlerBuilder(composer);
}
