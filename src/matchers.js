import * as string from './stringHandlers';

export const stringMatcher = {
  minLength: string.minLengthHandler,
  maxLength: string.maxLengthHandler,
  enum: string.enumHandler,
  matchRegex: string.matchRegexHandler
};

export const numberMatcher = {};
