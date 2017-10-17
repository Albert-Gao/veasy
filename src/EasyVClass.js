// @ts-check
import * as lib from './helpers';

class EasyVClass {
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
    this.schema = schema;
  }

  /**
   * Create the initial state for a component
   *
   * @returns {object}
   * @memberof FormValidator
   */
  createInitialState(userState) {
    return lib.createInitialState(this.schema, userState);
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
      this.component.state,
      this.component.setState.bind(this.component)
    );
  }
}

export default EasyVClass;
