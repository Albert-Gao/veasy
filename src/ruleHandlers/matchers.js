import * as normal from './generalRules';
import * as number from './numberRules';
import * as string from './stringRules';

// If the rule expects an array as value, please put
// it here, so we can extract user defined error message
// without problem.
export const RuleWhichNeedsArray = ['inArray'];

// This is for rule which expect a boolean value,
// Will ignore the check if the value if false.
export const RuleWhichNeedsBoolean = [
  'isEmail',
  'isUrl',
  'isCreditCard',
  'isHexColor',
  'isDecimal',
  'isInt',
  'isNegative',
  'isPositive',
  'isIntOrDecimal'
];

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
  isDecimal: number.isDecimal,
  isIntOrDecimal: number.isIntOrDecimal,

  /* General handlers */
  inArray: normal.inArray,
  matchRegex: normal.matchRegex,
  isEmail: normal.isEmail,
  isUrl: normal.isUrl,
  isCreditCard: normal.isCreditCard,
  isHexColor: normal.isHexColor,
  notEmpty: normal.notEmpty,
  isIP: normal.isIP
};

export default handlerMatcher;
