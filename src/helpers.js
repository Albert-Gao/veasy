// @ts-check
/* eslint-disable no-param-reassign */
// This file contain any `private` method for the index.js

import is from 'is_js';
import handlerMatcher from './matchers';

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

  if (
    is.propertyDefined(schema, 'min') ||
    is.propertyDefined(schema, 'max')
  ) {
    return '0';
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
  schemaItems.forEach((name) => {
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
    } else if (
      ruleInSchema !== 'default'
    ) {
      console.warn(`No such rule: ${ruleInSchema}`);
    }
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
  return runMatchers(handlerMatcher, fieldState, schema);
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
 * If all fields in the state has their status !== error
 * Then we will set the isFormOK to true then return the state.
 * Just mutate the value since it's already a new state object
 *
 * @export
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

export function restoreErrorStatus(fieldState) {
  if (fieldState.status === 'error' && is.empty(fieldState.value)) {
    fieldState.status = 'normal';
    fieldState.errorText = '';
  }
  return fieldState;
}

function updateWhenNeeded(newFieldState, propName, update, schema, formStatus = '') {
  const fieldState = addNameToResult(propName, newFieldState);
  if (formStatus === '') {
    update(fieldState);
  } else {
    const oldFieldState = formStatus[propName];
    const newFieldState1 = {
      ...oldFieldState,
      ...fieldState[propName]
    };
    const finalState = {
      ...formStatus,
      [propName]: { ...newFieldState1 }
    };
    update(checkIsFormOK(schema, finalState));
  }

  // shouldChange(oldFieldState, newFieldState)
}

export function startValidating(target, schema, update, allState) {
  const propName = target.name;
  const fieldInfo = {
    value: target.value,
    schema: schema[propName]
  };

  return Promise.resolve(fieldInfo)
    .then((info) => validatorRunner(info.value, info.schema))
    .then(result1 => checkFieldIsOK(result1))
    .then(result2 => restoreErrorStatus(result2))
    .catch(errorState => errorState)
    .then(newFieldState => updateWhenNeeded(
      newFieldState, propName, update, schema, allState))
}
