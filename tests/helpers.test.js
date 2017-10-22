/* eslint-disable no-new */
import EasyV from '../src/VeasyClass';
import * as lib from '../src/helpers';

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
    const oldState = {status: 'ok', value:'1'};
    expect(lib.shouldChange(oldState, oldState)).toBe(false);
  });

  test('Should return true when change - status case', () => {
    const oldState = {status: 'ok', value:'1'};
    const newState = {status: 'error', value:'2'};
    expect(lib.shouldChange(oldState, newState)).toBe(true);
  });

  test('Should return true when change - value case', () => {
    const oldState = {status: 'ok', value:'5'};
    const newState = {status: 'ok', value:'2'};
    expect(lib.shouldChange(oldState, newState)).toBe(true);
  });
});