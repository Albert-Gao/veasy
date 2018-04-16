import is from 'is_js';
import {FieldStatus} from "./helpers";
import {checkIsFormOK, rulesRunner} from "./validationUtils";

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

/**
 * When the schema contains a default rule
 */
function validateStateIfHasDefaultValue(schema, fieldName, fieldValue) {
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

export function createFieldState(schema, fieldName){
  const initialFieldState = createNewFieldState(true, schema[fieldName]);

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

export function createInitialState(schema, userState) {
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
