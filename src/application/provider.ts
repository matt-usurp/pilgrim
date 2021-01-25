import { PilgrimContext } from './context';
import { PilgrimHandler } from './handler';

export namespace PilgrimProvider {
  export type AnyFunctionConstraint = (...args: any[]) => any;

  /**
   * What the provider actually executes
   */
  export type InvocationFunction<
    Source,
    Context extends PilgrimContext.Context.Constraint,
    Response
  > = PilgrimHandler.Handler.SourceAware<Source, Context, Response>;

  /**
   * Builds a function that the provider understands.
   */
  export type CompositionFunction<
    Source,
    InvokerContext extends PilgrimContext.Context.Constraint,
    InvokerResponse,
    ProviderFunction extends AnyFunctionConstraint,
  > = (invoker: InvocationFunction<Source, InvokerContext, InvokerResponse>) => ProviderFunction;
}
