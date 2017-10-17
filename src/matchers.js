import * as normal from './normalHandlers';
import * as number from './numberHandlers';
import * as string from './stringHandlers';

const handlerMatcher = {
  /* String handlers */
  minLength: string.minLengthHandler,
  maxLength: string.maxLengthHandler,
  include: string.includeHandler,
  exclude: string.excludeHandler,
  startWith: string.startWithHandler,
  notStartWith: string.notStartWithHandler,
  endWith: string.endWithHandler,
  notEndWith: string.notEndWithHandler,

  /* Number handlers */
  min: number.minHandler,
  max: number.maxHandler,
  equal: number.equalHandler,
  notEqual: number.notEqualHandler,
  isPositive: number.isPositiveHandler,
  isNegative: number.isNegativeHandler,
  isInt: number.isIntHandler,

  /* Normal handlers */
  enum: normal.enumHandler,
  matchRegex: normal.matchRegexHandler,
  isEmail: normal.isEmailHandler,
  isUrl: normal.isUrlHandler,
  isCreditCard: normal.isCreditCardHandler,
  isHexColor: normal.isHexColorHandler,
  notEmpty: normal.notEmptyHandler,
  isIP: normal.isIPHandler
};

export default handlerMatcher;