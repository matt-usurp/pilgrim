import * as AwsLambda from 'aws-lambda';
import { Pilgrim } from '../../main';
import { LambdaEventSource } from './lambda/sources';

/**
 * Alias of the supplied AWS Lambda handler.
 */
export type LambdaHandler<Event, Response> = AwsLambda.Handler<Event, Response>;

/**
 * A grouping of lambda specific types.
 *
 * These are public types that help with the developer experience.
 */
export namespace Lambda {
  /**
   * An event source identifier.
   */
  export type Event<Identifier extends keyof Event.Supported> = Identifier;

  export namespace Event {
    export type GetEvent<Identifier extends keyof Supported> = Event.Supported[Identifier]['Event'];
    export type GetResponse<Identifier extends keyof Supported> = Event.Supported[Identifier]['Response'];

    /**
     * Validated events that will be used across the library core.
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
   * Helper type for creating lambda sources from the given identifier.
   */
  export type Source<Identifier extends keyof Event.Supported> = Source.Definition<Event.GetEvent<Identifier>>;

  export namespace Source {
    /**
     * A constraint type that can be used to assert lambda sources.
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
    export type Definition<Event> = {
      readonly context: AwsLambda.Context;
      readonly event: Event;
    };
  }

  /**
   * A base context for lambda events.
   */
  export type Context = {
    request: {
      id: string;
    };
  };

  export type Response<Event> = Pilgrim.Response<'aws:event', Event>;

  export namespace Response {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export type Constraint = Response<any>;
  }

  /**
   * An implementation of handler specialised for lambda.
   *
   * The context will always include the "Lambda.Context" as its provided by the core functionality.
   * The handler however only needs to supply a partial context to allow for a better developer experience.
   *
   * @see Pilgrim.Handler
   */
  export type Handler<
    SourceIdentifier extends keyof Event.Supported,
    Context extends Pilgrim.Context.Constraint,
  > = (
    Pilgrim.Handler<
      Context,
      Event.GetResponse<SourceIdentifier>
    >
  );

  export namespace Handler {
    /**
     * An event source aware lambda handler.
     *
     * @see PilgrimHandler.Handler
     * @see Pilgrim.Handler.SourceAware
     */
    export type SourceAware<
      Source extends Source.Constraint,
      Context extends Pilgrim.Context.Constraint,
      Response
    > = Pilgrim.Handler.WithSource<Source, Context, Response>;
  }

  /**
   * A middleware specialised for lambda.
   *
   * The context will always include the "Lambda.Context" as its provided by the core functionality.
   * The handler however only needs to supply a partial context to allow for a better developer experience.
   *
   * @see Pilgrim.Middleware for more information
   */
  export type Middleware<
    EventIdentity extends keyof Event.Supported,
    ContextInbound extends Pilgrim.Context.Constraint,
    ContextOutbound extends Pilgrim.Context.Constraint,
    ResponseInbound,
    ResponseOutbound,
  > = (
    Pilgrim.Middleware<
      Source<EventIdentity>,
      ContextInbound,
      ContextOutbound,
      ResponseInbound,
      ResponseOutbound
    >
  );

  export namespace Middleware {
    /**
    * A lambda middleware that doesn't require the event source.
    */
    export type WithoutSource<
      ContextInbound extends Pilgrim.Context.Constraint,
      ContextOutbound extends Pilgrim.Context.Constraint,
      ResponseInbound,
      ResponseOutbound,
    > = (
      Pilgrim.Middleware<
        // Any usage as this parameter shouldn't be used.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any,
        ContextInbound,
        ContextOutbound,
        ResponseInbound,
        ResponseOutbound
      >
    );
  }
}
