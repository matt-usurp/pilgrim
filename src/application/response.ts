export namespace PilgrimResponse {
  export type Response<ResponseType extends string, Additional> = (
    & Response.ResponseMarking
    & Additional
    & { type: ResponseType }
  );

  export namespace Response {
    export type ResponseMarking = { readonly PilgrimResponseMarking: unique symbol };
    export type Constraint = Response<string, unknown>;

    export const enum Type {
      Nothing = 'internal:nothing',
      Inherit = 'internal:inherit',
    }

    export type Nothing = Response<Type.Nothing, unknown>;
  }
}

export class PilgrimResponseFactory {
  public static value<R extends PilgrimResponse.Response.Constraint>(response: R): Omit<R, keyof PilgrimResponse.Response.Nothing> {
    return response;
  }

  public create<R extends PilgrimResponse.Response.Constraint>(
    type: R['type'],
    additional: Omit<R, keyof PilgrimResponse.Response.Nothing>,
  ): R {
    return { type, ...additional } as unknown as R;
  }
}
