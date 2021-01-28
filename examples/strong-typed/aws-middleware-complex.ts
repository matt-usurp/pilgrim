import { Pilgrim } from '../../src/main';
import { aws, Lambda } from '../../src/provider/aws';

/**
 * Inbounds are used to define the kind of execution context being used.
 */
type LambdaEventSource = Lambda.Event<'aws:apigw:proxy:v2'>;

/**
 * Here we define a series of middleware that return fragments of a conceptual context.
 * When we provide them within `use()` statements the context is built up.
 * The handler can the make use of the combined context to perform some actions.
 */
declare const withFilters: Lambda.Middleware<LambdaEventSource, Pilgrim.Inherit, { filters: { search: string }; }, Pilgrim.Inherit, Pilgrim.Inherit>;
declare const withPagination: Lambda.Middleware<LambdaEventSource, Pilgrim.Inherit, { pagination: { page: number; limit: number }; }, Pilgrim.Inherit, Pilgrim.Inherit>;
declare const withFilterValidation : Lambda.Middleware.WithoutSource<{ filters: { search: string }; }, Pilgrim.Inherit, Pilgrim.Inherit, Pilgrim.Inherit>;

const target = aws<'aws:apigw:proxy:v2'>()
  .use(withFilters)
  .use(withPagination)
  .use(withFilterValidation)
  .handle(async({ context }) => {
    context.request;

    context.pagination.page;
    context.pagination.limit;

    context.filters.search;

    // This is the expected return type for the specified event above.
    // Resolved as: APIGatewayProxyResultV2
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return {} as any;
  });

// The response is a function that lambda can trigger.
// In this case we just export it and define in the lambda configuration "file.target" for the function.
export { target };
