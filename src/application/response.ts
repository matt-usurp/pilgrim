export namespace PilgrimResponse {
  export type Response<ResponseType extends string, Value> = {
    type: ResponseType;
    value: Value;
  };

  export namespace Response {
    export type ResponseMarking = { readonly PilgrimResponseMarking: unique symbol };
    export type Constraint = Response<string, unknown>;
  }

  export namespace Preset {
    export type Inherit = Response<'inherit', never>;
    export type Nothing = Response<'nothing', never>;

    export type Http = Response<'http', {
      status: number;
      headers?: Record<string, string | number>;
      body: string;
    }>;
  }
}
