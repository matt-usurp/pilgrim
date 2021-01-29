import { Pilgrim } from '../main';

export type HttpResponseData = {
  status: number;
  headers?: Record<string, string | number>;
  body?: string;
};

/**
 * @deprecated use Pilgrim.Response instead.
 */
export namespace PilgrimResponse {
  /**
   * @deprecated use Pilgrim.Response instead.
   */
  export type Response<ResponseType extends string, Value> = Pilgrim.Response<ResponseType, Value>;

  /**
   * @deprecated use Pilgrim.Response instead.
   */
  export namespace Response {
    /**
     * @deprecated use Pilgrim.Response.Constraint instead.
     */
    export type Constraint = Pilgrim.Response.Constraint;
  }

  /**
   * @deprecated use Pilgrim.Response instead.
   */
  export namespace Preset {
    /**
     * @deprecated use Pilgrim.Response.Nothing instead.
     */
    export type Nothing = Pilgrim.Response.Nothing;

    /**
     * @deprecated use Pilgrim.Response.Http instead.
     */
    export type Http = Pilgrim.Response.Http;
  }
}
