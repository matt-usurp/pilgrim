import { AmazonWebServiceApplication, Lambda } from '../../src/provider/aws';

/**
 * Inbounds are used to define the kind of execution context being used.
 */
type Inbound = Lambda.Inbound<'aws:apigw:proxy:v2'>;

/**
 * Here we define a series of middleware that return fragments of a conceptual context.
 * When we provide them within `use()` statements the context is built up.
 * The handler can the make use of the combined context to perform some actions.
 */
declare const withFilters: Lambda.Middleware<Inbound, { filters: { search: string }; }>;
declare const withPagination: Lambda.Middleware<Inbound, { pagination: { page: number; limit: number }; }>;
declare const withFilterValidation : Lambda.Middleware.Validator.Eventless<{ filters: { search: string }; }>;

/**
 * The AWS application instance that will be required.
 */
declare const app: AmazonWebServiceApplication;

const target = app.lambda('aws:apigw:proxy:v2')
  .use(withFilters)
  .use(withPagination)
  .use(withFilterValidation)
  .handle(async({ context }) => {
    context.request;

    context.pagination.page;
    context.pagination.limit;

    context.filters.search;
  });

// The response is a function that lambda can trigger.
// In this case we just export it and define in the lambda configuration "file.target" for the function.
export { target };
