// @ts-check

import is from 'is_js';
import { NAME_PLACEHOLDER, throwError } from './helpers';

/**
 * This function will check if the value greater than the min
 * It will throw Error if not valid, and return nothing if valid.
 * @export
 * @param {object} value
 * @param {object} schema
 */
export function minHandler(value, schema) {
  const isValid = is.above(value * 1, schema.min * 1);

  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER} should be greater than ${schema.min}. Current: ${value}`;
  throwError(value, errorText);
}

export function maxHandler(value, schema) {
  const isValid = is.under(value * 1, schema.max * 1);
  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER} should be less than ${schema.max}. Current: ${value}`;
  throwError(value, errorText);
}

export function equalHandler(value, schema) {
  const target = schema.equal * 1;
  const isValid = is.equal(value * 1, target);
  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER} should equal to ${target}.`;
  throwError(value, errorText);
}

export function notEqualHandler(value, schema) {
  const target = schema.notEqual * 1;
  const isValid = is.not.equal(value * 1, target);
  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER} should not equal to ${target}.`;
  throwError(value, errorText);
}

export function isPositiveHandler(value, schema) {
  const isValid = is.positive(value * 1);
  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER} should be positive.`;
  throwError(value, errorText);
}

export function isNegativeHandler(value, schema) {
  const isValid = is.negative(value * 1);
  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER} should be negative.`;
  throwError(value, errorText);
}

export function isIntHandler(value, schema) {
  const isValid = is.integer(value * 1);
  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER} should be integer.`;
  throwError(value, errorText);
}
