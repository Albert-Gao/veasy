/* eslint-disable no-new */
import {getConstructorErrorMessage} from '../src/helpers';
import EasyV from '../src/EasyVLib';

describe('test the constructor - Property component', () => {
  const schema = { dummy: { min: 0 } };

  test('should throw when give none parameters', () => {
    expect(() => {
      new EasyV();
    }).toThrow(
      getConstructorErrorMessage('Parameter component', undefined)
    );
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

  test('Should throw when give an object which has an empty object as an property', () => {
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
      '[Form Validation - schema.age] Expect: non empty object. Actual: null'
    );
  });

  test('Should throw when give an object which has an empty object as an property', () => {
    expect(() => {
      new EasyV(component, { name: {}, age: 26 });
    }).toThrow(
      '[Form Validation - schema.name] Expect: non empty object. Actual: [object Object]'
    );
  });
});
