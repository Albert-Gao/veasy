/* eslint-disable max-len */

import is from 'is_js';

export const minLength = (name, value, schema) => ({
  isValid: is.equal(value.length, schema.minLength) || is.above(value.length, schema.minLength),
  errorText: `${name}'s length should be equal or greater than ${schema.minLength}. Current: ${value.length}`
});

export const maxLength = (name, value, schema) => ({
  isValid: is.equal(value.length, schema.maxLength) || is.under(value.length, schema.maxLength),
  errorText: `${name}'s length should be equal or less than ${schema.maxLength}. Current: ${value.length}`
});

export const include = (name, value, schema) => ({
  isValid: is.include(value, schema.include),
  errorText: `${name} should include ${schema.include}. Current: ${value}`
});

export const exclude = (name, value, schema) => ({
  isValid: is.not.include(value, schema.exclude),
  errorText: `${name} should not include ${schema.exclude}. Current: ${value}`
});

export const startWith = (name, value, schema) => ({
  isValid: is.startWith(value, schema.startWith),
  errorText: `${name} should start with '${schema.startWith}'.`
});

export const notStartWith = (name, value, schema) => ({
  isValid: is.not.startWith(value, schema.notStartWith),
  errorText: `${name} should not start with '${schema.notStartWith}'.`
});

export const endWith = (name, value, schema) => ({
  isValid: is.endWith(value, schema.endWith),
  errorText: `${name} should end with '${schema.endWith}'.`
});

export const notEndWith = (name, value, schema) => ({
  isValid: is.not.endWith(value, schema.notEndWith),
  errorText: `${name} should not end with '${schema.notEndWith}'.`
});
