// @flow

import is from 'is_js';
import type {FieldSchemaType, SchemaType, ComponentStateType, FieldRuleSetType} from "../flowTypes";
import {FieldStatus} from "./helpers";
import {checkIsFormOK, rulesRunner} from "./validationUtils";

/**
 * Create initial value for a field if no default is provided.
 *
 */
export function createInitialValue(schema: FieldRuleSetType) {
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
export function createNewFieldState() {
  const result = {};
  result.status = FieldStatus.normal;
  result.errorText = '';
  return result;
}

/**
 * When the schema contains a default rule
 */
function validateStateIfHasDefaultValue(
  schema: SchemaType,
  fieldName: string,
  fieldValue: mixed
) {
  let result;
  if (is.propertyDefined(schema[fieldName], 'default')){
    try {
      result = rulesRunner(fieldValue, schema)
    } catch (err) {
      result = err
    }
  }
  return result;
}

export function createFieldState(
  schema: SchemaType,
  fieldName: string
){
  const initialFieldState = createNewFieldState();
  initialFieldState.value = createInitialValue(schema[fieldName]);

  const result = validateStateIfHasDefaultValue(
    schema,
    fieldName,
    initialFieldState.value
  );

  if (result) {
    return result;
  }
  return initialFieldState;
}

export function createInitialState(
  schema:SchemaType,
  userState: ComponentStateType
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
