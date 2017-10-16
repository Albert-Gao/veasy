// @ts-check

import is from 'is_js';
import {NAME_PLACEHOLDER, throwError} from './helpers';

export function enumHandler(fieldState, schema) {
  const isValid = is.inArray(fieldState.value, schema.enum);
  if (isValid) return;

  const errorText = `Value of ${NAME_PLACEHOLDER} should be within [${schema.enum.toString()}].`;
  throwError(fieldState.value, errorText);
}

export function matchRegexHandler(fieldState, schema) {
  const isValid = schema.matchRegex.test(fieldState.value);
  if (isValid) return;

  const errorText = `Value of ${NAME_PLACEHOLDER} is not valid.`;
  throwError(fieldState.value, errorText);
}

export function isEmailHandler(fieldState, schema) {
  const isValid = is.email(fieldState.value);
  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER} should be email.`;
  throwError(fieldState.value, errorText);
}

export function isUrlHandler(fieldState, schema) {
  const isValid = is.url(fieldState.value);
  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER} should be a URL.`;
  throwError(fieldState.value, errorText);
}

export function isCreditCardHandler(fieldState, schema) {
  const isValid = is.creditCard(fieldState.value * 1);
  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER} should be a credit card number.`;
  throwError(fieldState.value, errorText);
}

export function isHexColorHandler(fieldState, schema) {
  const isValid = is.hexColor(fieldState.value);
  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER} should be a hex color.`;
  throwError(fieldState.value, errorText);
}

export function notEmptyHandler(fieldState, schema) {
  const isValid = is.not.empty(fieldState.value);
  if (isValid) return;

  const errorText = `${NAME_PLACEHOLDER} should not be empty.`;
  throwError(fieldState.value, errorText);
}

export function isIPHandler(fieldState, schema) {
  const { value } = fieldState;
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
