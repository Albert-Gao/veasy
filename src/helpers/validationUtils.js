// @flow
/* eslint-disable no-use-before-define,max-len,no-param-reassign,array-callback-return,consistent-return */
import is from 'is_js';
import type {ComponentState, FieldSchema, FieldState, HandlerFunc, Schema, Matcher, FieldRules, BeforeValidationHandler, ReliesFieldRules} from "../flowTypes";
import {getNestedValue} from "./collectValuesUtils";
import {FieldStatus, throwError} from "./helpers";
import handlerMatcher, {
  RuleWhichNeedsArray,
  RuleWhichNeedsBoolean
} from "../ruleHandlers/matchers";
import {createNewFieldState} from './initializationUtils';

/**
 * If all fields in the state has their status !== error
 * Then we will set the isFormOK to true then return the state.
 * Just mutate the value since it's already a new state object
 *
 */
export function checkIsFormOK(
  schema: Schema,
  componentState: ComponentState
) {
  const properties = Object.keys(schema);
  let isError = false;
  properties.some(prop => {
    if (prop === 'collectValues') return false;

    if (
      schema[prop].isRequired != null &&
      schema[prop].isRequired === false &&
      componentState[prop].status !== FieldStatus.error
    )
      return false;

    if (componentState[prop].status === FieldStatus.error) {
      isError = true;
      return true;
    }

    if (componentState[prop].status === FieldStatus.normal) {
      if (schema[prop].onlyWhen != null) {
        const result = isOnlyWhenFulfilled(
          schema[prop].onlyWhen,
          {...componentState[prop]},
          schema,
          componentState
        );

        if (result) {
          const fieldSchema = schema[prop];
          delete fieldSchema.onlyWhen;
          let validationResult;
          try {
            validationResult = rulesRunner(
              componentState[prop].value,
              { [prop]: fieldSchema },
              schema,
              componentState
            )
          } catch (err) {
            isError = true;
            validationResult = err;
          }

          if (validationResult != null) {
            componentState[prop] = {...validationResult};
          }

          return isError;
        }

        return false;
      }

      if (schema[prop].default == null) {
        isError = true;
        return true;
      }

      if (schema[prop].default !== componentState[prop].value) {
        isError = true;
        return true;
      }
    }
    return false;
  });
  componentState.isFormOK = !isError;

  return componentState;
}



function handleBeforeValidation(
  fieldValue: mixed,
  handler: BeforeValidationHandler
) {
  if (is.function(handler)) {
    return handler(fieldValue);
  }
  return fieldValue;
}



function extractUserDefinedMsg(
  handlerName: string,
  schema: FieldRules
) {
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
  const [rule, errText] = currentSchema;
  result.schema[handlerName] = rule;
  result.userErrorText = errText;
  return result;
}



function ruleRunner(
  ruleName: string,
  ruleHandler: HandlerFunc,
  fieldName: string,
  value: mixed,
  fieldRules: FieldRules
) {
  if (ruleHandler == null) {
    // eslint-disable-next-line no-console
    console.warn(`[Veasy.js] ${ruleName} is invalid. Please check the online doc for more reference: https://albert-gao.github.io/veasy/#/rules`);
    return;
  }

  const { schema, userErrorText } = extractUserDefinedMsg(
    ruleName,
    fieldRules
  );

  if (RuleWhichNeedsBoolean.includes(ruleName)) {
    if (schema[ruleName] === false) return;
  }

  const result = ruleHandler(fieldName, value, schema);
  if (result.isValid) return;

  throwError(value, userErrorText || result.errorText);
}

function grabValueForReliesField(
  allSchema: Schema,
  allState: ComponentState,
  reliedFieldName: string
) {
  let result;

  if (
    allState[reliedFieldName] != null &&
    allState[reliedFieldName].value != null
  ) {
    result = allState[reliedFieldName].value
  }
  else if (
    allSchema.collectValues != null &&
    allSchema.collectValues[reliedFieldName] != null
  ) {
      result = getNestedValue(
        allSchema.collectValues[reliedFieldName],
        allState
      )
  }

  return result;
}

function handleReliesOn(
  fieldReliesOnSchema: ReliesFieldRules,
  fieldState: FieldState,
  allSchema: Schema,
  allState: ComponentState
) {
  const originalFieldState = {...fieldState};
  Object.keys(fieldReliesOnSchema).forEach(reliedFieldName => {
    const reliesKeySchema = fieldReliesOnSchema[reliedFieldName];
    Object.keys(reliesKeySchema).forEach(rule => {

      if (handlerMatcher[rule] == null) return;

      const reliedFieldValue = grabValueForReliesField(
        allSchema,
        allState,
        reliedFieldName
      );

      try {
        ruleRunner(
          rule,
          handlerMatcher[rule],
          reliedFieldName,
          reliedFieldValue, // Here we need to swap the field value to the target value
          reliesKeySchema
        );
      } catch (err) {
        // Restore the original value
        err.value = originalFieldState.value;
        throw err;
      }
    });
  });
}


function isOnlyWhenFulfilled(
  fieldOnlyWhenSchema: ReliesFieldRules,
  fieldState: FieldState,
  allSchema: Schema,
  allState: ComponentState
): boolean {
  return Object.keys(fieldOnlyWhenSchema).every(reliedFieldName => {
    const reliesKeySchema = fieldOnlyWhenSchema[reliedFieldName];

    return Object.keys(reliesKeySchema).every(rule => {
      const reliedFieldValue = grabValueForReliesField(
        allSchema,
        allState,
        reliedFieldName
      );

      try {
        ruleRunner(
          rule,
          handlerMatcher[rule],
          reliedFieldName,
          reliedFieldValue, // Here we need to swap the field value to the target value
          reliesKeySchema
        );
      } catch (err) {
        return false;
      }

      return true;
    });
  });
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
function runMatchers(
  matcher: Matcher,
  fieldState: FieldState,
  fieldSchema: FieldSchema,
  allSchema?: Schema,
  allState?: ComponentState
) {
  const fieldName = Object.keys(fieldSchema)[0];
  const fieldRules = fieldSchema[fieldName];

  if (fieldRules.onlyWhen != null) {
    if (allSchema && allState) {
      const result = isOnlyWhenFulfilled(
        fieldRules.onlyWhen,
        {...fieldState},
        allSchema,
        allState
      );

      if (result === false) {
        fieldState.status = FieldStatus.normal;
        return fieldState;
      }
    }
  }

  if (
    fieldRules.beforeValidation != null
  ) {
    fieldState.value = handleBeforeValidation(
      fieldState.value,
      fieldRules.beforeValidation
    );
  }

  Object.keys(fieldRules).forEach(ruleInSchema => {
    if (ruleInSchema === 'reliesOn') {
      const fieldReliesOnSchema = fieldSchema[fieldName].reliesOn;
      if (allSchema && allState && (fieldReliesOnSchema != null) ) {
        handleReliesOn(
          fieldReliesOnSchema,
          fieldState,
          allSchema,
          allState
        )
      }
    }
    else {
      // eslint-disable-next-line no-use-before-define
      ruleRunner(
        ruleInSchema,
        matcher[ruleInSchema],
        fieldName,
        fieldState.value,
        fieldRules
      );
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
export function rulesRunner(
  value: mixed,
  fieldSchema: FieldSchema,
  allSchema?: Schema,
  allState?: ComponentState
) {
  const fieldState = createNewFieldState();
  fieldState.value = value;

  if (
    is.existy(value) &&
    is.not.empty(value)
  ) {
    fieldState.status = FieldStatus.ok;
  }

  return runMatchers(
    handlerMatcher,
    fieldState,
    fieldSchema,
    allSchema,
    allState
  );
}
