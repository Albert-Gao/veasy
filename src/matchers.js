import * as string from './stringHandlers';
import * as number from './numberHandlers';
import * as normal from './normalHandlers';

export const stringMatcher = {
  minLength: string.minLengthHandler,
  maxLength: string.maxLengthHandler
};

export const numberMatcher = {
    min: number.minHandler,
    max: number.maxHandler
};

export const normalMatcher = {
    enum: normal.enumHandler,
    matchRegex: normal.matchRegexHandler
};
