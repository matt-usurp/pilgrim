import { Grok } from '../language/grok';
import { PilgrimContext } from './context';
import { PilgrimHandler } from './handler';
import { PilgrimResponse } from './response';

export namespace PilgrimMiddleware {
  export namespace Inherit {
      export type Context = (
        & Context.ContextMarking
      );

      export namespace Context {
        export type ContextMarking = {
          readonly PilgrimMiddlewareInheritContextMarking: unique symbol;
        };
      }

      export type Response = PilgrimResponse.Response<PilgrimResponse.Response.Type.Inherit, ResponseMarking>;
      export type ResponseMarking = { readonly PilgrimMiddlewareInheritResponseMarking: unique symbol; };
    }

  export namespace Invoker {
    export type Next<Context, Response> = (context: Context) => Promise<Response>;
    export type Tooling<Source, Context, NextFunction> = (
      & PilgrimHandler.Handler.Invoker.Tooling.SourceAware<Source, Context>
      & {
        next: NextFunction;
      }
    );
  }

  export namespace Response {
    export type Constraint = (
      | PilgrimResponse.Response.Constraint
      | Grok.Union.MutatorKind
    );
  }

  export type Invoker<
    Source,
    ContextInbound extends PilgrimContext.Context.Constraint,
    ContextOutbound extends PilgrimContext.Context.Constraint,
    ResponseInbound,
    ResponseOutbound,
  > = (
    (
      tooling: (
        Invoker.Tooling<
          Source,
          Grok.If<
            Grok.Is.Any<ContextInbound>,
            Inherit.Context,
            Inherit.Context & ContextInbound
          >,
          Invoker.Next<
            Grok.If<
              Grok.Is.Any<ContextOutbound>,
              Inherit.Context,
              Inherit.Context & ContextOutbound
            >,
            Grok.If<
              Grok.Is.Any<ResponseInbound>,
              Inherit.Response,
              Grok.Mutator.Remove<Inherit.Response | ResponseInbound>
            >
          >
        >
      )
    ) => Promise<(
      Grok.If<
        Grok.Is.Any<ResponseOutbound>,
        Inherit.Response,
        Inherit.Response | ResponseOutbound
      >
    )>
  );

  export type Middleware<
    Source,
    ContextInbound extends PilgrimContext.Context.Constraint,
    ContextOutbound extends PilgrimContext.Context.Constraint,
    ResponseInbound,
    ResponseOutbound,
  > = (
    & Invoker<Source, ContextInbound, ContextOutbound, ResponseInbound, ResponseOutbound>
    & {
      readonly Source?: Source;
      readonly ContextInbound?: Grok.Data.Covariant<ContextInbound>;
      readonly ContextOutbound?: Grok.Data.Covariant<ContextOutbound>;
      readonly ResponseInbound?: ResponseInbound;
      readonly ResponseOutbound?: ResponseOutbound;
    }
  );

  export namespace Middleware {
    export type Constraint = Middleware<any, any, any, any, any>;
  }
}
