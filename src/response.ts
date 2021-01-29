import { Pilgrim } from './main';

/**
 * Create a factory for the given response type.
 */
export function factory<R extends Pilgrim.Response.Constraint>(type: R['type']): (value: R['value']) => R {
  return (value) => create(type, value);
}

/**
 * Construct a response of the given response type.
 */
export function create<R extends Pilgrim.Response.Constraint>(
  type: R['type'],
  value: R['value'],
): R {
  return { type, value } as R;
}

/**
 * Unwrap the given response and return its value.
 */
export function unwrap<R extends Pilgrim.Response.Constraint>(response: R): R['value'] {
  return response.value;
}

/**
 * Construct a nothing response.
 */
export function nothing(): Pilgrim.Response.Nothing {
  return { type: 'nothing' } as Pilgrim.Response.Nothing;
}

/**
 * A http response.
 */
export function http<R extends Pilgrim.Response.Http>(value: R['value']): R {
  return create<R>('http', value);
}

/**
 * An assert function that can validate responses are never.
 */
export function never(response: never): void {
  const json = JSON.stringify(response);
  throw new Error(`Unexpected response: ${json}`);
}
