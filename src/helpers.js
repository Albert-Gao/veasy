// @ts-check
/* eslint-disable no-param-reassign */
// This file contain any `private` method for the index.js

import is from 'is_js';
import {normalMatcher, numberMatcher, stringMatcher} from './matchers';

export const NAME_PLACEHOLDER = '#{NAME}#';

/**
 * Return error message for checking the parameters of the constructor.
 *
 * @export
 * @param {string} paramName
 * @param {any} value
 * @returns {string}
 */
export function getConstructorErrorMessage(paramName, value) {
  return `[Form Validation - ${paramName}] Expect: non empty object. Actual: ${value}`;
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

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
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
  }
  switch (schema.type) {
    case 'boolean':
      return true;
    case 'string':
      return '';
    case 'number':
      return '0';
    default:
      return '';
  }
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
  const result = createNewFieldState();
  result.value = value;
  result.status = 'error';
  result.errorText = errorText;
  throw result;
}

/**
 * Modify the state from { state } to { fieldName: state }
 *
 * @export
 * @param {string} name
 * @param {object} result
 * @returns {object}
 */
export function addNameToResult(name, result) {
  if (result.status === 'error') {
    result.errorText = result.errorText.replace(NAME_PLACEHOLDER, name);
  }
  return { [name]: result };
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
function runMatchers(matcher, fieldState, schema) {
  Object.keys(schema).forEach(ruleInSchema => {
    if (is.propertyDefined(matcher, ruleInSchema)) {
      matcher[ruleInSchema](fieldState, schema);
    }
  });
}

/**
 * A wrapper around the runMatchers function
 * For easily calling the stringMatchers.
 *
 * @export
 * @param {object} fieldState
 * @param {object} schema
 */
function runStringMatchers(fieldState, schema) {
  runMatchers(stringMatcher, fieldState, schema.string);
}

function runNumberMatchers(fieldState, schema) {
  runMatchers(numberMatcher, fieldState, schema.number);
}

function runNormalMatchers(fieldState, schema) {
  runMatchers(normalMatcher, fieldState, schema);
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
  if (is.propertyDefined(schema, 'string')) {
    runStringMatchers(fieldState, schema);
  } else if (is.propertyDefined(schema, 'number')) {
    runNumberMatchers(fieldState, schema);
  }

  runNormalMatchers(fieldState, schema);

  return fieldState;
}

/**
 * If field's status === `error` and its value isn't empty
 * we will set its status to `ok`
 * then return it.
 * It's fine to mutate here, since it's already a new state here.
 *
 * @export
 * @param {object} fieldState
 * @returns {object}
 */
export function checkFieldIsOK(fieldState) {
  if (
    fieldState.status !== 'error' &&
    is.existy(fieldState.value) &&
    is.not.empty(fieldState.value)
  ) {
    fieldState.status = 'ok';
  }
  return fieldState;
}

/**
 * The function is for merging the new field state to  the existing whole state
 * It will return a new object.
 *
 * @export
 * @param {object} oldComponentState
 * @param {object} fieldState
 * @returns {object}
 */
export function createNewState(oldComponentState, fieldState) {
  const fieldName = Object.keys(fieldState)[0];
  const fieldInsideState = fieldState[fieldName];
  return {
    formStatus: {
      isFormOK: oldComponentState.isFormOK,
      fields: {
        ...oldComponentState.fields,
        [fieldName]: fieldInsideState
      }
    }
  };
}

/**
 * If all fields in the state has their status !== error
 * Then we will set the isFormOK to true then return the state.
 * Just mutate the value since it's already a new state object
 *
 * @export
 * @param {object} componentState
 * @returns {object}}
 */
export function checkIsFormOK(componentState) {
  const { fields } = componentState.formStatus;
  const properties = Object.keys(fields);
  let isError = false;
  properties.some(prop => {
    if (fields[prop].status === 'error') {
      isError = true;
      return true;
    }
    return false;
  });
  if (!isError) {
    componentState.formStatus.isFormOK = true;
  }
  return componentState;
}

export function restoreErrorStatus(fieldState) {
  if (
    fieldState.status === 'error' &&
    is.empty(fieldState.value)
  ) {
    fieldState.status = 'normal';
    fieldState.errorText = '';
  }
  return fieldState;
}

export function startValidating(target, schema, formStatus, update) {
  const propName = target.name;
  const targetSchema = schema[propName];

  return Promise.resolve({
      value: target.value,
      schema: targetSchema
    })
    .then(({ value, schema }) => validatorRunner(value, schema))
    .then(result => {
        return checkFieldIsOK(result)
    })
    .then(result => restoreErrorStatus(result))
    .catch(wrongResult => wrongResult)
    .then(newFieldState => {
      const oldFieldState = formStatus.fields[propName];
      if (shouldChange(oldFieldState, newFieldState)){
        const fieldState = addNameToResult(propName, newFieldState);
        let newComponentState = createNewState(formStatus, fieldState);
        newComponentState = checkIsFormOK(newComponentState);
        update(newComponentState);
        return newComponentState;
      }
    });
}