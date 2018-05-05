// @flow

import is from 'is_js';

/**
 * Check if an object is a non-empty object
 */
export function isNonEmptyObject(obj: mixed): Boolean {
  return is.object(obj) && is.not.empty(obj);
}

/**
 * Return error message for checking the parameters of the constructor.
 */
export function getConstructorErrorMessage(
  paramName: string,
  value: any
) {
  return `[Veasy - ${paramName}] Expect: non empty object. Actual: ${value}`;
}

/**
 * Type check for 2 parameters of the constructor
 *
 */
export function typeCheck(component: {}, schema: {}) {
  const isComponentValid = isNonEmptyObject(component);
  const isSchemaValid = isNonEmptyObject(schema);

  if (!isComponentValid) {
    throw new Error(
      getConstructorErrorMessage('Parameter component', component)
    );
  }

  if (!isSchemaValid) {
    throw new Error(getConstructorErrorMessage('Parameter schema', schema));
  }

  Object.keys(schema).forEach(prop => {
    if (!isNonEmptyObject(schema[prop])) {
      throw new Error(
        getConstructorErrorMessage(`schema.${prop}`, schema[prop])
      );
    }
  });
}
