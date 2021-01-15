import { AmazonWebServiceApplication } from '../../src/provider/aws';
import { CreateLambdaInbound, LambdaMiddleware, LambdaMiddlewareValidatorInboundless } from '../../src/provider/aws/implementation';

type Inbound = CreateLambdaInbound<'aws:apigw:proxy:v2'>;

type MiddlewareParseFilter = LambdaMiddleware<Inbound, { filters: { search: string }; }>;
type MiddlewarePagination = LambdaMiddleware<Inbound, { pagination: { page: number; limit: number }; }>;

type MiddlewareFilterValidator = LambdaMiddlewareValidatorInboundless<{ filters: { search: string }; }>;

declare const app: AmazonWebServiceApplication;

declare const withFilters: MiddlewareParseFilter;
declare const withPagination: MiddlewarePagination;
declare const withFilterValidation : MiddlewareFilterValidator;

app.lambda('aws:apigw:proxy:v2')
  .use(withFilters)
  .use(withPagination)
  .use(withFilterValidation)
  .handle(async ({ context }) => {
    context.request;

    context.pagination.page;
    context.pagination.limit;

    context.filters.search;
  });
