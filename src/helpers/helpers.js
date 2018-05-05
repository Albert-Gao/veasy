// @flow
/* eslint-disable no-param-reassign,max-len */
// This file contain any `private` method for the Veasy

import is from 'is_js';
import {rulesRunner, checkIsFormOK} from './validationUtils';
import {createFieldState} from './initializationUtils';
import {TargetType, UpdateFuncType, SchemaType, FieldStateType, ComponentStateType} from "../flowTypes";

export const FieldStatus = {
  ok: 'ok',
  error: 'error',
  normal: 'normal'
};



/**
 * Check if we should change the state or not.
 *
 */
export function shouldChange(
  oldState: FieldStateType,
  newState: FieldStateType
) {
  const isErrorDifferent = oldState.status !== newState.status;
  const isValueDifferent = oldState.value !== newState.value;
  return isErrorDifferent || isValueDifferent;
}

/**
 * throw an error with defined text, usually calls by ruleRunner().
 */
export function throwError(
  value:mixed,
  errorText:string
) {
  // eslint-disable-next-line no-throw-literal
  throw { value, errorText, status: FieldStatus.error };
}



export function resetForm(
  schema: SchemaType,
  state: ComponentStateType
) {
  const newSchema = { ...schema };
  delete newSchema.collectValues;
  const newState = { ...state };
  const fieldNames = Object.keys(newSchema);
  fieldNames.forEach(name => {
    const initialFieldState = createFieldState(schema, name);
    newState[name].value = initialFieldState.value;
    newState[name].status = initialFieldState.status;
    newState[name].errorText = initialFieldState.errorText;
  });
  checkIsFormOK(schema, newState);
  return newState;
}



function updateWhenNeeded(
  newFieldState: FieldStateType,
  propName: string,
  update: UpdateFuncType,
  schema: SchemaType,
  formState: ?ComponentStateType = undefined
) {
  const fieldState = { [propName]: newFieldState };
  if (!formState) {
    update(fieldState);
    return;
  }

  const oldFieldState = formState[propName];
  const newFieldState1 = {
    ...oldFieldState,
    ...fieldState[propName]
  };

  if (
    is.existy(oldFieldState) &&
    is.existy(newFieldState)
  ) {
    if (!shouldChange(oldFieldState, newFieldState)) return;
  } else {
    return;
  }

  const finalState = {
    ...formState,
    [propName]: newFieldState1
  };
  update(checkIsFormOK(schema, finalState));
}


export function startValidating(
  target: TargetType,
  allSchema: SchemaType,
  update: UpdateFuncType,
  allState: {},
  targetName:?string = undefined
) {
  const propName = targetName || target.name;

  if (is.not.existy(propName)) {
    // If the user includes non-form field component
    // Instead of throw, we should just ignore
    return undefined;
  }

  const fieldInfo = {
    value: target.value,
    schema: { [propName]: allSchema[propName] }
  };

  return (
    Promise.resolve(fieldInfo)
      .then(info => rulesRunner(
        info.value,
        info.schema,
        allSchema,
        allState)
      )
      .catch(errorState => errorState)
      .then(newFieldState =>
        updateWhenNeeded(
          newFieldState,
          propName,
          update,
          allSchema,
          allState
        )
      )
  );
}

export function validate(
  e: {persist: ()=>void, target:TargetType},
  schema:SchemaType,
  allState:{},
  update:UpdateFuncType,
  targetName:string
) {
  e.persist();
  startValidating(
    e.target,
    schema,
    update,
    allState,
    targetName
  );
}
