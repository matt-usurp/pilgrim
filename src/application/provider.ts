import { PilgrimContext } from './context';
import { PilgrimHandler } from './handler';

export namespace PilgrimProvider {
  export type FunctionConstraint = (...args: any[]) => any;

  /**
   * What the provider actually executes
   */
  export type Invoker<
    Source,
    Context extends PilgrimContext.Context.Constraint,
    Response
  > = PilgrimHandler.Handler.SourceAware<Source, Context, Response>;

  /**
   * Builds a function that the provider understands.
   */
  export type InvokerComposer<
    Source,
    InvokerContext extends PilgrimContext.Context.Constraint,
    InvokerResponse,
    ProviderFunction extends FunctionConstraint,
  > = (invoker: Invoker<Source, InvokerContext, InvokerResponse>) => ProviderFunction;
}
