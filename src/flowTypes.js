/* eslint-disable no-use-before-define */
// @flow
import {FieldStatus} from "./helpers/helpers";

export type Target = {
  value: mixed,
  name: string
};

export type UpdateFunc = (mixed) => void;

export type BeforeValidationHandler =
  (mixed) => mixed;

export type FieldRules = {
  default?: mixed,
  min?: number,
  isRequired?: boolean,
  beforeValidation?: BeforeValidationHandler,
  reliesOn?: ReliesFieldRules,
  onlyWhen?: ReliesFieldRules
}

export type ReliesFieldRules = {
  [reliedFieldName: string]: FieldRules
};

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
