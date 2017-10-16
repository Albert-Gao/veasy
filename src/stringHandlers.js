// @ts-check

import is from 'is_js';
import {NAME_PLACEHOLDER, throwError} from './helpers';

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

export function includeHandler(fieldState, schema) {
  const isValid = is.include(fieldState.value, schema.include);
  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER} should include ${schema.include}. Current: ${fieldState.value}`;
  throwError(fieldState.value, errorText);
}

export function excludeHandler(fieldState, schema) {
  const isValid = is.not.include(fieldState.value, schema.exclude);
  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER} should not include ${schema.exclude}. Current: ${fieldState.value}`;
  throwError(fieldState.value, errorText);
}

export function startWithHandler(fieldState, schema) {
  const isValid = is.startWith(fieldState.value, schema.startWith);
  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER} should start with '${schema.startWith}'.`;
  throwError(fieldState.value, errorText);
}

export function notStartWithHandler(fieldState, schema) {
  const target = schema.notStartWith;
  const isValid = is.not.startWith(fieldState.value, target);
  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER} should not start with '${target}'.`;
  throwError(fieldState.value, errorText);
}

export function endWithHandler(fieldState, schema) {
  const isValid = is.endWith(fieldState.value, schema.endWith);
  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER} should end with '${schema.endWith}'.`;
  throwError(fieldState.value, errorText);
}

export function notEndWithHandler(fieldState, schema) {
  const target = schema.notEndWith;
  const isValid = is.not.endWith(fieldState.value, target);
  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER} should not end with '${target}'.`;
  throwError(fieldState.value, errorText);
}
