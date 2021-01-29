import deepmerge from 'deepmerge';
import { Grok } from '../../language/grok';
import { Pilgrim } from '../../main';
import { MiddlewareNextFunction } from '../middleware';
import { ProviderCompositionFunction } from '../provider';

/**
 * A function that can be passed around that represents a next function.
 */
type PassThroughNextFunction = (
  MiddlewareNextFunction<
    // Any usage due to complex usage of this type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    // Any usage due to complex usage of this type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  >
);

/**
 * A constraint for provider composition function types.
 */
type ProviderFunctionConstraint<Source> = (
  ProviderCompositionFunction<
    Source,
    // Any usage is allowed for constraints.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    // Any usage is allowed for constraints.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    // Any usage is allowed for constraints.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  >
);

/**
 * A constraint for middleware types.
 */
type MiddlewareConstraint = (
  Pilgrim.Middleware<
    // Any usage is allowed for constraints.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    // Any usage is allowed for constraints.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    // Any usage is allowed for constraints.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    // Any usage is allowed for constraints.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    // Any usage is allowed for constraints.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  >
);

/**
 * A handler builder.
 *
 * Allows for chaining middlewares and finalising with a handler.
 * The final result will be a function composed for the given provider.
 */
export class HandlerBuilder<
  BuilderSource,
  BuilderProviderComposerFunction extends ProviderFunctionConstraint<BuilderSource>,
  BuilderContext extends Pilgrim.Context.Constraint,
  BuilderResponse extends Pilgrim.Response.Constraint
> {
  private readonly composer: BuilderProviderComposerFunction;
  private readonly middlewares: MiddlewareConstraint[] = [];

  public constructor(composer: BuilderProviderComposerFunction) {
    this.composer = composer;
  }

  /**
   * Add the given middleware to the chain.
   *
   * Context and response types are infered and affect the running values.
   * The next middleware can use any context that were provided as outputs of this middleware.
   */
  public use<
    M extends Pilgrim.Middleware<
      BuilderSource,
      BuilderContext,
      // Any usage as other values mess up the infer usage.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
      // Any usage as other values mess up the infer usage.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
      BuilderResponse
    >,
  >(middleware: M): (
    HandlerBuilder<
      BuilderSource,
      BuilderProviderComposerFunction,
      (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        M extends Pilgrim.Middleware<BuilderSource, any, infer InferContextOutbound, any, any>
          ? Grok.Value.Merge<BuilderContext, InferContextOutbound>
          : never
      ),
      (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        M extends Pilgrim.Middleware<BuilderSource, any, any, infer InferResponseInbound, any>
          ? (
            Grok.If<
              Grok.Is.Any<InferResponseInbound>,
              BuilderResponse,
              (
                InferResponseInbound extends Grok.Union.UnionMutatorKind
                  ? Grok.Union.Mutate<BuilderResponse, InferResponseInbound>
                  : BuilderResponse | InferResponseInbound
              )
            >
          )
          : never
      )
    >
  ) {
    this.middlewares.push(middleware);

    // Conceptually we know what this should be, some types cannot be infered right now.
    // Therefore the casting to any is used, these cases should be covered by tests.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this as any;
  }

  /**
   * Finalise the chain with the given handler.
   */
  public handle<
    H extends Pilgrim.Handler<BuilderContext, BuilderResponse>,
    // EnsureContextInbound extends BuilderContext,
    // EnsureContextOutbound extends BuilderResponse,
  >(handler: H): ReturnType<BuilderProviderComposerFunction> {
    return this.composer(async({ source, context }) => {
      const exector: PassThroughNextFunction = async(context) => {
        return handler({
          context,
        });
      };

      const composed = this.build(source, exector);

      return composed(context);
    });
  }

  /**
   * Finalise the chain with the given handler.
   * This handler is made aware of the event source.
   *
   * This is not the recommended kind of handler to use for general use.
   * Preferrably you have a combination of middleware and a context to provide.
   *
   * However sometimes some handlers just need to know the event source straight up.
   * That might be processing some kind of raw event payload (e.g SNS, SES, SQS) where a middleware makes no sense.
   * This is the use-case for this kind of handler.
   */
  public handleWithSource<
    H extends Pilgrim.Handler.WithSource<BuilderSource, EnsureContextInbound, EnsureContextOutbound>,
    EnsureContextInbound extends BuilderContext,
    EnsureContextOutbound extends BuilderResponse,
  >(handler: H): ReturnType<BuilderProviderComposerFunction> {
    return this.composer(async({ source, context }) => {
      const exector: PassThroughNextFunction = async(context) => {
        return handler({
          source,
          context,
        });
      };

      const composed = this.build(source, exector);

      return composed(context);
    });
  }

  /**
   * Build a middleware wrapped executor function.
   */
  private build(
    source: BuilderSource,
    exector: PassThroughNextFunction,
  ): PassThroughNextFunction {
    return this.middlewares.reduceRight<PassThroughNextFunction>((previous, middleware) => {
      return async(context) => {
        const next: PassThroughNextFunction = async(givenContext) => {
          const mergedContext = deepmerge(context, givenContext);

          return previous(mergedContext);
        };

        return middleware({
          source,
          context,
          next,
        });
      };
    }, exector);
  }

  /**
   * @deprecated use handleWithSource() instead.
   */
  handleSourceAware = this.handleWithSource.bind(this);
}
