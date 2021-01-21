# Pilgrim

A type-safe platform handler/framework for AWS lambda with middleware support.

## Usage

> The package is in a non-1.0 release state.
> The public API and types might change or be moved within any minor version change.
> A change log will be provided where possible to allow more frictionless upgrade.

We use a builder kind of pattern to construct a middleware and handler chain.

```ts
import { aws } from '@matt-usurp/pilgrim/provider/aws';

export const target = aws<'aws:apigw:proxy:v2'>()
  .handle(async ({ context }) => {
    // ..
  });
```

The response from the chain (after `handle()` is called) is a function that can be executed by the provider (`AWS Lambda` in this case).
A context is provided to our custom handler, but it has no knowledge of what called it and therefore does not have access to the event.
To provide context to our handler we use middleware.

```ts
import { Lambda } from '@matt-usurp/pilgrim/provider/aws';

// Providing the middleware with knowledge of the kind of execution context
// This provides the `{ event }` typed as "APIGatewayProxyEventV2"
type Inbound = Lambda.Inbound<'aws:apigw:proxy:v2'>;

type MyNewContext = { user: { id: string; }; };
type MyMiddleware = Lambda.Middleware<Inbound, MyNewContext>;

export const withUserData: MyMiddleware = async ({ event, next }) => {
  // Remember, "event" is APIGatewayProxyEventV2 here.

  const context = {
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

> Middleware provide the `next()` function which allows for the chaining to work.
> The response of this function is the return value of the next middleware (or the handler).
> If you middleware wishes too--it can return its own value and not call `next()`.
> This would be useful for cases where some validation failed and you want to return a 404 or something.

This can be used within our original code sample by adding a `use()` call.

```ts
export const target = aws<'aws:apigw:proxy:v2'>()
  .use(withUserData)
  .handle(async ({ context }) => {
    context.user.id; // what ever was resolved from middleware.
  });
```

### Further reading

* For more examples see the `/examples` directory.
* For supported events (such as `aws:apigw:proxy:v2`) see the `/src/provider/aws/execution` directory. Note that this is an extensible interface so if you event is missing you can add it yourself by doing the same thing. However, do feel free to PR that back in to the project!

## Roadmap

* Make agnostic to provider, allowing support for Azure and GCP.
* Improve test cases to cover scenarios.
