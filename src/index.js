// @ts-check
import * as lib from './helpers';

class FormValidator {
  /**
     * Creates an instance of FormValidator.
     * @param {object} component 
     * @param {object} schema 
     * @memberof FormValidator
     */
  constructor(component, schema) {
    lib.typeCheck(component, schema);
    /** @type { { state:object, setState:a:Function } } */
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
    const initialState = {
      formStatus: {
        isFormOK: false,
        fields: {}
      }
    };
    const { fields } = initialState.formStatus;
    Object.keys(this.schema).forEach(prop => {
      fields[prop] = lib.createNewFieldState(true, this.schema[prop]);
    });
    return initialState;
  }

  /**
   * The validate function, call this in your onChange() handler of the form component
   * 
   * @param {object} target 
   * @memberof FormValidator
   */
  validate(target) {
    const propName = target.name;
    const targetSchema = this.schema[propName];

    return Promise.resolve({
      value: target.value,
      schema: targetSchema
    })
      .then(({ value, schema }) => lib.validatorRunner({ value, schema }))
      .catch(wrongResult => wrongResult)
      .then(result => {
        const newFieldState = lib.checkFieldIsOK(result);
        const oldFieldState = this.component.state.formStatus.fields[propName];
        if (lib.shouldChange(oldFieldState, newFieldState)) {
          const fieldState = lib.addNameToResult(propName, newFieldState);
          let newComponentState = lib.createNewState(
            this.component.state,
            fieldState
          );
          newComponentState = lib.checkIsFormOK(newComponentState);
          this.component.setState(newComponentState);
        }
      });
  }
}

export default FormValidator;
