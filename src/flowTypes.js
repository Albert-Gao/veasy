// @flow
import {FieldStatus} from "./helpers/helpers";

export type Target = {
  value: mixed,
  name: string
};

export type UpdateFunc = (mixed) => void;

export type BeforeValidationHandler =
  (mixed) => mixed;

/*
 * All the below rules shouldn't marked as optional
 * However, due to the issue of flow: https://github.com/facebook/flow/issues/6250
 * Seems we need to mark it as always there to pass the flow check
 */
export type FieldRules = {
  default?: mixed,
  min?: number,
  isRequired?: boolean,
  beforeValidation: BeforeValidationHandler,
  reliesOn: { [reliedFieldName: string]: FieldRules }
}

export type FieldSchema = {
  [fieldName: string]: FieldRules
};

/* Same problem as FieldRules comment, it shouldn't be marked as non-optional */
export type Schema = {
  collectValues: {[string]: string},
  [fieldName: string]: FieldRules
};

export type FieldState = {
  value: mixed,
  status: $Keys<typeof FieldStatus>,
  errorText: string
};

export type ComponentState = {
  isFormOK: boolean,
  [fieldName: string]: FieldState
};

export type HandlerFunc = (
  fieldName: string,
  fieldValue: mixed,
  fieldSchema: FieldRules
) => {
  isValid: boolean,
  errorText: string
};

export type Matcher = {
  [ruleName: string]: HandlerFunc
};
