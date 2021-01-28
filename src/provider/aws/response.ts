import { create } from '../../response';
import { Lambda } from '../aws';

/**
 * Create an aws event response.
 */
export function event<R extends Lambda.Response.Constraint>(value: R['value']): R {
  return create<R>('aws:event', value);
}
