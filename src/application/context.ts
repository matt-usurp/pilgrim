/**
 * A representation of what a context should look like.
 *
 * As far as I am willing to constrain right now a context can be any object or map.
 * In future they maybe a more enforced structure for context but currently there doesn't seem to be a need for it.
 *
 * @constraint This is a constraint type that should only be used in extends clauses.
 */
export type ContextConstraint = Record<string, unknown>;
