/* eslint-disable no-new */
import * as lib from "../src/helpers";
import EasyVClass from '../src/EasyVClass';

const EasyV = EasyVClass;
const { getConstructorErrorMessage } = lib;

describe('test the constructor - Property component', () => {
  const schema = { dummy: { min: 0 } };

  test('should throw when give none parameters', () => {
    expect(() => {
      new EasyV();
    }).toThrow(getConstructorErrorMessage('Parameter component', undefined));
  });

  test('Should throw when give a number', () => {
    expect(() => {
      new EasyV(1, schema);
    }).toThrow(getConstructorErrorMessage('Parameter component', 1));
  });

  test('Should throw when give a string', () => {
    expect(() => {
      new EasyV('a', schema);
    }).toThrow(getConstructorErrorMessage('Parameter component', 'a'));
  });

  test('Should throw when give an empty object', () => {
    expect(() => {
      new EasyV({}, schema);
    }).toThrow(
      getConstructorErrorMessage('Parameter component', '[object Object]')
    );
  });

  test('Should not throw when give an object with none value property', () => {
    expect(() => {
      new EasyV({ name: null }, schema);
    }).not.toThrow();
  });

  test('Should throw when has an empty object as an property', () => {
    expect(() => {
      new EasyV({ name: {} }, schema);
    }).not.toThrow();
  });
});

describe('test the constructor - Property schema', () => {
  const component = { dummy: true };

  test('should throw when give none parameters', () => {
    expect(() => {
      new EasyV(component);
    }).toThrow(getConstructorErrorMessage('Parameter schema', undefined));
  });

  test('Should throw when give a number', () => {
    expect(() => {
      new EasyV(component, 1);
    }).toThrow(getConstructorErrorMessage('Parameter schema', 1));
  });

  test('Should throw when give a string', () => {
    expect(() => {
      new EasyV(component, 'a');
    }).toThrow(getConstructorErrorMessage('Parameter schema', 'a'));
  });

  test('Should throw when give an empty object', () => {
    expect(() => {
      new EasyV(component, {});
    }).toThrow(
      getConstructorErrorMessage('Parameter schema', '[object Object]')
    );
  });

  test('Should throw when give an object with none value property', () => {
    expect(() => {
      new EasyV(component, { name: { first: 'albert' }, age: null });
    }).toThrow(
      '[EasyV - schema.age] Expect: non empty object. Actual: null'
    );
  });

  test('Should throw when give an empty object as an property', () => {
    expect(() => {
      new EasyV(component, { name: {}, age: 26 });
    }).toThrow(
      '[EasyV - schema.name] ' +
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
    const mockSchema = { name: { isIP:false } };
    const mockTarget = { abc: 123 };

    const easyV = new EasyV(mockComponent, mockSchema);
    easyV.validate(mockTarget);
    expect(mockUpdate.mock.calls.length).toEqual(1);
    expect(mockUpdate.mock.calls[0][0]).toEqual(mockTarget);
    expect(mockUpdate.mock.calls[0][1]).toEqual(mockSchema);
    expect(mockUpdate.mock.calls[0][2]).toEqual(mockComponent.state);
    expect(mockUpdate.mock.calls[0][3].name).toEqual('bound setState');
    mockUpdate.mockReset();
  });
});
