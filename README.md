# Pilgrim

A complete type-safe implementation of middleware and handlers for serverless functions.

## Usage

> The package is in a non-1.0 release state.
> The public API and types might change or be moved within any minor version change.
> A change log will be provided where possible to allow more frictionless upgrade.

We use a builder kind of pattern to construct a middleware and handler chain.

```ts
import { aws, response } from '@matt-usurp/pilgrim/provider/aws';

export const target = aws<'aws:apigw:proxy:v2'>()
  .handle(async ({ context }) => {
    return response({ ... });
  });
```

The response from the chain (after `handle()` is called) is a function that can be executed by the provider (`AWS Lambda` in this case).
A context is provided to our custom handler, but it has no knowledge of what called it and therefore does not have access to the event.
To provide context to our handler we use middleware.

```ts
import { Pilgrim } from '@matt-usurp/pilgrim';
import { Lambda } from '@matt-usurp/pilgrim/provider/aws';

// Providing the middleware with knowledge of the kind of event source
// This provides all places used with knowledge of the "APIGatewayProxyEventV2" event
type LambdaEventSource = Lambda.Event<'aws:apigw:proxy:v2'>;

type MyNewContext = { user: { id: string; }; };
type MyMiddleware = Lambda.Middleware<LambdaEventSource, Pilgrim.Inherit, MyNewContext, Pilgrim.Inherit, Pilgrim.Inherit>;

export const withUserData: MyMiddleware = async ({ event, next }) => {
  // Remember, "event" is APIGatewayProxyEventV2 here.

  const context = {
    ...context,

    user: {
      id: await resolveUserId(event.headers['authorization']),
    },
  };

  // You must return what next returns, this is the response in the chain.
  // The context is merged and provided to the next middleware or handler.
  return next(context)
}
```

Middleware are asyncronous so they can delay the handler execution.
This means you can perform tasks to resolve information (in this case user id) and provide that information to the next context.

> Middleware are provided with the `next()` function which allows for the chaining to work.
> The response of the next function is the return value of the next middleware (or the handler).
> If your middleware wishes too--it can return its own value and not call `next()`.
> This would be useful for cases where some validation failed and you want to return a 404 or something.

This can be used within our original code sample by adding a `use()` call.

```ts
import { response } from '@matt-usurp/pilgrim/provider/aws';

export const target = aws<'aws:apigw:proxy:v2'>()
  .use(withUserData)
  .handle(async ({ context }) => {
    context.user.id; // what ever was resolved from middleware.

    return response.event({ ... });
  });
```

### Response

All handlers are required to return a wrapped response.
There are some generic helpers exported from main for crafting common responses or creating your own.

```ts
import { response } from '@matt-usurp/pilgrim';

response.nothing();
```

When creating responses you will also want to craft a type for it.
There is a response type helper exposed under `Pilgrim.Response`, this can then be provided via middleware to allow the application to transform it.

```ts
import { Pilgrim, response } from '@matt-usurp/pilgrim';

type ColourResponse = Pilgrim.Response<'colours', { colours: string[]; }>;

// Creating a straight up response.
const response = response.create<ColourResponse>('colours', { colours: ['red', 'green', 'blue'] });
response; // type MyResponse

// Creating a factory function for constructing the response.
const factory = response.factory<ColourResponse>('colours');
const response = factory({ colours: ['orange'] });
response; // type MyResponse
```

Note that the aws lambda `@matt-usurp/pilgrim/provider/aws` namespace also exports `response` which are tailored for aws responses.
Currently all responses are wrapped in a `aws:event` response that can be created through `response.event()`.

#### Middleware

Middleware can introduce new responses by specifying them in the `ResponseInbound` generic parameter.
It is important to note that when specifying a new response you must also supply a `ResponseOutput` as this is what transformation needs implementing.

```ts
import { Pilgrim, response } from '@matt-usurp/pilgrim';

type MyMiddleware = (
  Pilgrim.Middleware<
    'aws:some:event',
    Pilgrim.Inherit,
    Pilgrim.Inherit,
    ColourResponse,
    Pilgrim.Response.HttpResponse
  >
);

const middleware: MyMiddleware = async({ context, next }) => {
  const result = await next(context);

  // transform ColourResponse into HttpResponse.
  if (result.type === 'colours') {
    return response.http({
      status: 200,
      body: JSON.stringify(result.value.colours);
    });
  }

  // returns the pseudo "inherit" response.
  return result;
}
```

When this middleware is implemented all middleware and handlers in the chain can make use of `ColourResponse`.

> There is an "inherit" response which should be considered a pseudo response.
> You cannot test for "inherit" as it doesn't actually exist.
> This might show up in middlewares representing "any" response you have not manually typed.
> This allows middleware to be partially aware of responses.

### Further reading

* For more examples see the `/examples` directory.
* For supported events (such as `aws:apigw:proxy:v2`) see the `/src/provider/aws/lambda` directory. Note that this is an extensible interface so if you event is missing you can add it yourself by doing the same thing. However, do feel free to PR that back in to the project!

## Roadmap

* Make agnostic to provider, allowing support for Azure and GCP.
* Improve test cases to cover scenarios.
