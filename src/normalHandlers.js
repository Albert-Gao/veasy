// @ts-check

import is from 'is_js';
import { NAME_PLACEHOLDER, throwError } from './helpers';

export function enumHandler(value, schema) {
  const isValid = is.inArray(value, schema.enum);
  if (isValid) return;

  const errorText = `Value of ${NAME_PLACEHOLDER} should be within [${schema.enum.toString()}].`;
  throwError(value, errorText);
}

export function matchRegexHandler(value, schema) {
  const isValid = schema.matchRegex.test(value);
  if (isValid) return;

  const errorText = `Value of ${NAME_PLACEHOLDER} is not valid.`;
  throwError(value, errorText);
}

export function isEmailHandler(value, schema) {
  const isValid = is.email(value);
  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER} should be email.`;
  throwError(value, errorText);
}

export function isUrlHandler(value, schema) {
  const isValid = is.url(value);
  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER} should be a URL.`;
  throwError(value, errorText);
}

export function isCreditCardHandler(value, schema) {
  const isValid = is.creditCard(value * 1);
  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER} should be a credit card number.`;
  throwError(value, errorText);
}

export function isHexColorHandler(value, schema) {
  const isValid = is.hexColor(value);
  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER} should be a hex color.`;
  throwError(value, errorText);
}

export function notEmptyHandler(value, schema) {
  const isValid = is.not.empty(value);
  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER} should not be empty.`;
  throwError(value, errorText);
}

export function isIPHandler(value, schema) {
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
  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER} should be ${ipString} address.`;
  throwError(value, errorText);
}
