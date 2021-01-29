# Pilgrim

A complete type-safe implementation of middleware and handlers for serverless functions.

> The package is currently in a pre-1.0 release state.
> The public API (including types) might change or be removed in any minor version change.
> A change log will be provided where possible to allow more frictionless upgrade.

## Usage

> Currently only `aws lambda` is supported.
> The api is abstract enough to support all other providers.

A chaining pattern is used to allow for the types to mutate as things are provided.
The `use()` function allows for middleware to be declared.
The `handle()` function finalises the chain with a handler function.

For example:

```ts
import { aws, response } from '@matt-usurp/pilgrim/provider/aws';

export const target = aws<'aws:apigw:proxy:v2'>()
  .handle(async ({ context }) => {
    return response.event({ ... });
  });
```

Once the chain has been finalised the response is a function that can be executed by the provider (in this case `aws()` returns a lambda handler).

## Context

A handler only needs to know so much and therefore it receives its own parameters, know as `context` in this case.
This means that handlers do not know about the original event source data.
Instead `Middleware` can be used to provide additional context.

A simple example:

```ts
import { Pilgrim } from '@matt-usurp/pilgrim';
import { Lambda } from '@matt-usurp/pilgrim/provider/aws';

type MyNewContext = { user: { id: string; }; };
type MyMiddleware = Lambda.Middleware<'aws:apigw:proxy:v2', Pilgrim.Inherit, MyNewContext, Pilgrim.Inherit, Pilgrim.Inherit>;

export const withUserData: MyMiddleware = async ({ event, next }) => {
  // Note, "event" is APIGatewayProxyEventV2 here due to specifying "aws:apigw:proxy:v2"

  const context = {
    ...context,

    user: {
      id: await validateUserId(event.headers['authorization']),
    },
  };

  // You must return what next returns, this is the response in the chain.
  // The context is merged and provided to the next middleware or handler.
  return next(context)
}
```

All middleware are asynchronous which allows them to delay the execution and wait for a process.
This means you can perform tasks to resolve information and provide that to the next context.
In the example above, `validateUserId()` could communicate with the database to make sure the user id exists.

> All middleware are provided with the `next()` function which allows for the chaining to work.
> The response of the next function is the return value of the future middleware (or the handler).
> If your middleware wishes too--it can return its own value and not call `next()`.
> This would be useful for cases where some validation failed and you want to return a 404 or something.

Our new middleware can be used within our original code sample by adding a `use()` call before the handler is given.

```ts
import { response } from '@matt-usurp/pilgrim/provider/aws';

export const target = aws<'aws:apigw:proxy:v2'>()
  .use(withUserData)
  .handle(async ({ context }) => {
    context.user.id; // what ever was resolved from middleware.

    return response.event({ ... });
  });
```

## Response

All middleware and handlers are expected to wrap their responses.
This is done so middleware can have a common discriminator to test when doing response mutations.
Some generic helpers are exported from the main namespace for crafting common responses or creating your own.

For example, satisfying a nothing response instead of using `void`.

```ts
import { response } from '@matt-usurp/pilgrim';

response.nothing(); // Pilgrim.Response.Nothing
```

When creating your own responses you will also want to define a type for it.
The response type helper `Pilgrim.Response` should be used to create wrapped responses.

```ts
import { Pilgrim, response } from '@matt-usurp/pilgrim';

type ColourResponse = Pilgrim.Response<'colours', { colours: string[]; }>;

// Creates the response.
const response = response.create<ColourResponse>('colours', { colours: ['red', 'green', 'blue'] });
response; // type ColourResponse

// Creating a factory function for constructing the response.
const factory = response.factory<ColourResponse>('colours');
const response = factory({ colours: ['orange'] });
response; // type ColourResponse
```

Note that `@matt-usurp/pilgrim/provider/aws` also exports `response` (the same as the main import) with some additional functions tailored for aws responses.
Currently all aws responses are wrapped in an `aws:event` response that can be created through `response.event()`.

> Our new responses can then be used with middleware to allow it in the execution chain.
> This is a fairly complex topic but can be better explained by reading the `aws-apigw-http-response` example and viewing the `withPilgrimHttpResponseSupport` middleware provided in the aws module.

## Middleware

Middleware can introduce new responses by specifying them in the `ResponseInbound` generic parameter.
It is important to note, when specifying a new response you must also supply a `ResponseOutput` to indicate what transformation is happening within the middleware.

For example, lets create a middleware that will allow use of the custom response `ColourResponse` defined above.

```ts
import { Pilgrim, response } from '@matt-usurp/pilgrim';

type ColourResponseMiddleware = (
  Pilgrim.Middleware.WithoutSource<
    Pilgrim.Inherit, // we do not require context
    Pilgrim.Inherit, // we do not change context
    ColourResponse, // allowing ColourResponse inbound
    Pilgrim.Response.Http // transforming to a http response
  >
);

const middleware: ColourResponseMiddleware = async({ context, next }) => {
  const result = await next(context);

  // using the discriminator "type" to detect our colour response.
  // TS should resolve result to ColourResponse.
  if (result.type === 'colours') {
    return response.http({
      status: 200,
      body: JSON.stringify(result.value.colours);
    });
  }

  // returns any other response.
  return result;
}
```

This middleware can now be used (with `use()`) in the execution chain.
All middleware and handlers next in the chain can safely return the `ColourResponse`.
This is enforced through types and will cause build failures if the middleware is not used.

> There is an "inherit" response which should be considered a pseudo response.
> You cannot test for "inherit" as it doesn't actually exist.
> This might show up in middleware's representing "any" response you have not manually typed.
> Simply return this response in a default block.
> This allows middleware to be partially aware of responses.

## Further reading

* For more examples see the `/examples` directory.
* For supported events (such as `aws:apigw:proxy:v2`) see the `/src/provider/aws/lambda/source` directory. Note that this is an extensible interface so if you event is missing you can add it yourself by doing the same thing. However, do feel free to PR that back in to the project!

## Future Features

* Introduce examples for other providers such as `azure` and `gcp`.
* Flesh out test cases to ensure all execution branches are covered.
* Breakout documentation in to less overwhelming wall of text.
