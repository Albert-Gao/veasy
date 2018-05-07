// @flow
/* eslint-disable import/prefer-default-export */
import type {Schema, ComponentState, CollectValuesSchema} from "../flowTypes";
import {FieldStatus} from "./helpers";

export const getNestedValue = (key: string, obj: ComponentState) =>
  key.split('.').reduce((result1, key1) => result1[key1], obj);

function getCollectValues(
  collectSchema: CollectValuesSchema,
  state: ComponentState
) {
  const fieldsToCollect = Object.keys(collectSchema);
  const result = {};

  fieldsToCollect.forEach(fieldName => {
    result[fieldName] = getNestedValue(collectSchema[fieldName], state);
  });

  return result;
}

export function getFieldsValue(
  schema: Schema,
  state: ComponentState,
  mustOK: ?boolean = true
) {
  const fieldNames = Object.keys(schema);
  let result = {};

  if (schema.collectValues != null) {
    result = getCollectValues(schema.collectValues, state);
  }

  fieldNames.forEach(name => {
    if (state[name] == null) {
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
