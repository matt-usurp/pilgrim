import * as AwsLambda from 'aws-lambda';
import { PilgrimContext } from '../../application/context';
import { PilgrimHandler } from '../../application/handler';
import { PilgrimMiddleware } from '../../application/middleware';
import { PilgrimProvider } from '../../application/provider';
import { LambdaEventSource } from './lambda/sources';

/**
 * Alias of the supplied AWS Lambda handler.
 */
export type LambdaHandler = AwsLambda.Handler;

/**
 *
 */
export type LambdaProviderCompositionFunction = (
  PilgrimProvider.CompositionFunction<
    Lambda.Source.Constraint,
    Lambda.Context,
    any,
    LambdaHandler
  >
);

/**
 * A grouping of lambda specific types.
 *
 * These are public types that help with the developer experience.
 */
export namespace Lambda {
  export type Event<K extends keyof LambdaEventSource> = LambdaEventSource[K];
  export type Source<K extends keyof LambdaEventSource> = Source.Definition<LambdaEventSource[K][0]>;

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

  export type Context = {
    request: {
      id: string;
    };
  };

  /**
   * An implementation of handler specialised for lambda.
   * The given context will always inclue the "Lambda.Context" although not required to extend it.
   *
   * @api
   */
  export type Handler<GivenContext extends PilgrimContext.Context.Constraint> = PilgrimHandler.Handler<GivenContext, any>;

  /**
   * An implementation of middleware specialised for lambda.
   *
   * @api
   */
  export type Middleware<
    Source,
    ContextInbound extends PilgrimContext.Context.Constraint,
    ContextOutbound extends PilgrimContext.Context.Constraint,
    ResponseInbound extends PilgrimMiddleware.Response.Constraint,
    ResponseOutbound extends PilgrimMiddleware.Response.Constraint,
  > = PilgrimMiddleware.Middleware<Source, ContextInbound, ContextOutbound, ResponseInbound, ResponseOutbound>;

  /**
   * A grouping of extra or enhanced types for middleware.
   */
  export namespace Middleware {
    /**
    * A lambda middleware that doesn't consume the inbound event.
    *
    * @api
    */
    export type WithoutSource<
      ContextInbound extends PilgrimContext.Context.Constraint,
      ContextOutbound extends PilgrimContext.Context.Constraint,
      ResponseInbound extends PilgrimMiddleware.Response.Constraint,
      ResponseOutbound extends PilgrimMiddleware.Response.Constraint,
    > = Middleware<Source.Constraint, ContextInbound, ContextOutbound, ResponseInbound, ResponseOutbound>;
  }
}
