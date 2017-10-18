import * as normal from './ruleHandlers/generalRules';
import * as number from './ruleHandlers/numberRules';
import * as string from './ruleHandlers/stringRules';

const handlerMatcher = {
  /* String handlers */
  minLength: string.minLength,
  maxLength: string.maxLength,
  include: string.include,
  exclude: string.exclude,
  startWith: string.startWith,
  notStartWith: string.notStartWith,
  endWith: string.endWith,
  notEndWith: string.notEndWith,

  /* Number handlers */
  min: number.min,
  max: number.max,
  equal: number.equal,
  notEqual: number.notEqual,
  isPositive: number.isPositive,
  isNegative: number.isNegative,
  isInt: number.isInt,

  /* Normal handlers */
  enum: normal.enumRule,
  matchRegex: normal.matchRegex,
  isEmail: normal.isEmail,
  isUrl: normal.isUrl,
  isCreditCard: normal.isCreditCard,
  isHexColor: normal.isHexColor,
  notEmpty: normal.notEmpty,
  isIP: normal.isIP
};

export default handlerMatcher;
