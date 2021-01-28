import { PilgrimResponse } from './application/response';

/**
 * Create a factory for the given response type.
 */
export function factory<R extends PilgrimResponse.Response.Constraint>(type: R['type']): (value: R['value']) => R {
  return (value) => create(type, value);
}

/**
 * Construct a response of the given response type.
 */
export function create<R extends PilgrimResponse.Response.Constraint>(
  type: R['type'],
  value: R['value'],
): R {
  return { type, value } as R;
}

/**
 * Unwrap the given response and return its value.
 */
export function unwrap<R extends PilgrimResponse.Response.Constraint>(response: R): R['value'] {
  return response.value;
}

/**
 * A http response.
 */
export function http<R extends PilgrimResponse.Preset.Http>(value: R['value']): R {
  return create<R>('http', value);
}

/**
 * Construct a nothing resposne.
 */
export function nothing(): PilgrimResponse.Preset.Nothing {
  return { type: 'nothing' } as PilgrimResponse.Preset.Nothing;
}

/**
 * Construct an inherit response.
 */
export function inhert(): PilgrimResponse.Preset.Inherit {
  throw new Error([
    'Unexpected function call: inhert()',
    'Inherit is a pseudo response and cannot be constructed.',
    'Its only purpose is to represent possible responses that middlewares are not aware of.'
  ].join(' '));
}

/**
 * An assert function that can validate responses are never.
 */
export function never(response: never): void {
  const json = JSON.stringify(response);
  throw new Error(`Unexpected response: ${json}`);
}
