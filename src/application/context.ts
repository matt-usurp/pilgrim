import { Pilgrim } from '../main';

/**
 * A constraint for contexts.
 */
export type ContextConstraint = Record<string, unknown>;

/**
 * @deprecated use ContextConstraint
 */
export namespace PilgrimContext {
  /**
   * @deprecated use ContextConstraint
   */
  export namespace Context {
    /**
     * @deprecated use ContextConstraint
     */
    export type Constraint = Pilgrim.Context.Constraint;
  }
}
