import { ExecutionTypes } from '@matt-usurp/pilgrim/provider/aws';
import { Context as LambdaProvidedContext } from 'aws-lambda';
import { ContextConstraint } from '../../application/context';
import { Handler as ApplicationHandler } from '../../application/handler';
import { Middleware as ApplicationMiddleware } from '../../application/middleware';

export namespace Lambda {
  /**
   * An inbound implementation that is passed to all middlewares.
   *
   * In this case Lambda itself passes a context that is used as the function context.
   * This has all the information about the functions execution.
   * This is combined with the event so middleware has access to function meta data.
   */
  export type Inbound<GivenEvent> = {
    context: LambdaProvidedContext;
    event: GivenEvent;
  };

  /**
   * A representation of what an inbound can look like.
   *
   * @constraint This is a constraint type that should only be used in extends clauses.
   */
  export type InboundConstraint = CreateInbound<keyof ExecutionTypes>;

  /**
   * A pseudo-type function for creating "Lambda.Inbound" types using the execution identifier.
   */
  export type CreateInbound<ExecutionTypeIdentifier extends keyof ExecutionTypes> = Inbound<ExecutionTypes[ExecutionTypeIdentifier][0]>;

  /**
   * The context that will be auto-prepared for use with the middlewares and handlers.
   */
  export type Context = {
    request: {
      id: string;
    };
  };

  /**
   * An implementation of handler specialised for lambda.
   * The given context will always inclue the "Lambda.Context" although not required to extend it.
   */
  export type Handler<GivenContext extends ContextConstraint> = ApplicationHandler<GivenContext, void>;

  /**
   * An impleemntation of the handler without knowledge of context.
   */
  export type HandlerContextless = Handler<Lambda.Context>;

  export namespace Middleware {
    /**
     * An implementation of middleware specialised for lambda.
     */
    export type EventAware<
      GivenInbound extends InboundConstraint,
      NextContext extends ContextConstraint,
      GivenContext extends ContextConstraint = ContextConstraint,
    > = ApplicationMiddleware<GivenInbound, NextContext, GivenContext>;

    /**
    * A lambda middleware that doesn't consume the inbound event.
    */
    export type Eventless<
      NextContext extends ContextConstraint,
      GivenContext extends ContextConstraint = ContextConstraint,
    > = EventAware<InboundConstraint, NextContext, GivenContext>;

    /**
    * A lambda middleware that is suited for validation of given context or inbound.
    */
    export type EventAwareValidator<
      GivenInbound extends InboundConstraint,
      GivenContext extends ContextConstraint,
    > = EventAware<GivenInbound, GivenContext, GivenContext>;

    /**
    * A lambda middleware that is suited for validation of given context only.
    * This middleware is not typed to know about the given inbound.
    */
    export type EventlessValidator<
      GivenContext extends ContextConstraint,
    > = Eventless<GivenContext, GivenContext>;
  }
}
