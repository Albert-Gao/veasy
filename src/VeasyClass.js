// @ts-check
import * as lib from './helpers/helpers';
import * as ClassLib from './helpers/veasyClassUtils';
import {createInitialState} from './helpers/initializationUtils';
import {getFieldsValue} from './helpers/collectValuesUtils';

class VeasyClass {
  /**
   * Creates an instance of FormValidator.
   * @param {object} component
   * @param {object} schema
   * @memberof VeasyClass
   */
  constructor(component, schema) {
    ClassLib.typeCheck(component, schema);
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
    return createInitialState(this.schema, userState);
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
    getFieldsValue(
      this.schema,
      this.component.state,
      mustOK
    );
  }
}

export default VeasyClass;
