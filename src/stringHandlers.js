// @ts-check

import is from 'is_js';
import { NAME_PLACEHOLDER, throwError } from './helpers';

/**
 * This function will check if the value matches the min
 * It will throw Error if not valid, and return nothing if valid.
 * @export
 * @param {object} value
 * @param {object} schema
 */
export function minLengthHandler(value, schema) {
  const isValid = is.above(value.length, schema.minLength);

  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER}'s length should be greater than ${schema.minLength}. Current: ${value.length}`;
  throwError(value, errorText);
}

export function maxLengthHandler(value, schema) {
  const isValid = is.under(value.length, schema.maxLength);
  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER}'s length should be less than ${schema.maxLength}. Current: ${value.length}`;
  throwError(value, errorText);
}

export function includeHandler(value, schema) {
  const isValid = is.include(value, schema.include);
  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER} should include ${schema.include}. Current: ${value}`;
  throwError(value, errorText);
}

export function excludeHandler(value, schema) {
  const isValid = is.not.include(value, schema.exclude);
  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER} should not include ${schema.exclude}. Current: ${value}`;
  throwError(value, errorText);
}

export function startWithHandler(value, schema) {
  const isValid = is.startWith(value, schema.startWith);
  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER} should start with '${schema.startWith}'.`;
  throwError(value, errorText);
}

export function notStartWithHandler(value, schema) {
  const target = schema.notStartWith;
  const isValid = is.not.startWith(value, target);
  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER} should not start with '${target}'.`;
  throwError(value, errorText);
}

export function endWithHandler(value, schema) {
  const isValid = is.endWith(value, schema.endWith);
  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER} should end with '${schema.endWith}'.`;
  throwError(value, errorText);
}

export function notEndWithHandler(value, schema) {
  const target = schema.notEndWith;
  const isValid = is.not.endWith(value, target);
  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER} should not end with '${target}'.`;
  throwError(value, errorText);
}
