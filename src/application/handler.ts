export namespace PilgrimHandler {
  export type Handler<Context, Response> = Handler.Invoker<Handler.Invoker.Tooling<Context>, Response>;

  export namespace Handler {
    export type SourceAware<Source, Context, Response> = Handler.Invoker<Handler.Invoker.Tooling.SourceAware<Source, Context>, Response>;

    export type Invoker<Tooling, Response> = (tooling: Tooling) => Promise<Response>;
    export namespace Invoker {
      export type Tooling<Context> = {
        readonly context: Context;
      };

      export namespace Tooling {
        export type SourceAware<Source, Context> = (
          & Invoker.Tooling<Context>
          & {
            readonly source: Source;
          }
        );
      }
    }
  }
}
