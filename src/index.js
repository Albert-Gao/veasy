// @ts-check
import * as lib from './helpers';

export function createInitialState(schema) {
  const initialState = {
    formStatus: {
      isFormOK: false,
      fields: {}
    }
  };
  const { fields } = initialState.formStatus;
  Object.keys(schema).forEach(prop => {
    fields[prop] = lib.createNewFieldState(true, schema[prop]);
  });
  return initialState;
}

class EasyV {
  /**
   * Creates an instance of FormValidator.
   * @param {object} component
   * @param {object} schema
   * @memberof FormValidator
   */
  constructor(component, schema) {
    lib.typeCheck(component, schema);
    /** @type { { state:object, setState:Function } } */
    this.component = component;
    /** @type { { formStatus: { isFormOK: boolean, fields: object } } } */
    this.schema = schema;
  }

  /**
   * Create the initial state for a component
   *
   * @returns {object}
   * @memberof FormValidator
   */
  createInitialState() {
    return createInitialState(this.schema);
  }

  /**
   * The validate function, call this in your onChange() handler of the form component
   *
   * @param {object} target
   * @memberof FormValidator
   */
  validate(target) {
    lib.startValidating(
      target,
      this.schema,
      this.component.state.formStatus,
      this.component.setState.bind(this.component)
    );
  }
}

export default EasyV;
