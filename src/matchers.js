import * as string from './stringHandlers';
import * as number from './numberHandlers';
import * as normal from './normalHandlers';

export const stringMatcher = {
    minLength: string.minLengthHandler,
    maxLength: string.maxLengthHandler,
    include: string.includeHandler,
    exclude: string.excludeHandler,
    startWith: string.startWithHandler,
    notStartWith: string.notStartWithHandler,
    endWith: string.endWithHandler,
    notEndWith: string.notEndWithHandler
};

export const numberMatcher = {
    min: number.minHandler,
    max: number.maxHandler,
    equal: number.equalHandler,
    notEqual: number.notEqualHandler,
    isPositive: number.isPositiveHandler,
    isNegative: number.isNegativeHandler,
    isInt: number.isIntHandler
};

export const normalMatcher = {
    enum: normal.enumHandler,
    matchRegex: normal.matchRegexHandler
};
