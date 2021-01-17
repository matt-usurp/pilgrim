declare module '@matt-usurp/pilgrim/provider/aws' {
  import {
    CloudFrontRequestEvent as RequestEvent,
    CloudFrontRequestResult as RequestResult,
    CloudFrontResponseEvent as ResponseEvent,
    CloudFrontResponseResult as ResponseResult
  } from 'aws-lambda';

  interface ExecutionTypes {
    readonly 'aws:cloudfront:request': [RequestEvent, RequestResult];
    readonly 'aws:cloudfront:response': [ResponseEvent, ResponseResult];
  }
}
