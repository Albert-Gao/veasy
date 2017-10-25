// @ts-check
import * as lib from './helpers';

class VeasyClass {
  /**
   * Creates an instance of FormValidator.
   * @param {object} component
   * @param {object} schema
   * @memberof VeasyClass
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
   * @memberof VeasyClass
   */
  createInitialState(userState) {
    return lib.createInitialState(this.schema, userState);
  }

  /**
   * The validate function, call this in your onChange() handler of the form component
   *
   * @param {object} target
   * @memberof VeasyClass
   */
  validate(target) {
    lib.startValidating(
      target,
      this.schema,
      this.component.state,
      this.component.setState.bind(this.component)
    );
  }

  getFieldsValue(mustOK=true) {
    lib.getFieldsValue(
      this.schema,
      this.component.state,
      mustOK
    );
  }
}

export default VeasyClass;
