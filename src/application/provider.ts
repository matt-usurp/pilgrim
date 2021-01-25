import { PilgrimContext } from './context';
import { PilgrimHandler } from './handler';

/**
 * Pilgrim provider types.
 *
 * These are used by the core library.
 * This namespace has no public alias.
 */
export namespace PilgrimProvider {
  /**
   * A constraint for function types.
   * This is used as `Function` is disabled via eslint.
   */
  export type FunctionConstraint = (
    // Any usage is allowed for constraints.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ) => (
    // Any usage is allowed for constraints.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  );

  /**
   * An invocation function is the compiled function that the provider invokes.
   * For example this is the function you would configure lambda to trigger in the configuration.
   */
  export type InvocationFunction<
    Source,
    Context extends PilgrimContext.Context.Constraint,
    Response
  > = PilgrimHandler.Handler.SourceAware<Source, Context, Response>;

  /**
   * A compose function that takes a handler like function and produces a function compatible with the provider.
   *
   * @see InvocationFunction
   */
  export type CompositionFunction<
    Source,
    InvokerContext extends PilgrimContext.Context.Constraint,
    InvokerResponse,
    ProviderFunction extends FunctionConstraint,
  > = (invoker: InvocationFunction<Source, InvokerContext, InvokerResponse>) => ProviderFunction;
}
