import * as lib from '../src/helpers/helpers';
import {createInitialValue} from '../src/helpers/initializationUtils';
import {getFieldsValue} from "../src/helpers/collectValuesUtils";
import {checkIsFormOK} from "../src/helpers/validationUtils";
/* eslint-disable no-new */
import VeasyClass from '../src/VeasyClass';

describe('Test the createInitialState method', () => {
  let schema;
  const component = { dummy: true };

  beforeEach(() => {
    schema = {
      title: { minLength: 2 },
      name: { notEmpty: true }
    };
  });

  test('Should return an object with certain properties', () => {
    const state = new VeasyClass(component, schema).createInitialState();
    expect(state).toEqual({
      isFormOK: false,
      name: {
        status: 'normal',
        errorText: '',
        value: ''
      },
      title: {
        status: 'normal',
        errorText: '',
        value: ''
      }
    });
  });

  test('Should return proper default state', () => {
    schema = {
      title: {
        default: 'free'
      }
    };
    const state = new VeasyClass(component, schema).createInitialState();
    expect(state).toEqual({
      isFormOK: true,
      title: {
        status: 'ok',
        errorText: '',
        value: 'free'
      }
    });
  });

  test('Should ignore the collectValues in schema', () => {
    schema.collectValues = {
      super: 'girl',
      flash: 'Season4'
    };
    const state = new VeasyClass(component, schema).createInitialState();
    expect(state).toEqual({
      isFormOK: false,
      name: {
        status: 'normal',
        errorText: '',
        value: ''
      },
      title: {
        status: 'normal',
        errorText: '',
        value: ''
      }
    });
  });

  test('Should return an object with value equal default if there is', () => {
    schema.title.default = "a";
    schema.name.default = 'albert';
    const state = new VeasyClass(component, schema).createInitialState();
    expect(state).toEqual({
      isFormOK: false,
      title: {
        status: 'error',
        errorText: 'title\'s length should be equal or greater than 2. Current: 1',
        value: 'a'
      },
      name: {
        status: 'ok',
        errorText: '',
        value: 'albert'
      }
    });
  });

  test('Should return an object with user`s state - no reuse', () => {
    schema.title.default = 'I am default';
    schema.name.default = 'albert';
    const userState = {
      A: 'super',
      B: {
        a: 1,
        b: 'a'
      },
      C: 1
    };
    const state = new VeasyClass(component, schema).createInitialState(
      userState
    );
    expect(state).toEqual({
      isFormOK: true,
      name: {
        status: 'ok',
        errorText: '',
        value: 'albert'
      },
      title: {
        status: 'ok',
        errorText: '',
        value: 'I am default'
      },
      A: 'super',
      B: {
        a: 1,
        b: 'a'
      },
      C: 1
    });
  });

  test('Should return an object with user`s state - with reuse', () => {
    schema.title.default = 'I am default';
    schema.name.default = 'albert';
    const userState = {
      name: {
        firstName: 'Albert',
        lastName: 'Gao'
      },
      title: {
        realLength: 123
      },
      A: 'super',
      B: {
        a: 1,
        b: 'a'
      },
      C: 1
    };
    const state = new VeasyClass(component, schema).createInitialState(
      userState
    );
    expect(state).toEqual({
      isFormOK: true,
      name: {
        status: 'ok',
        errorText: '',
        value: 'albert',
        firstName: 'Albert',
        lastName: 'Gao'
      },
      title: {
        status: 'ok',
        errorText: '',
        value: 'I am default',
        realLength: 123
      },
      A: 'super',
      B: {
        a: 1,
        b: 'a'
      },
      C: 1
    });
  });
});

describe('Test the createInitialValue method', () => {
  test('Should return min when there is min', () => {
    const schema = { min: '6' };
    expect(createInitialValue(schema)).toBe('6');
  });

  test('Should return default when there is default', () => {
    const schema = { default: '5' };
    expect(createInitialValue(schema)).toBe('5');
  });

  test('Should return empty when there is no default and min', () => {
    const schema = { notEmpty: true };
    expect(createInitialValue(schema)).toBe('');
  });
});

describe('Test the shouldChange method', () => {
  test('Should return false when no change', () => {
    const oldState = { status: 'ok', value: '1' };
    expect(lib.shouldChange(oldState, oldState)).toBe(false);
  });

  test('Should return true when change - status case', () => {
    const oldState = { status: 'ok', value: '1' };
    const newState = { status: 'error', value: '2' };
    expect(lib.shouldChange(oldState, newState)).toBe(true);
  });

  test('Should return true when change - value case', () => {
    const oldState = { status: 'ok', value: '5' };
    const newState = { status: 'ok', value: '2' };
    expect(lib.shouldChange(oldState, newState)).toBe(true);
  });
});

describe('Test the getFieldsValue method', () => {
  let schema;
  let state;

  beforeEach(() => {
    state = {
      title: {
        status: 'error',
        errorText: 'too short',
        value: 'abc'
      },
      description: {
        status: 'ok',
        errorText: '',
        value: '12345678901'
      }
    };
    schema = {
      title: {
        minLength: 5,
        maxLength: 10
      },
      description: {
        minLength: 10,
        maxLength: 20
      }
    };
  });

  test('should return all the values of fields which are ok', () => {
    const result = getFieldsValue(schema, state);
    expect(result).toEqual({
      description: '12345678901'
    });
  });

  test('should return only the values of all fields', () => {
    const result = getFieldsValue(schema, state, false);
    expect(result).toEqual({
      title: 'abc',
      description: '12345678901'
    });
  });

  test('should console.warn when field not in state.', () => {
    delete state.description;
    const mockConsole = jest.fn();
    // eslint-disable-next-line no-console
    console.warn = mockConsole;
    const result = getFieldsValue(schema, state, false);
    expect(result).toEqual({
      title: 'abc'
    });
    expect(mockConsole.mock.calls.length).toBe(1);
    expect(mockConsole).toBeCalledWith(
      '[veasy]: No description found in state.'
    );
  });

  test('Should honour collectValue section -case 1 - mustOK=false', () => {
    schema.collectValues = { gender: 'genderInfo' };
    state.genderInfo = 'male';
    const result = getFieldsValue(schema, state, false);
    expect(result).toEqual({
      title: 'abc',
      description: '12345678901',
      gender: 'male'
    });
  });

  test('Should honour collectValue section -case 2 - mustOK=true', () => {
    schema.collectValues = { gender: 'genderInfo' };
    state.genderInfo = 'male';
    const result = getFieldsValue(schema, state, true);
    expect(result).toEqual({
      description: '12345678901',
      gender: 'male'
    });
  });

  test('Should honour collectValue section -case 3 - nested', () => {
    schema.collectValues = { gender: 'genderInfo.user.gender.info' };
    state.genderInfo = { user: { gender: { info: 'male' } } };
    const result = getFieldsValue(schema, state, true);
    expect(result).toEqual({
      description: '12345678901',
      gender: 'male'
    });
  });
});

describe('Test the checkIsFormOK method', () => {
  let state;
  let schema;

  beforeEach(() => {
    state = {
      isFormOK: false,
      title: {
        status: 'ok',
        errorText: '',
        value: 'abc'
      },
      description: {
        status: 'normal',
        errorText: '',
        value: ''
      }
    };
    schema = {
      title: {
        minLength: 5,
        maxLength: 10
      },
      description: {
        minLength: 10,
        maxLength: 20
      }
    };
  });

  test('shouldn`t change to ok if one status is normal without default in schema', () => {
    checkIsFormOK(schema, state);
    expect(state.isFormOK).toBe(false);
  });

  test('should change to ok if one status is normal with default in schema', () => {
    const value = 'i am default';
    state.title = {
      status: 'normal',
      errorText: '',
      value
    };
    schema.title = { default: value };

    delete state.description;
    delete schema.description;

    checkIsFormOK(schema, state);
    expect(state.isFormOK).toBe(true);
  });

  test('should change to false when `normal` and different default', () => {
    const value = 'i am default';
    state.title = {
      status: 'normal',
      errorText: '',
      value
    };
    schema.title = { default: value + 'abc' };

    delete state.description;
    delete schema.description;

    checkIsFormOK(schema, state);
    expect(state.isFormOK).toBe(false);
  });

  test('could restore the isFormOK to false - error', () => {
    state.isFormOK = true;
    state.title.status = 'error';
    checkIsFormOK(schema, state);
    expect(state.isFormOK).toBe(false);
  });

  test('could restore the isFormOK to false - normal', () => {
    state.isFormOK = true;
    state.title.status = 'normal';
    checkIsFormOK(schema, state);
    expect(state.isFormOK).toBe(false);
  });

  test('could restore the isFormOK to false - collectValues', () => {
    schema.collectValues = {
      firstName: 'firstName'
    };
    state.description.status = 'ok';
    checkIsFormOK(schema, state);
    expect(state.isFormOK).toBe(true);
  });

  test('should honour isRequired = false', () => {
    // It should ignore error field when isRequired = false
    state.isFormOK = true;
    state.description.status = 'error';
    state.description.errorText = 'super error';
    schema.description.isRequired = false;
    checkIsFormOK(schema, state);
    expect(state.isFormOK).toBe(false);
  });

  test('should honour isRequired = false', () => {
    // It should ignore error field when isRequired = false
    state.description.status = 'normal';
    schema.description.isRequired = false;
    checkIsFormOK(schema, state);
    expect(state.isFormOK).toBe(true);
  });

  test('should honour isRequired = false', () => {
    // It should ignore error field when isRequired = false
    state.description.status = 'ok';
    schema.description.isRequired = false;
    checkIsFormOK(schema, state);
    expect(state.isFormOK).toBe(true);
  });

  test('should honour isRequired = true', () => {
    // It should ignore error field when isRequired = false
    state.isFormOK = true;
    state.description.status = 'error';
    schema.description.isRequired = true;
    checkIsFormOK(schema, state);
    expect(state.isFormOK).toBe(false);
  });
});

describe('Test the resetForm method', () => {
  let schema;
  let state;

  beforeEach(() => {
    state = {
      isFormOK: true,
      title: {
        status: 'error',
        errorText: 'too short',
        value: 'abc'
      },
      description: {
        status: 'ok',
        errorText: '',
        value: '12345678901'
      }
    };
    schema = {
      title: {
        minLength: 5,
        maxLength: 10
      },
      description: {
        minLength: 10,
        maxLength: 20
      }
    };
  });

  test('should reset the state', () => {
    const result = lib.resetForm(schema, state);
    expect(result).toEqual({
      isFormOK: false,
      title: {
        status: 'normal',
        errorText: '',
        value: ''
      },
      description: {
        status: 'normal',
        errorText: '',
        value: ''
      }
    });
  });

  test('should ignore collectValues', () => {
    schema.collectValues = {
      abc: 'abc',
      def: 'def'
    };
    const result = lib.resetForm(schema, state);
    expect(result).toEqual({
      isFormOK: false,
      title: {
        status: 'normal',
        errorText: '',
        value: ''
      },
      description: {
        status: 'normal',
        errorText: '',
        value: ''
      }
    });
  });

  test('should honour the default', () => {
    schema.title.default = 'albert';
    const result = lib.resetForm(schema, state);
    expect(result).toEqual({
      isFormOK: false,
      title: {
        status: 'ok',
        errorText: '',
        value: 'albert'
      },
      description: {
        status: 'normal',
        errorText: '',
        value: ''
      }
    });
  });

  test('should honour user state', () => {
    schema.title.default = 'albert';
    const tempFunc = () => {};
    state.title.super = {
      a: 'a',
      b: 1,
      c: {
        d: 'd',
        e: 2
      }
    };
    state.super = {
      name: {
        first: 'albert',
        last: 'gao'
      },
      age: 16,
      call: tempFunc
    };
    const result = lib.resetForm(schema, state);
    expect(result).toEqual({
      isFormOK: false,
      title: {
        status: 'ok',
        errorText: '',
        value: 'albert',
        super: {
          a: 'a',
          b: 1,
          c: {
            d: 'd',
            e: 2
          }
        }
      },
      description: {
        status: 'normal',
        errorText: '',
        value: ''
      },
      super: {
        name: {
          first: 'albert',
          last: 'gao'
        },
        age: 16,
        call: tempFunc
      }
    });
  });
});

describe('Test the validate method', () => {
  test('should invoke persist() on e', () => {
    const mockPersist = jest.fn();
    const mockSchema = 'schema';
    const mockUpdate = 'update';
    const mockState = 'state';
    const e = { target: { name: 'a' }, persist: mockPersist };
    lib.validate(e, mockSchema, mockState, mockUpdate);
    expect(mockPersist.mock.calls.length).toBe(1);
    mockPersist.mockReset();
  });

  test('should return undefined when targetName and target.name is null', async () => {
    const mockPersist = jest.fn();
    const mockSchema = 'schema';
    const mockUpdate = 'update';
    const mockState = 'state';
    const e = { target: 'a', persist: mockPersist };
    const result = await lib.validate(e, mockSchema, mockState, mockUpdate);
    expect(result).toBe(undefined);
    expect(mockPersist.mock.calls.length).toBe(1);
    mockPersist.mockReset();
  });
});
