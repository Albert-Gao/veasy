// @ts-check

import is from 'is_js';
import { throwError, NAME_PLACEHOLDER } from './helpers';

/**
 * This function will check if the value matches the min
 * It will throw Error if not valid, and return nothing if valid.
 * @export
 * @param {object} fieldState
 * @param {object} schema
 */
export function minLengthHandler(fieldState, schema) {
  const isValid = is.above(fieldState.value.length, schema.minLength);

  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER}'s length should be greater than ${schema.minLength}. Current: ${fieldState
    .value.length}`;
  throwError(fieldState.value, errorText);
}

export function maxLengthHandler(fieldState, schema) {
  const isValid = is.under(fieldState.value.length, schema.maxLength);
  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER}'s length should be less than ${schema.maxLength}. Current: ${fieldState
    .value.length}`;
  throwError(fieldState.value, errorText);
}
