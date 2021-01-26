import * as AwsLambda from 'aws-lambda';
import { PilgrimContext } from '../../application/context';
import { PilgrimHandler } from '../../application/handler';
import { PilgrimMiddleware } from '../../application/middleware';
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
   * Helper type to retreive lambda events from the given identifier.
   */
  export type Event<Identifier extends keyof LambdaEventSource> = LambdaEventSource[Identifier];

  export namespace Event {
    export type GetEvent<Identifier extends keyof LambdaEventSource> = Event<Identifier>['Event'];
    export type GetResponse<Identifier extends keyof LambdaEventSource> = Event<Identifier>['Response'];
  }

  /**
   * Helper type for creating lambda sources from the given identifier.
   */
  export type Source<Identifier extends keyof LambdaEventSource> = Source.Definition<Event.GetEvent<Identifier>>;

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
      context: AwsLambda.Context;
      event: Event;
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

  /**
   * An implementation of handler specialised for lambda.
   *
   * The context will always include the "Lambda.Context" as its provided by the core functionality.
   * The handler however only needs to supply a partial context to allow for a better developer experience.
   */
  export type Handler<
    Context extends PilgrimContext.Context.Constraint,
    Response
  > = PilgrimHandler.Handler<Context, Response>;

  export namespace Handler {
    /**
     * An event source aware lambda handler.
     *
     * @see PilgrimHandler.Handler
     * @see Pilgrim.Handler.SourceAware
     */
    export type SourceAware<
      Source extends Source.Constraint,
      Context extends PilgrimContext.Context.Constraint,
      Response
    > = PilgrimHandler.Handler.SourceAware<Source, Context, Response>;
  }

  /**
   * A middleware specialised for lambda.
   *
   * The context will always include the "Lambda.Context" as its provided by the core functionality.
   * The handler however only needs to supply a partial context to allow for a better developer experience.
   *
   * @see PilgrimMiddleware.Middleware for more information
   */
  export type Middleware<
    Source extends Lambda.Source.Constraint,
    ContextInbound extends PilgrimContext.Context.Constraint,
    ContextOutbound extends PilgrimContext.Context.Constraint,
    ResponseInbound,
    ResponseOutbound,
  > = PilgrimMiddleware.Middleware<Source, ContextInbound, ContextOutbound, ResponseInbound, ResponseOutbound>;

  export namespace Middleware {
    /**
    * A lambda middleware that doesn't require the event source.
    */
    export type WithoutSource<
      ContextInbound extends PilgrimContext.Context.Constraint,
      ContextOutbound extends PilgrimContext.Context.Constraint,
      ResponseInbound,
      ResponseOutbound,
    > = Middleware<Source.Constraint, ContextInbound, ContextOutbound, ResponseInbound, ResponseOutbound>;
  }
}
