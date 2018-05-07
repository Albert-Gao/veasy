// @flow

import is from 'is_js';
import type {FieldSchema, Schema, ComponentState, FieldRules} from "../flowTypes";
import {FieldStatus} from "./helpers";
import {checkIsFormOK, rulesRunner} from "./validationUtils";

/**
 * Create initial value for a field if no default is provided.
 *
 */
export function createInitialValue(schema: FieldRules): mixed {
  if (schema.default != null) {
    return schema.default;
  } else if (schema.min != null) {
    return schema.min;
  }
  return '';
}

/**
 * Create a new state for a field in componentState.formStatus.fields.field
 *
 */
export function createNewFieldState() {
  return {
    status: FieldStatus.normal,
    errorText: '',
    value: undefined
  };
}

/**
 * When the schema contains a default rule
 */
function validateStateIfHasDefaultValue(
  fieldSchema: FieldSchema,
  fieldValue: mixed
) {
  let result;
  const fieldName = Object.keys(fieldSchema)[0];
  if (fieldSchema[fieldName].default != null){
    try {
      result = rulesRunner(fieldValue, fieldSchema)
    } catch (err) {
      result = err
    }
  }
  return result;
}

export function createFieldState(
  schema: Schema,
  fieldName: string
){
  const initialFieldState = createNewFieldState();
  initialFieldState.value = createInitialValue(schema[fieldName]);

  const result = validateStateIfHasDefaultValue(
    { [fieldName]: schema[fieldName] },
    initialFieldState.value
  );

  if (result) {
    return result;
  }
  return initialFieldState;
}

export function createInitialState(
  schema: Schema,
  userState: ComponentState
) {
  const initialState = {
    ...userState
  };

  Object.keys(schema).forEach(fieldName => {
    if (fieldName === 'collectValues') return;
    initialState[fieldName] = createFieldState(schema, fieldName);
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

  checkIsFormOK(schema, initialState);

  return initialState;
}
