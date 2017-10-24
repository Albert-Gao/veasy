import * as lib from '../src/helpers';
/* eslint-disable no-new */
import EasyV from '../src/VeasyClass';

describe('Test the createInitialState method', () => {
  let schema;
  const component = { dummy: true };

  beforeEach(() => {
    schema = { title: { minLength: 1 }, name: { notEmpty: true } };
  });

  test('Should return an object with certain properties', () => {
    const state = new EasyV(component, schema).createInitialState();
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
    schema.title.default = 'I am default';
    schema.name.default = 'albert';
    const state = new EasyV(component, schema).createInitialState();
    expect(state).toEqual({
      isFormOK: false,
      name: {
        status: 'normal',
        errorText: '',
        value: 'albert'
      },
      title: {
        status: 'normal',
        errorText: '',
        value: 'I am default'
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
    const state = new EasyV(component, schema).createInitialState(userState);
    expect(state).toEqual({
      isFormOK: false,
      name: {
        status: 'normal',
        errorText: '',
        value: 'albert'
      },
      title: {
        status: 'normal',
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
    const state = new EasyV(component, schema).createInitialState(userState);
    expect(state).toEqual({
      isFormOK: false,
      name: {
        status: 'normal',
        errorText: '',
        value: 'albert',
        firstName: 'Albert',
        lastName: 'Gao'
      },
      title: {
        status: 'normal',
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
    expect(lib.createInitialValue(schema)).toBe('6');
  });

  test('Should return default when there is default', () => {
    const schema = { default: '5' };
    expect(lib.createInitialValue(schema)).toBe('5');
  });

  test('Should return empty when there is no default and min', () => {
    const schema = { notEmpty: true };
    expect(lib.createInitialValue(schema)).toBe('');
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
  let state;
  let schema;

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
    const result = lib.getFieldsValue(schema, state);
    expect(result).toEqual({
      description: '12345678901'
    });
  });

  test('should return only the values of all fields', () => {
    const result = lib.getFieldsValue(schema, state, false);
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
    const result = lib.getFieldsValue(schema, state, false);
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
    const result = lib.getFieldsValue(schema, state, false);
    expect(result).toEqual({
      title: 'abc',
      description: '12345678901',
      gender: 'male'
    });
  });

  test('Should honour collectValue section -case 2 - mustOK=true', () => {
    schema.collectValues = { gender: 'genderInfo' };
    state.genderInfo = 'male';
    const result = lib.getFieldsValue(schema, state, true);
    expect(result).toEqual({
      description: '12345678901',
      gender: 'male'
    });
  });

  test('Should honour collectValue section -case 3 - nested', () => {
    schema.collectValues = { gender: 'genderInfo.user.gender.info' };
    state.genderInfo = { user: { gender: { info: 'male' } } };
    const result = lib.getFieldsValue(schema, state, true);
    expect(result).toEqual({
      description: '12345678901',
      gender: 'male'
    });
  });
});
