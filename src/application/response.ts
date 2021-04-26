export type HttpResponseData = {
  status: number;
  headers?: Record<string, string | number>;
  body?: string;
};
