// @ts-check
/* eslint-disable no-param-reassign */
// This file contain any `private` method for the EasyV

import is from 'is_js';
import handlerMatcher, { RuleWhichNeedsArray } from './ruleHandlers/matchers';

/**
 * Return error message for checking the parameters of the constructor.
 *
 * @export
 * @param {string} paramName
 * @param {any} value
 * @returns {string}
 */
export function getConstructorErrorMessage(paramName, value) {
  return `[EasyV - ${paramName}] Expect: non empty object. Actual: ${value}`;
}

/**
 * Check if an object is a non-empty object
 *
 * @param {any} obj
 * @returns {boolean}
 */
function isNonEmptyObject(obj) {
  return is.object(obj) && is.not.empty(obj);
}

/**
 * Type check for 2 parameters of the constructor
 *
 * @export
 * @param {object} component
 * @param {object} schema
 */
export function typeCheck(component, schema) {
  const isComponentValid = isNonEmptyObject(component);
  const isSchemaValid = isNonEmptyObject(schema);

  if (!isComponentValid) {
    throw new Error(
      getConstructorErrorMessage('Parameter component', component)
    );
  }

  if (!isSchemaValid) {
    throw new Error(getConstructorErrorMessage('Parameter schema', schema));
  }

  Object.keys(schema).forEach(prop => {
    if (!isNonEmptyObject(schema[prop])) {
      throw new Error(
        getConstructorErrorMessage(`schema.${prop}`, schema[prop])
      );
    }
  });
}

/**
 * Create initial value for a field if no default is provided.
 *
 * @export
 * @param {object} schema
 * @returns {boolean | string}
 */
export function createInitialValue(schema) {
  if (is.propertyDefined(schema, 'default')) {
    return schema.default;
  } else if (is.propertyDefined(schema, 'min')) {
    return schema.min;
  }
  return '';
}

/**
 * Create a new state for a field in componentState.formStatus.fields.field
 *
 * @export
 * @param {boolean} [needValue=false]
 * @param {object} [fieldSchema]
 * @returns {object}
 */
export function createNewFieldState(needValue = false, fieldSchema) {
  const result = {
    status: 'normal',
    errorText: ''
  };
  if (needValue) {
    result.value = createInitialValue(fieldSchema);
  }
  return result;
}

export function createInitialState(schema, userState) {
  const initialState = {
    isFormOK: false,
    ...userState
  };

  Object.keys(schema).forEach(prop => {
    initialState[prop] = createNewFieldState(true, schema[prop]);
  });

  const schemaItems = Object.keys(schema);
  schemaItems.forEach(name => {
    if (is.propertyDefined(userState, name)) {
      initialState[name] = {
        ...initialState[name],
        ...userState[name]
      };
    }
  });

  return initialState;
}

/**
 * Check if we should change the state or not.
 *
 * @export
 * @param {object} oldState
 * @param {object} newState
 * @returns {boolean}
 */
export function shouldChange(oldState, newState) {
  const isErrorDifferent = oldState.status !== newState.status;
  const isValueDifferent = oldState.value !== newState.value;
  return isErrorDifferent || isValueDifferent;
}

/**
 * throw an error with defined text, usually calls by handler.
 *
 * @export
 * @param {any} value
 * @param {string} errorText
 * @returns {never}
 */
export function throwError(value, errorText) {
  const error = { value, errorText, status: 'error' };
  throw error;
}

function extractUserDefinedMsg(handlerName, schema) {
  const result = { schema, userErrorText: '' };
  const ruleName = handlerName === 'enumRule' ? 'enum' : handlerName;

  // No user message, just return
  if (is.not.array(schema[ruleName])) return result;

  const currentSchema = schema[ruleName];

  // Handle the case where the value of rule is array
  if (RuleWhichNeedsArray.includes(handlerName)) {
    // No user message, just return
    if (is.not.array(currentSchema[0])) return result;
  }

  // The most common case: item0 is rule and item1 is errText
  result.schema = { [ruleName]: currentSchema[0] };
  // eslint-disable-next-line prefer-destructuring
  result.userErrorText = currentSchema[1];
  return result;
}

function ruleRunner(ruleHandler, fieldName, value, pschema) {
  const { schema, userErrorText } = extractUserDefinedMsg(
    ruleHandler.name,
    pschema
  );

  const result = ruleHandler(fieldName, value, schema);
  if (result.isValid) return;

  throwError(value, userErrorText || result.errorText);
}

/**
 * It will run through the user's settings for a field,
 * and try matching to the matchers.js,
 * if according handler could be found,
 * it will then execute the according handler function.
 * For instance:
 * if user sets a `minLength` for a field,
 * This function will invoke the minLengthHandler()
 *
 * @param {object} matcher
 * @param {object} fieldState
 * @param {object} schema
 */
function runMatchers(matcher, fieldState, fieldSchema) {
  const fieldName = Object.keys(fieldSchema)[0];
  const schema = fieldSchema[fieldName];
  Object.keys(schema).forEach(ruleInSchema => {
    if (is.propertyDefined(matcher, ruleInSchema)) {
      ruleRunner(matcher[ruleInSchema], fieldName, fieldState.value, schema);
    }
    // TODO: Do something when the rule is not match
    // else if (ruleInSchema !== 'default') {
    // }
  });
  return fieldState;
}

/**
 * This is the main entry for all validator.
 *
 * @export
 * @param {any} value
 * @param {object} schema
 * @returns {object}
 */
export function validatorRunner(value, schema) {
  const fieldState = createNewFieldState();
  fieldState.value = value;

  if (is.existy(value) && is.not.empty(value)) {
    fieldState.status = 'ok';
  }

  return runMatchers(handlerMatcher, fieldState, schema);
}

/**
 * If all fields in the state has their status !== error
 * Then we will set the isFormOK to true then return the state.
 * Just mutate the value since it's already a new state object
 *
 * @export
 * @param {object} schema
 * @param {object} componentState
 * @returns {object}}
 */
export function checkIsFormOK(schema, componentState) {
  const properties = Object.keys(schema);
  let isError = false;
  properties.some(prop => {
    if (componentState[prop].status === 'error') {
      isError = true;
      return true;
    }
    return false;
  });
  if (!isError) {
    componentState.isFormOK = true;
  }
  return componentState;
}

function updateWhenNeeded(
  newFieldState,
  propName,
  update,
  schema,
  formStatus = ''
) {
  const fieldState = { [propName]: newFieldState };
  if (formStatus === '') {
    update(fieldState);
    return;
  }

  const oldFieldState = formStatus[propName];
  const newFieldState1 = {
    ...oldFieldState,
    ...fieldState[propName]
  };

  if (!shouldChange(oldFieldState, newFieldState)) return;

  const finalState = {
    ...formStatus,
    [propName]: { ...newFieldState1 }
  };
  update(checkIsFormOK(schema, finalState));
}

export function startValidating(target, schema, update, allState) {
  const propName = target.name;
  const fieldInfo = {
    value: target.value,
    schema: { [propName]: schema[propName] }
  };

  return Promise.resolve(fieldInfo)
    .then(info => validatorRunner(info.value, info.schema))
    .catch(errorState => errorState)
    .then(newFieldState =>
      updateWhenNeeded(newFieldState, propName, update, schema, allState)
    );
}
