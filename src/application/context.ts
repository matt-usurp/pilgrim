/**
 * Pilgrim context types.
 *
 * These are used by the core library.
 * This namespace has no public alias.
 */
export namespace PilgrimContext {
  /**
   * Context refers to information that is being passed down to the handler.
   * Middleware can mutate and provide context to handlers.
   */
  export namespace Context {
    /**
     * A constraint for contexts.
     */
    export type Constraint = Record<string, unknown>;
  }
}
