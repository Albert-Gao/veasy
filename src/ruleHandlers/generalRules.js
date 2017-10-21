// @ts-check

import is from 'is_js';

export const inArray = (name, value, schema) => ({
  isValid: is.inArray(value, schema.inArray),
  errorText: `Value of ${name} should be within [${schema.inArray.toString()}].`
});

export const matchRegex = (name, value, schema) => ({
  isValid: schema.matchRegex.test(value),
  errorText: `Value of ${name} is not valid.`
});

export const isEmail = (name, value) => ({
  isValid: is.email(value),
  errorText: `${name} should be email.`
});

export const isUrl = (name, value) => ({
  isValid: is.url(value),
  errorText: `${name} should be a URL.`
});

export const isCreditCard = (name, value) => ({
  isValid: is.creditCard(value * 1),
  errorText: `${name} should be a credit card number.`
});

export const isHexColor = (name, value) => ({
  isValid: is.hexColor(value),
  errorText: `${name} should be a hex color.`
});

export const notEmpty = (name, value) => ({
  isValid: is.not.empty(value),
  errorText: `${name} should not be empty.`
});

export const isIP = (name, value, schema) => {
  let isValid;
  let ipString = '';

  switch (schema.isIP) {
    case 'v4':
      isValid = is.ipv4(value);
      ipString = 'IPv4';
      break;
    case 'v6':
      isValid = is.ipv6(value);
      ipString = 'IPv6';
      break;
    case 'all':
      isValid = is.ip(value);
      ipString = 'IP';
      break;
    default:
      isValid = is.ip(value);
      ipString = 'IP';
      break;
  }

  return {
    isValid,
    errorText: `${name} should be ${ipString} address.`
  };
};
