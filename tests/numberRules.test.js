/* eslint-disable no-new */
import { startValidating } from '../src/helpers';

describe('Test the validate method - Number', () => {
  let mockSchema;
  const mockUpdate = jest.fn();
  let mockComponent;
  let mockTarget;

  beforeEach(() => {
    mockSchema = {
      age: {
        default: ''
      }
    };
    mockTarget = {
      name: 'age',
      value: '0'
    };
    mockComponent = {
      state: {
        isFormOK: false,
        age: {
          status: 'normal',
          errorText: '',
          value: ''
        }
      },
      setState: mockUpdate
    };
  });

  afterEach(() => {
    mockUpdate.mockReset();
  });

  test('min should work - [int]error case', async () => {
    mockSchema.age.min = 1;
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      age: {
        status: 'error',
        errorText: 'age should be greater than 1. Current: 0',
        value: '0'
      }
    });
  });

  test('min should work - [int]ok case', async () => {
    mockSchema.age.min = 1;
    mockTarget.value = '2';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      age: {
        status: 'ok',
        errorText: '',
        value: '2'
      }
    });
  });

  test('min should work - [float]error case', async () => {
    mockSchema.age.min = 1;
    mockTarget.value = '0.5';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      age: {
        status: 'error',
        errorText: 'age should be greater than 1. Current: 0.5',
        value: '0.5'
      }
    });
  });

  test('min should work - [float]ok case', async () => {
    mockSchema.age.min = 1;
    mockTarget.value = '1.78';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      age: {
        status: 'ok',
        errorText: '',
        value: '1.78'
      }
    });
  });

  test('min should work - [negative]error case', async () => {
    mockSchema.age.min = '1';
    mockTarget.value = '-15';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      age: {
        status: 'error',
        errorText: 'age should be greater than 1. Current: -15',
        value: '-15'
      }
    });
  });

  test('min should work - [negative]ok case', async () => {
    mockSchema.age.min = '1';
    mockTarget.value = '-9';
    mockSchema.age.min = '-10';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      age: {
        status: 'ok',
        errorText: '',
        value: '-9'
      }
    });
  });

  test('max should work - [int]error case', async () => {
    mockSchema.age.max = 5;
    mockTarget.value = '7';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      age: {
        status: 'error',
        errorText: 'age should be less than 5. Current: 7',
        value: '7'
      }
    });
  });

  test('max should work - [int]ok case', async () => {
    mockSchema.age.max = 5;
    mockTarget.value = '4';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      age: {
        status: 'ok',
        errorText: '',
        value: '4'
      }
    });
  });

  test('max should work - [float]error case', async () => {
    mockSchema.age.max = 5;
    mockTarget.value = '9.91';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      age: {
        status: 'error',
        errorText: 'age should be less than 5. Current: 9.91',
        value: '9.91'
      }
    });
  });

  test('max should work - [float]ok case', async () => {
    mockSchema.age.max = 5;
    mockTarget.value = '4.91';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      age: {
        status: 'ok',
        errorText: '',
        value: '4.91'
      }
    });
  });

  test('max should work - [negative]error case', async () => {
    mockSchema.age.max = 5;
    mockTarget.value = '-7';
    mockSchema.age.max = '-10';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      age: {
        status: 'error',
        errorText: 'age should be less than -10. Current: -7',
        value: '-7'
      }
    });
  });

  test('max should work - [negative]ok case', async () => {
    mockSchema.age.max = 5;
    mockTarget.value = '-15';
    mockSchema.age.max = '-10';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      age: {
        status: 'ok',
        errorText: '',
        value: '-15'
      }
    });
  });

  test('equal should work - error case', async () => {
    mockSchema.age.equal = 5;
    mockTarget.value = '-15';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      age: {
        status: 'error',
        errorText: 'age should equal to 5.',
        value: '-15'
      }
    });
  });

  test('equal should work - ok case', async () => {
    mockSchema.age.equal = '-15';
    mockTarget.value = '-15';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      age: {
        status: 'ok',
        errorText: '',
        value: '-15'
      }
    });
  });

  test('notEqual should work - error case', async () => {
    mockSchema.age.notEqual = 5.2;
    mockTarget.value = '5.2';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      age: {
        status: 'error',
        errorText: 'age should not equal to 5.2.',
        value: '5.2'
      }
    });
  });

  test('notEqual should work - ok case', async () => {
    mockSchema.age.notEqual = '-12';
    mockTarget.value = '-15';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      age: {
        status: 'ok',
        errorText: '',
        value: '-15'
      }
    });
  });

  test('isPositive should work - error case', async () => {
    mockSchema.age.isPositive = true;
    mockTarget.value = '-5.2';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      age: {
        status: 'error',
        errorText: 'age should be positive.',
        value: '-5.2'
      }
    });
  });

  test('isPositive should work - false case', async () => {
    mockSchema.age.isPositive = false;
    mockTarget.value = '-5.2';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      age: {
        status: 'ok',
        errorText: '',
        value: '-5.2'
      }
    });
  });

  test('isPositive should work - ok case', async () => {
    mockSchema.age.isPositive = true;
    mockTarget.value = '15';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      age: {
        status: 'ok',
        errorText: '',
        value: '15'
      }
    });
  });

  test('isNegative should work - error case', async () => {
    mockSchema.age.isNegative = true;
    mockTarget.value = '5.2';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      age: {
        status: 'error',
        errorText: 'age should be negative.',
        value: '5.2'
      }
    });
  });

  test('isNegative should work - false case', async () => {
    mockSchema.age.isNegative = false;
    mockTarget.value = '5.2';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      age: {
        status: 'ok',
        errorText: '',
        value: '5.2'
      }
    });
  });

  test('isNegative should work - ok case', async () => {
    mockSchema.age.isNegative = true;
    mockTarget.value = '-15';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      age: {
        status: 'ok',
        errorText: '',
        value: '-15'
      }
    });
  });

  test('isInt should work - error case', async () => {
    mockSchema.age.isInt = true;
    mockTarget.value = '5.2';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      age: {
        status: 'error',
        errorText: 'age should be integer.',
        value: '5.2'
      }
    });
  });

  test('isInt should work - false case', async () => {
    mockSchema.age.isInt = false;
    mockTarget.value = '5.2';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      age: {
        status: 'ok',
        errorText: '',
        value: '5.2'
      }
    });
  });

  test('isInt should work - ok case', async () => {
    mockSchema.age.isInt = true;
    mockTarget.value = '-15';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      age: {
        status: 'ok',
        errorText: '',
        value: '-15'
      }
    });
  });

  test('isDecimal should work - error case', async () => {
    mockSchema.age.isDecimal = true;
    mockTarget.value = '5';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      age: {
        status: 'error',
        errorText: 'age should be decimal.',
        value: '5'
      }
    });
  });

  test('isDecimal should work - false case', async () => {
    mockSchema.age.isDecimal = false;
    mockTarget.value = '5';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      age: {
        status: 'ok',
        errorText: '',
        value: '5'
      }
    });
  });

  test('isDecimal should work - ok case', async () => {
    mockSchema.age.isDecimal = true;
    mockTarget.value = '5.1';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      age: {
        status: 'ok',
        errorText: '',
        value: '5.1'
      }
    });
  });

  test('isDecimal should work - error case - negative', async () => {
    mockSchema.age.isDecimal = true;
    mockTarget.value = '-5';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      age: {
        status: 'error',
        errorText: 'age should be decimal.',
        value: '-5'
      }
    });
  });

  test('isIntOrDecimal should work - error case - letter', async () => {
    mockSchema.age.isIntOrDecimal = true;
    mockTarget.value = 'a';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      age: {
        status: 'error',
        errorText: 'age should be either integer or decimal.',
        value: 'a'
      }
    });
  });

  test('isIntOrDecimal should work - ok case - int', async () => {
    mockSchema.age.isIntOrDecimal = true;
    mockTarget.value = '5';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      age: {
        status: 'ok',
        errorText: '',
        value: '5'
      }
    });
  });

  test('isIntOrDecimal should work - ok case - decimal', async () => {
    mockSchema.age.isIntOrDecimal = true;
    mockTarget.value = '5.1';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      age: {
        status: 'ok',
        errorText: '',
        value: '5.1'
      }
    });
  });

  test('isIntOrDecimal should not work - set to false', async () => {
    mockSchema.age.isIntOrDecimal = false;
    mockTarget.value = 'a';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      age: {
        status: 'ok',
        errorText: '',
        value: 'a'
      }
    });
  });
});
