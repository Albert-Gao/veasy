// @flow
/* eslint-disable import/prefer-default-export */
import is from 'is_js';
import type {SchemaType, ComponentStateType} from "../flowTypes";
import {FieldStatus} from "./helpers";

export const getNestedValue = (key: string, obj: {}) =>
  key.split('.').reduce((result1, key1) => result1[key1], obj);

function getCollectValues(collectSchema, state) {
  const fieldsToCollect = Object.keys(collectSchema);
  const result = {};

  fieldsToCollect.forEach(fieldName => {
    result[fieldName] = getNestedValue(collectSchema[fieldName], state);
  });

  return result;
}

export function getFieldsValue(
  schema: SchemaType,
  state: ComponentStateType,
  mustOK: ?boolean = true
) {
  const fieldNames = Object.keys(schema);
  let result = {};

  if (is.propertyDefined(schema, 'collectValues')) {
    result = getCollectValues(schema.collectValues, state);
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
