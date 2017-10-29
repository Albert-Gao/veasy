import is from 'is_js';

export const min = (name, value, schema) => ({
  isValid: is.above(value * 1, schema.min * 1),
  errorText: `${name} should be greater than ${schema.min}. Current: ${value}`
});

export const max = (name, value, schema) => ({
  isValid: is.under(value * 1, schema.max * 1),
  errorText: `${name} should be less than ${schema.max}. Current: ${value}`
});

export const equal = (name, value, schema) => ({
  isValid: is.equal(value * 1, schema.equal * 1),
  errorText: `${name} should equal to ${schema.equal * 1}.`
});

export const notEqual = (name, value, schema) => ({
  isValid: is.not.equal(value * 1, schema.notEqual * 1),
  errorText: `${name} should not equal to ${schema.notEqual * 1}.`
});

export const isPositive = (name, value) => ({
  isValid: is.positive(value * 1),
  errorText: `${name} should be positive.`
});

export const isNegative = (name, value) => ({
  isValid: is.negative(value * 1),
  errorText: `${name} should be negative.`
});

export const isInt = (name, value) => ({
  isValid: is.integer(value * 1),
  errorText: `${name} should be integer.`
});

export const isDecimal = (name, value) => ({
  isValid: is.decimal(value * 1),
  errorText: `${name} should be decimal.`
});

export const isIntOrDecimal = (name, value) => ({
  isValid: is.integer(value * 1) || is.decimal(value * 1),
  errorText: `${name} should be either integer or decimal.`
});