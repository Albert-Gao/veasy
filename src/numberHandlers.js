// @ts-check

import is from 'is_js';
import { throwError, NAME_PLACEHOLDER } from './helpers';

/**
 * This function will check if the value greater than the min
 * It will throw Error if not valid, and return nothing if valid.
 * @export
 * @param {object} fieldState
 * @param {object} schema
 */
export function minHandler(fieldState, schema) {
  const isValid = is.above(fieldState.value*1, schema.min*1);

  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER} should be greater than ${schema.min}. Current: ${fieldState
    .value}`;
  throwError(fieldState.value, errorText);
}

export function maxHandler(fieldState, schema) {
  const isValid = is.under(fieldState.value*1, schema.max*1);
  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER} should be less than ${schema.max}. Current: ${fieldState
    .value}`;
  throwError(fieldState.value, errorText);
}
