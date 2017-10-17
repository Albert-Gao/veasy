/* eslint-disable no-new */
import EasyV from '../src/EasyVClass';

describe('Test the createInitialState method', () => {
  let schema;
  const component = { dummy: true };

  beforeEach(() => {
    schema = { title: { type: String }, name: { type: String } };
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

  test('Should return an object with user`s state', () => {
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

  test('Should return an object with user`s state', () => {
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
