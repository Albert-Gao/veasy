// @flow
import {FieldStatus} from "./helpers/helpers";

export type TargetType = {
  value: mixed,
  name: string
};

export type UpdateFuncType = (mixed) => void;

export type BeforeValidationHandlerType =
  (mixed) => mixed;

/*
 * All the below rules shouldn't marked as optional
 * However, due to the issue of flow: https://github.com/facebook/flow/issues/6250
 * Seems we need to mark it as always there to pass the flow check
 */
export type FieldRuleSetType = {
  default?: mixed,
  min?: number,
  isRequired?: number,
  beforeValidation: BeforeValidationHandlerType,
  reliesOn: { [reliedFieldName: string]: FieldRuleSetType }
}

export type FieldSchemaType = {
  [fieldName: string]: FieldRuleSetType
};

/* Same problem as FieldRuleSetType comment, it shouldn't be marked as non-optional */
export type SchemaType = {
  collectValues: {[string]: string},
  [fieldName: string]: FieldRuleSetType
};

export type FieldStateType = {
  value: mixed,
  status: $Keys<typeof FieldStatus>,
  errorText: string
};

export type ComponentStateType = {
  isFormOK: boolean,
  [fieldName: string]: FieldStateType
};

export type HandlerFuncType = (
  fieldName: string,
  fieldValue: mixed,
  fieldSchema: FieldRuleSetType
) => {
  isValid: boolean,
  errorText: string
};

export type MatcherType = {
  [ruleName: string]: HandlerFuncType
};
