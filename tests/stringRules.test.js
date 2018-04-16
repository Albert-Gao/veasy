/* eslint-disable no-new */
import { startValidating } from '../src/helpers/helpers';

describe('Test the validate method - String', () => {
  let mockSchema;
  const mockUpdate = jest.fn();
  let mockTarget;

  beforeEach(() => {
    mockSchema = {
      title: {
        default: ''
      }
    };
    mockTarget = {
      name: 'title',
      value: '6'
    };
  });

  afterEach(() => {
    mockUpdate.mockReset();
  });

  test('minLength should work - error case', async () => {
    mockSchema.title.minLength = 1;
    mockTarget.value = '';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      title: {
        status: 'error',
        errorText: "title's length should be equal or greater than 1. Current: 0",
        value: ''
      }
    });
  });

  test('minLength should work - ok case', async () => {
    mockSchema.title.minLength = 1;
    mockTarget.value = 'a';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      title: {
        status: 'ok',
        errorText: '',
        value: 'a'
      }
    });
  });

  test('minLength and maxLength should work - ok case', async () => {
    mockSchema.title.minLength = 1;
    mockSchema.title.maxLength = 6;
    mockTarget.value = 'js';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      title: {
        status: 'ok',
        errorText: '',
        value: mockTarget.value
      }
    });
  });

  test('maxLength should work - error case', async () => {
    mockSchema.title.maxLength = 10;
    mockTarget.value = '123456789011';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      title: {
        status: 'error',
        errorText: `title's length should be equal or less than 10. Current: ${mockTarget
          .value.length}`,
        value: mockTarget.value
      }
    });
  });

  test('maxLength should work - ok case', async () => {
    mockSchema.title.maxLength = 10;
    mockTarget.value = '12345671';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      title: {
        status: 'ok',
        errorText: '',
        value: mockTarget.value
      }
    });
  });

  test('maxLength should work - ok case - equal', async () => {
    mockSchema.title.maxLength = 8;
    mockTarget.value = '12345678';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      title: {
        status: 'ok',
        errorText: '',
        value: mockTarget.value
      }
    });
  });

  test('include should work - ok case', async () => {
    mockSchema.title.include = 'love';
    mockTarget.value = 'i love u!';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      title: {
        status: 'ok',
        errorText: '',
        value: mockTarget.value
      }
    });
  });

  test('include should work - error case', async () => {
    mockSchema.title.include = 'big';
    mockTarget.value = 'i love u!';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      title: {
        status: 'error',
        errorText: 'title should include big. Current: i love u!',
        value: mockTarget.value
      }
    });
  });

  test('exclude should work - error case', async () => {
    mockSchema.title.exclude = 'love';
    mockTarget.value = 'i love u!';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      title: {
        status: 'error',
        errorText: 'title should not include love. Current: i love u!',
        value: mockTarget.value
      }
    });
  });

  test('exclude should work - ok case', async () => {
    mockSchema.title.exclude = 'big';
    mockTarget.value = 'i love u!';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      title: {
        status: 'ok',
        errorText: '',
        value: mockTarget.value
      }
    });
  });

  test('startWith should work - error case', async () => {
    mockSchema.title.startWith = 'big';
    mockTarget.value = 'i love u!';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      title: {
        status: 'error',
        errorText: "title should start with 'big'.",
        value: mockTarget.value
      }
    });
  });

  test('startWith should work - ok case', async () => {
    mockSchema.title.startWith = 'big';
    mockTarget.value = 'big fish';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      title: {
        status: 'ok',
        errorText: '',
        value: mockTarget.value
      }
    });
  });

  test('notStartWith should work - error case', async () => {
    mockSchema.title.notStartWith = 'big';
    mockTarget.value = 'big fish';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      title: {
        status: 'error',
        errorText: "title should not start with 'big'.",
        value: mockTarget.value
      }
    });
  });

  test('notStartWith should work - ok case', async () => {
    mockSchema.title.notStartWith = 'abc1';
    mockTarget.value = 'big fish';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      title: {
        status: 'ok',
        errorText: '',
        value: mockTarget.value
      }
    });
  });

  test('endWith should work - error case', async () => {
    mockSchema.title.endWith = 'big';
    mockTarget.value = 'i love u!';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      title: {
        status: 'error',
        errorText: "title should end with 'big'.",
        value: mockTarget.value
      }
    });
  });

  test('endWith should work - ok case', async () => {
    mockSchema.title.endWith = 'big';
    mockTarget.value = 'big big';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      title: {
        status: 'ok',
        errorText: '',
        value: mockTarget.value
      }
    });
  });

  test('notEndWith should work - error case', async () => {
    mockSchema.title.notEndWith = 'fish';
    mockTarget.value = 'big fish';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      title: {
        status: 'error',
        errorText: "title should not end with 'fish'.",
        value: mockTarget.value
      }
    });
  });

  test('notEndWith should work - ok case', async () => {
    mockSchema.title.notEndWith = 'abc2';
    mockTarget.value = 'big fish';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      title: {
        status: 'ok',
        errorText: '',
        value: mockTarget.value
      }
    });
  });
});
