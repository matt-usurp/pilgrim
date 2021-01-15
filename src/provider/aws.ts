import { ExecutionTypes as ProviderExecutionTypes } from '@matt-usurp/pilgrim/provider/aws';
import { Handler as LambdaProvidedHandler } from 'aws-lambda';
import { HandlerBuilder, HandlerWrapper } from '../application/handler';
import { LambdaContext, LambdaInbound, LambdaInboundConstraint } from './aws/implementation';

/**
 * This is a fake module that can be used to extend the type of execution for a given provider.
 * In this case these are the types of executions for lambda functions within the AWS environment.
 *
 * Note, this definition is empty on purpose to ensure the interface is always present.
 * For implementations see the files under the "provider/aws/execution" directory.
 */
declare module '@matt-usurp/pilgrim/provider/aws' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface ExecutionTypes {}
}

export type LambdaHandlerEnhanced = LambdaProvidedHandler<ProviderExecutionTypes[keyof ProviderExecutionTypes][0]>;
export type LambdaWrapper = HandlerWrapper<LambdaInboundConstraint, LambdaContext, LambdaHandlerEnhanced>;

/**
 * A typical implementation of the lambda wrapper.
 */
export const wrapper: LambdaWrapper = (executor) => async (event, context) => {
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
  public lambda<K extends keyof ProviderExecutionTypes, Provider extends ProviderExecutionTypes[K] = ProviderExecutionTypes[K]>(
    provider: K,
  ): HandlerBuilder<LambdaInbound<Provider[0]>, LambdaContext, LambdaHandlerEnhanced> {
    return new HandlerBuilder(provider, wrapper);
  }
}
