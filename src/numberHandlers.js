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
    const isValid = is.above(fieldState.value * 1, schema.min * 1);

    if (isValid) return;

    const errorText = `${NAME_PLACEHOLDER} should be greater than ${schema.min}. Current: ${fieldState.value}`;
    throwError(fieldState.value, errorText);
}

export function maxHandler(fieldState, schema) {
    const isValid = is.under(fieldState.value * 1, schema.max * 1);
    if (isValid) return;

    const errorText = `${NAME_PLACEHOLDER} should be less than ${schema.max}. Current: ${fieldState.value}`;
    throwError(fieldState.value, errorText);
}

export function equalHandler(fieldState, schema) {
    const target = schema.equal * 1;
    const isValid = is.equal(fieldState.value * 1, target);
    if (isValid) return;

    const errorText = `${NAME_PLACEHOLDER} should equal to ${target}.`;
    throwError(fieldState.value, errorText);
}

export function notEqualHandler(fieldState, schema) {
    const target = schema.notEqual * 1;
    const isValid = is.not.equal(fieldState.value * 1, target);
    if (isValid) return;

    const errorText = `${NAME_PLACEHOLDER} should not equal to ${target}.`;
    throwError(fieldState.value, errorText);
}

export function isPositiveHandler(fieldState, schema) {
    const isValid = is.positive(fieldState.value * 1);
    if (isValid) return;

    const errorText = `${NAME_PLACEHOLDER} should be positive.`;
    throwError(fieldState.value, errorText);
}

export function isNegativeHandler(fieldState, schema) {
    const isValid = is.negative(fieldState.value * 1);
    if (isValid) return;

    const errorText = `${NAME_PLACEHOLDER} should be negative.`;
    throwError(fieldState.value, errorText);
}

export function isIntHandler(fieldState, schema) {
    const isValid = is.integer(fieldState.value * 1);
    if (isValid) return;

    const errorText = `${NAME_PLACEHOLDER} should be integer.`;
    throwError(fieldState.value, errorText);
}
