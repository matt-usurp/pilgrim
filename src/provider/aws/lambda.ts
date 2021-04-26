import * as AwsLambda from 'aws-lambda';
import { Pilgrim } from '../../main';
import { LambdaEventSource } from './lambda/sources';

/**
 * A type alias for the aws lambda handler.
 */
export type LambdaHandler<Event, Response> = AwsLambda.Handler<Event, Response>;

/**
 * A grouping of lambda specific types.
 *
 * These are public types that help with the developer experience.
 */
export namespace Lambda {
  /**
   * An event for aws lambda.
   *
   * Use to have a validated and common way to access aws events by identifier.
   */
  export type Event<Identifier extends keyof Event.Supported> = Identifier;

  export namespace Event {
    export type GetEvent<Identifier extends keyof Supported> = Lambda.Event.Supported[Identifier]['Event'];
    export type GetResponse<Identifier extends keyof Supported> = Lambda.Event.Supported[Identifier]['Response'];

    /**
     * A validated mapping of all aws lambda event sources that are provided.
     * This ensures all types will work internally and not cause TypeScript to default to any/never types.
     * Internally this should be used instead of the the  `LambdaEventSource` mapping that can be extended.
     */
    export type Supported = (
      Pick<LambdaEventSource, {
        [K in keyof LambdaEventSource]: (
          // Check the response is valid.
          LambdaEventSource[K]['Response'] extends Pilgrim.Response.Constraint
            ? K // Return the key, as we pick with the values of this new mapping.
            : never // Never is used as its removed from unions.
        )
      }[keyof LambdaEventSource]>
    );
  }

  /**
   * An event source for aws lambda.
   */
  export type Source<Identifier extends keyof Lambda.Event.Supported> = Source.Definition<Lambda.Event.GetEvent<Identifier>>;

  export namespace Source {
    /**
     * A lambda event source constraint.
     */
    export type Constraint = (
      Lambda.Source<
        // Any usage is allowed for constraints.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any
      >
    );

    /**
     * A lambda source that is consumed by the core pilgrim library.
     *
     * In this case Lambda itself passes a context that is used as the function context.
     * This has all the information about the functions execution.
     * This is combined with the event so middleware has access to function meta data.
     */
    export type Definition<GivenEvent> = {
      readonly context: AwsLambda.Context;
      readonly event: GivenEvent;
    };
  }

  /**
   * A base context for lambda events.
   *
   * @see Pilgrim.Context
   */
  export type Context = {
    readonly request: {
      readonly id: string;
    };
  };

  /**
   * A response that is tailored for aws events.
   */
  export type Response<Event> = Pilgrim.Response<'aws:event', Event>;

  export namespace Response {
    /**
     * A lambda response constraint.
     */
    export type Constraint = (
      Lambda.Response<
        // Any usage is allowed for constraints.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any
      >
    );
  }

  /**
   * A pilgrim handler that is enhanced for aws lambda.
   *
   * This can be used by providing a `Lambda.Event` and the response kind will be inferred.
   * This is handy for handlers that do not need to implement other responses.
   * If you want to be able to return other responses use a standard @{see Pilgrim.Handler} instead.
   *
   * The context will always include the `Lambda.Context` as its provided by the core functionality.
   * The handler however only needs to supply a partial context to allow for a better developer experience.
   *
   * @see Lambda.Event for more information on lambda events and event sources.
   * @see Pilgrim.Handler for more information on handlers.
   * @see Pilgrim.Middleware for more information on middlewares.
   */
  export type Handler<
    EventIdentifier extends keyof Lambda.Event.Supported,
    Context extends Pilgrim.Context.Constraint,
  > = (
    Pilgrim.Handler<
      Context,
      Lambda.Event.GetResponse<EventIdentifier>
    >
  );

  export namespace Handler {
    /**
     * An extended handler function with the event source supplied within its tooling.
     *
     * @see Lambda.Handler for the recommended lambda handler.
     * @see Pilgrim.Handler for more information on handlers.
     * @see Pilgrim.Middleware for more information on middleware.
     */
    export type WithSource<
      EventIdentifier extends keyof Lambda.Event.Supported,
      Context extends Pilgrim.Context.Constraint,
    > = (
      Pilgrim.Handler.WithSource<
        Lambda.Source<EventIdentifier>,
        Context,
        Lambda.Event.GetResponse<EventIdentifier>
      >
    );
  }

  /**
   * A pilgrim middleware enhanced for aws lambda.
   *
   * The context will always include the `Lambda.Context` as its provided by the core functionality.
   * The middleware however only needs to supply a partial context to allow for a better developer experience.
   *
   * @see Pilgrim.Handler for more information on handlers.
   * @see Pilgrim.Middleware for more information on middlewares.
   */
  export type Middleware<
    EventIdentifier extends keyof Lambda.Event.Supported,
    ContextInbound extends Pilgrim.Context.Constraint,
    ContextOutbound extends Pilgrim.Context.Constraint,
    ResponseInbound,
    ResponseOutbound,
  > = (
    Pilgrim.Middleware<
      Lambda.Source<EventIdentifier>,
      ContextInbound,
      ContextOutbound,
      ResponseInbound,
      ResponseOutbound
    >
  );

  export namespace Middleware {
    /**
     * A middleware function that doesn't have care about the event source.
     *
     * This kind of middleware is commonly used when external services are used or a middleware uses existing context.
     * In most cases this will not be the middleware you would want to use.
     *
     * @see Lambda.Middleware for more information on lambda middleware.
     * @see Pilgrim.Middleware for more information on middlewares.
     * @see Pilgrim.Handler for more information on handlers.
    */
    export type WithoutSource<
      ContextInbound extends Pilgrim.Context.Constraint,
      ContextOutbound extends Pilgrim.Context.Constraint,
      ResponseInbound,
      ResponseOutbound,
    > = Pilgrim.Middleware.WithoutSource<ContextInbound, ContextOutbound, ResponseInbound, ResponseOutbound>;
  }
}
