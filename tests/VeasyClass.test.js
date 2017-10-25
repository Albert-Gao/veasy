/* eslint-disable no-new */
import * as lib from '../src/helpers';
import VeasyClass from '../src/VeasyClass';

const { getConstructorErrorMessage } = lib;

describe('test the constructor - Property component', () => {
  const schema = { dummy: { min: 0 } };

  test('should throw when give none parameters', () => {
    expect(() => {
      new VeasyClass();
    }).toThrow(getConstructorErrorMessage('Parameter component', undefined));
  });

  test('Should throw when give a number', () => {
    expect(() => {
      new VeasyClass(1, schema);
    }).toThrow(getConstructorErrorMessage('Parameter component', 1));
  });

  test('Should throw when give a string', () => {
    expect(() => {
      new VeasyClass('a', schema);
    }).toThrow(getConstructorErrorMessage('Parameter component', 'a'));
  });

  test('Should throw when give an empty object', () => {
    expect(() => {
      new VeasyClass({}, schema);
    }).toThrow(
      getConstructorErrorMessage('Parameter component', '[object Object]')
    );
  });

  test('Should not throw when give an object with none value property', () => {
    expect(() => {
      new VeasyClass({ name: null }, schema);
    }).not.toThrow();
  });

  test('Should throw when has an empty object as an property', () => {
    expect(() => {
      new VeasyClass({ name: {} }, schema);
    }).not.toThrow();
  });
});

describe('test the constructor - Property schema', () => {
  const component = { dummy: true };

  test('should throw when give none parameters', () => {
    expect(() => {
      new VeasyClass(component);
    }).toThrow(getConstructorErrorMessage('Parameter schema', undefined));
  });

  test('Should throw when give a number', () => {
    expect(() => {
      new VeasyClass(component, 1);
    }).toThrow(getConstructorErrorMessage('Parameter schema', 1));
  });

  test('Should throw when give a string', () => {
    expect(() => {
      new VeasyClass(component, 'a');
    }).toThrow(getConstructorErrorMessage('Parameter schema', 'a'));
  });

  test('Should throw when give an empty object', () => {
    expect(() => {
      new VeasyClass(component, {});
    }).toThrow(
      getConstructorErrorMessage('Parameter schema', '[object Object]')
    );
  });

  test('Should throw when give an object with none value property', () => {
    expect(() => {
      new VeasyClass(component, { name: { first: 'albert' }, age: null });
    }).toThrow('[Veasy - schema.age] Expect: non empty object. Actual: null');
  });

  test('Should throw when give an empty object as an property', () => {
    expect(() => {
      new VeasyClass(component, { name: {}, age: 26 });
    }).toThrow(
      '[Veasy - schema.name] ' +
        'Expect: non empty object. Actual: [object Object]'
    );
  });

  test('Should invoke startValidating with correct signature', () => {
    const mockUpdate = jest.fn();
    lib.startValidating = mockUpdate;
    const mockComponent = {
      state: { name: 'albert' },
      setState: () => {}
    };
    const mockSchema = { name: { isIP: false } };
    const mockTarget = { abc: 123 };

    const veasy = new VeasyClass(mockComponent, mockSchema);
    veasy.validate(mockTarget);
    expect(mockUpdate.mock.calls.length).toEqual(1);
    expect(mockUpdate.mock.calls[0][0]).toEqual(mockTarget);
    expect(mockUpdate.mock.calls[0][1]).toEqual(mockSchema);
    expect(mockUpdate.mock.calls[0][2]).toEqual(mockComponent.state);
    expect(mockUpdate.mock.calls[0][3].name).toEqual('bound setState');
    mockUpdate.mockReset();
  });
});

describe('Test the class methods', () => {
  test('should invoke getFieldsValue', () => {
    const mockUpdate = jest.fn();
    lib.getFieldsValue = mockUpdate;
    const mockComponent = {
      state: { name: 'albert' },
      setState: () => {}
    };
    const mockSchema = { name: { isIP: false } };

    const veasy = new VeasyClass(mockComponent, mockSchema);
    veasy.getFieldsValue();
    expect(mockUpdate.mock.calls.length).toEqual(1);
    expect(mockUpdate.mock.calls[0][0]).toEqual(mockSchema);
    expect(mockUpdate.mock.calls[0][1]).toEqual(mockComponent.state);
    expect(mockUpdate.mock.calls[0][2]).toEqual(true);    
    mockUpdate.mockReset();
  });
});
