import { Pilgrim } from '../main';

/**
 * A constraint for function types.
 * This is used as `Function` is disabled via eslint.
 */
export type GenericFunctionConstraint = (
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
export type ProviderInvocationFunction<
  Source,
  Context extends Pilgrim.Context.Constraint,
  Response
> = Pilgrim.Handler.WithSource<Source, Context, Response>;

/**
 * A compose function that takes a handler like function and produces a function compatible with the provider.
 *
 * @see ProviderInvocationFunction
 */
export type ProviderCompositionFunction<
  Source,
  InvokerContext extends Pilgrim.Context.Constraint,
  InvokerResponse extends Pilgrim.Response.Constraint,
  ProviderFunction extends GenericFunctionConstraint,
> = (invoker: ProviderInvocationFunction<Source, InvokerContext, InvokerResponse>) => ProviderFunction;
