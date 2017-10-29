// @ts-check
/* eslint-disable no-param-reassign */
// This file contain any `private` method for the Veasy

import is from 'is_js';
import handlerMatcher, {
  RuleWhichNeedsArray,
  RuleWhichNeedsBoolean
} from './ruleHandlers/matchers';

export const FieldStatus = {
  ok: 'ok',
  error: 'error',
  normal: 'normal'
};

/**
 * Return error message for checking the parameters of the constructor.
 */
export function getConstructorErrorMessage(paramName, value) {
  return `[Veasy - ${paramName}] Expect: non empty object. Actual: ${value}`;
}

/**
 * Check if an object is a non-empty object
 */
function isNonEmptyObject(obj) {
  return is.object(obj) && is.not.empty(obj);
}

/**
 * Type check for 2 parameters of the constructor
 *
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
 */
export function createNewFieldState(needValue = false, fieldSchema) {
  const result = {
    status: FieldStatus.normal,
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
    if (prop === 'collectValues') return;
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
 */
export function shouldChange(oldState, newState) {
  const isErrorDifferent = oldState.status !== newState.status;
  const isValueDifferent = oldState.value !== newState.value;
  return isErrorDifferent || isValueDifferent;
}

function getNestedValue(key, obj) {
  return key.split('.').reduce((result1, key1) => result1[key1], obj);
}

function getCollectValues(collectSchema, state) {
  const fieldsToCollect = Object.keys(collectSchema);
  const result = {};

  fieldsToCollect.forEach(fieldName => {
    result[fieldName] = getNestedValue(collectSchema[fieldName], state);
  });
  
  return result;
}

export function getFieldsValue(schema, state, mustOK = true) {
  const fieldNames = Object.keys(schema);
  let result = {};

  if (is.propertyDefined(schema, 'collectValues')) {
    result = {
      ...getCollectValues(schema.collectValues, state)
    };
  }

  fieldNames.forEach(name => {
    if (is.not.propertyDefined(state, name)) {
      // eslint-disable-next-line no-console
      console.warn(`[veasy]: No ${name} found in state.`);
      return;
    }
    const fieldState = state[name];
    if (mustOK && fieldState.status !== FieldStatus.ok) return;
    result[name] = fieldState.value;
  });

  return result;
}

/**
 * throw an error with defined text, usually calls by ruleRunner().
 */
export function throwError(value, errorText) {
  const error = { value, errorText, status: FieldStatus.error };
  throw error;
}

function extractUserDefinedMsg(handlerName, schema) {
  const result = { schema, userErrorText: '' };

  // No user message, just return
  if (is.not.array(schema[handlerName])) return result;

  const currentSchema = schema[handlerName];

  // Handle the case where the value of rule is array
  if (RuleWhichNeedsArray.includes(handlerName)) {
    // No user message, just return
    if (is.not.array(currentSchema[0])) return result;
  }

  // The most common case: [0] is rule and [1] is errText
  result.schema = { [handlerName]: currentSchema[0] };
  // eslint-disable-next-line prefer-destructuring
  result.userErrorText = currentSchema[1];
  return result;
}

function ruleRunner(ruleHandler, fieldName, value, pschema) {
  const { schema, userErrorText } = extractUserDefinedMsg(
    ruleHandler.name,
    pschema
  );

  const ruleName = ruleHandler.name;

  if (RuleWhichNeedsBoolean.includes(ruleName)) {
    if (schema[ruleName] === false) return;
  }

  const result = ruleHandler(fieldName, value, schema);
  if (result.isValid) return;

  throwError(value, userErrorText || result.errorText);
}

export function resetForm(schema, state) {
  const newSchema = { ...schema };
  delete newSchema.collectValues;
  const newState = { ...state };
  const fieldNames = Object.keys(newSchema);
  fieldNames.forEach(name => {
    const newField = newState[name];
    newField.status = FieldStatus.normal;
    newField.errorText = '';
    newField.value = createInitialValue(schema[name]);
  });
  newState.isFormOK = false;
  return newState;
}

/**
 * It will run through the user's settings for a field,
 * and try matching to the matchers.js,
 * if according rule could be found,
 * it will then execute the according rule function.
 * For instance:
 * if user sets a `minLength` for a field,
 * This function will invoke the minLength()
 *
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
 * It will generate the initial state to start with
 *
 */
export function rulesRunner(value, schema) {
  const fieldState = createNewFieldState();
  fieldState.value = value;

  if (is.existy(value) && is.not.empty(value)) {
    fieldState.status = FieldStatus.ok;
  }

  return runMatchers(handlerMatcher, fieldState, schema);
}

/**
 * If all fields in the state has their status !== error
 * Then we will set the isFormOK to true then return the state.
 * Just mutate the value since it's already a new state object
 *
 */
export function checkIsFormOK(schema, componentState) {
  const properties = Object.keys(schema);
  let isError = false;
  properties.some(prop => {
    if (prop === 'collectValues') return false;
    if (
      is.propertyDefined(schema[prop], 'isRequired') &&
      schema[prop].isRequired === false &&
      componentState[prop].status !== FieldStatus.error
    ) return false;

    if (
      componentState[prop].status === FieldStatus.error ||
      componentState[prop].status === FieldStatus.normal
    ) {
      isError = true;
      return true;
    }
    return false;
  });
  if (!isError) {
    componentState.isFormOK = true;
  } else {
    componentState.isFormOK = false;
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

export function shouldValidate(keys, targetName) {
  return keys.some(name => name === targetName);
}

export function startValidating(target, schema, update, allState) {
  const propName = target.name;
  const fieldInfo = {
    value: target.value,
    schema: { [propName]: schema[propName] }
  };

  const keys = Object.keys(schema);
  if (!shouldValidate(keys, target.name)) return false;

  return (
    Promise.resolve(fieldInfo)
      // eslint-disable-next-line arrow-body-style
      .then(info => {
        return rulesRunner(info.value, info.schema);
      })
      .catch(errorState => errorState)
      .then(newFieldState =>
        updateWhenNeeded(newFieldState, propName, update, schema, allState)
      )
  );
}

export function validate (e, schema, update, allState) {
  e.persist();
  startValidating(e.target, schema, update, allState);
}