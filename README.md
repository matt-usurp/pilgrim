# Pilgrim

A type-safe serverless handler and middleware implementation.

Currently supporting `aws-lambda` natively but the internal API is abstracted enough to be able to support other providers.
In version `2.x` I hope to extract the providers out to their own packages for a better developer experience.

## Usage

The core api is around the `HandlerBuilder` which focuses on mutating a context object through middlewares.
This exposes a `.use()` function that allows for middlewares to apply mutations to the expected types given to the handler.
The `.handle()` function finalises the chain and constructs an entrypoint for the service provider to execute.

> Service provider implementations expose pre-defined instances of `HandlerBuilder` with types valid for that provider.

An example of an `aws-lambda` handler:

```ts
import { aws, response } from '@matt-usurp/pilgrim/provider/aws';

export const target = aws<'aws:apigw:proxy:v2'>()
  .handle(async ({ context }) => {
    return response.event({ ... });
  });
```

Which `aws-lambda` can execute by targetting the `filename.target` exported handler.

## Context

A handler is provided a context object that is restricted in what is available out of the box.
However it is possible to augement the context by providing implementations of `Pilgrim.Middleware` that access the event source or external services.

> Providers may have augmented types available for assisting with making these middleware.
> For example, `aws-lambda` based middleware can make use of the `Lambda.Middleware` exposed by the provider implementation.

An example middleware for `aws-lambda` might look like:

```ts
import { Pilgrim } from '@matt-usurp/pilgrim';
import { Lambda } from '@matt-usurp/pilgrim/provider/aws';

type MyNewContext = { user: { id: string; }; };
type MyMiddleware = Lambda.Middleware<'aws:apigw:proxy:v2', Pilgrim.Inherit, MyNewContext, Pilgrim.Inherit, Pilgrim.Inherit>;

export const withUserData: MyMiddleware = async ({ source, next }) => {
  // Note, "source.event" is APIGatewayProxyEventV2 due to specifying "aws:apigw:proxy:v2"
  // Additionally, "source.context" is the Lambda function context.

  const header = source.event.headers['authorization'];
  const context = {
    ...context,

    user: {
      id: await validateUserId(header),
    },
  };

  // You must return what next returns, this is the response in the chain.
  // The context is merged and provided to the next middleware or handler.
  return next(context)
}
```

All middleware are asynchronous which allows them to delay the execution and wait for processes.
This means you can perform tasks to resolve information and merge that with the handler context.
In the example above, `validateUserId()` could communicate with the database to make sure the user id exists.

> All middleware are provided with the `next()` function which allows for the chaining to work.
> The response of the next function is the return value of the future middleware (or the handler).
> If your middleware wishes too--it can return its own value and not call `next()`.
> This would be useful for cases where some validation failed and you want to return a 404 or something.

Our new middleware can be used within our example handler code above by adding a `.use()` call before the `.handler()`.

```ts
import { response } from '@matt-usurp/pilgrim/provider/aws';

export const target = aws<'aws:apigw:proxy:v2'>()
  .use(withUserData)
  .handle(async ({ context }) => {
    context.user.id; // user id is now available in context

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
* Breakout provider implementations
