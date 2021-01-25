import deepmerge from 'deepmerge';
import { Grok } from '../../language/grok';
import { PilgrimContext } from '../context';
import { PilgrimHandler } from '../handler';
import { PilgrimMiddleware } from '../middleware';
import { PilgrimProvider } from '../provider';
import { PilgrimResponse } from '../response';

type PassThroughFunction = PilgrimMiddleware.Invoker.Next<any, any>;

export class HandlerBuilder<
  BuilderSource,
  BuilderProviderComposerFunction extends PilgrimProvider.InvokerComposer<BuilderSource, any, any, any>,
  BuilderResponseConstraint,
  BuilderContext extends PilgrimContext.Context.Constraint,
  BuilderResponse extends BuilderResponseConstraint
> {
  private readonly middlewares: PilgrimMiddleware.Middleware.Constraint[] = [];

  public constructor(
    private readonly composer: BuilderProviderComposerFunction,
  ) {}

  /**
   * Provide a middleware function to mutate the current context.
   */
  public use<
    M extends PilgrimMiddleware.Middleware<BuilderSource, BuilderContext, any, any, BuilderResponse>,
  >(middleware: M): (
    HandlerBuilder<
      BuilderSource,
      BuilderProviderComposerFunction,
      BuilderResponseConstraint,
      (
        M extends PilgrimMiddleware.Middleware<BuilderSource, any, infer InferContextOutbound, any, any>
          ? Grok.Value.Merge<BuilderContext, InferContextOutbound>
          : never
      ),
      (
        M extends PilgrimMiddleware.Middleware<BuilderSource, any, any, infer InferResponseInbound, any>
          ? (
            Grok.If<
              Grok.Is.Any<InferResponseInbound>,
              BuilderResponse,
              (
                InferResponseInbound extends PilgrimResponse.Response.Constraint
                  ? BuilderResponse | InferResponseInbound
                  : Grok.Union.Mutate<BuilderResponse, InferResponseInbound>
              )
            >
          )
          : never
      )
    >
  ) {
    this.middlewares.push(middleware);

    return this as any;
  }

  /**
   * Provide a handler to finalise the execution.
   */
  public handle<
    H extends PilgrimHandler.Handler<BuilderContext, BuilderResponse>,
    // EnsureContextInbound extends BuilderContext,
    // EnsureContextOutbound extends BuilderResponse,
  >(handler: H): ReturnType<BuilderProviderComposerFunction> {
    return this.composer(async({ source, context }) => {
      const exector: PassThroughFunction = async(context) => {
        return handler({
          context,
        });
      };

      const composed = this.build(source, exector);

      return composed(context);
    });
  }

  /**
   * Provide a handler (with knowledge of the inbound) to finalise the execution.
   *
   * This is not the recommended kind of handler to use for general use.
   * Preferrably you have a combination of middleware and a context to provide.
   *
   * However sometimes some handlers just need to know the inbound details straight up.
   * That might be processing some kind of raw event payload (e.g SNS, SES, SQS) where a middleware makes no sense.
   * This is the use-case for this kind of handler.
   */
  public handleWithInbound<
    H extends PilgrimHandler.Handler.SourceAware<BuilderSource, EnsureContextInbound, EnsureContextOutbound>,
    EnsureContextInbound extends BuilderContext,
    EnsureContextOutbound extends BuilderResponse,
  >(handler: H): PilgrimProvider.InvokerComposer<BuilderContext, any, any, BuilderProviderComposerFunction> {
    return this.composer(async({ source, context }) => {
      const exector: PassThroughFunction = async(context) => {
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
  private build(source: BuilderSource, exector: PassThroughFunction): PassThroughFunction {
    return this.middlewares.reduceRight<PassThroughFunction>((previous, middleware) => {
      return async(context) => {
        const next: PassThroughFunction = async(newcontext) => {
          const merged = deepmerge(context, newcontext);

          return previous(merged);
        };

        return middleware({
          source,
          context,
          next,
        });
      };
    }, exector);
  }
}
