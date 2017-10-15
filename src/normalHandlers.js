// @ts-check

import is from 'is_js';
import { throwError, NAME_PLACEHOLDER } from './helpers';

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