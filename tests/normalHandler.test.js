/* eslint-disable no-new */
import { startValidating } from '../src/helpers';

describe('Test the Normal rules', () => {
  let mockSchema;
  const mockUpdate = jest.fn();
  let mockComponent;
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
    mockComponent = {
      state: {
        isFormOK: false,
        title: {
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

  test('enum should work - error case', async () => {
    mockSchema.title.enum = ['tom', 'jerry'];
    mockTarget.value = 'not';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      title: {
        status: 'error',
        errorText: 'Value of title should be within [tom,jerry].',
        value: mockTarget.value
      }
    });
  });

  test('Should throw user errMsg, enum - error case', async () => {
    mockSchema.title.enum = [
      ['tom', 'jerry'],
      'Will be wrong if not tom or jerry'
    ];
    mockTarget.value = 'not';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      title: {
        status: 'error',
        errorText: 'Will be wrong if not tom or jerry',
        value: mockTarget.value
      }
    });
  });

  test('enum should work - ok case', async () => {
    mockSchema.title.enum = ['tom', 'jerry'];
    mockTarget.value = 'tom';
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

  test('matchRegex should work - error case', async () => {
    mockSchema.title.matchRegex = /^([a-z0-9]{5,})$/;
    mockTarget.value = 'tom';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      title: {
        status: 'error',
        errorText: 'Value of title is not valid.',
        value: mockTarget.value
      }
    });
  });

  test('Should throw user errMsg, matchRegex error case', async () => {
    mockSchema.title.matchRegex = [
      /^([a-z0-9]{5,})$/,
      'You are passing a wrong value'
    ];
    mockTarget.value = 'tom';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      title: {
        status: 'error',
        errorText: 'You are passing a wrong value',
        value: mockTarget.value
      }
    });
  });

  test('matchRegex should work - ok case', async () => {
    mockSchema.title.matchRegex = /^([a-z0-9]{5,})$/;
    mockTarget.value = 'wow18';
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

  test('isEmail should work - error case', async () => {
    mockSchema.title.isEmail = true;
    mockTarget.value = 'tom';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      title: {
        status: 'error',
        errorText: 'title should be email.',
        value: mockTarget.value
      }
    });
  });

  test('should throw user errMsg, isEmail error case', async () => {
    mockSchema.title.isEmail = [true, 'Expect an email'];
    mockTarget.value = 'tom';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      title: {
        status: 'error',
        errorText: 'Expect an email',
        value: mockTarget.value
      }
    });
  });

  test('isEmail should work - ok case', async () => {
    mockSchema.title.isEmail = true;
    mockTarget.value = 'wow18@gmail.com';
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

  test('isEmail should honour false', async () => {
    mockSchema.title.isEmail = false;
    mockTarget.value = 'wow18';
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

  test('isUrl should work - error case', async () => {
    mockSchema.title.isUrl = true;
    mockTarget.value = 'tom';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      title: {
        status: 'error',
        errorText: 'title should be a URL.',
        value: mockTarget.value
      }
    });
  });

  test('isUrl should work - ok case', async () => {
    mockSchema.title.isUrl = true;
    mockTarget.value = 'http://wow.com';
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

  test('isCreditCard should work - error case', async () => {
    mockSchema.title.isCreditCard = true;
    mockTarget.value = 'tom';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      title: {
        status: 'error',
        errorText: 'title should be a credit card number.',
        value: mockTarget.value
      }
    });
  });

  test('isCreditCard should work - ok case', async () => {
    mockSchema.title.isCreditCard = true;
    mockTarget.value = '378282246310005';
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

  test('isHexColor should work - error case', async () => {
    mockSchema.title.isHexColor = true;
    mockTarget.value = '#3333';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      title: {
        status: 'error',
        errorText: 'title should be a hex color.',
        value: mockTarget.value
      }
    });
  });

  test('isHexColor should work - ok case', async () => {
    mockSchema.title.isHexColor = true;
    mockTarget.value = '#333';
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

  test('notEmpty should work - error case', async () => {
    mockSchema.title.notEmpty = true;
    mockTarget.value = '';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      title: {
        status: 'error',
        errorText: 'title should not be empty.',
        value: mockTarget.value
      }
    });
  });

  test('notEmpty should work - ok case', async () => {
    mockSchema.title.notEmpty = true;
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

  test('isIP should work - [v4] error case', async () => {
    mockSchema.title.isIP = 'v4';
    mockTarget.value = '1.2..5';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      title: {
        status: 'error',
        errorText: 'title should be IPv4 address.',
        value: mockTarget.value
      }
    });
  });

  test('should throw user errMsg, isIP - [v4] error case', async () => {
    mockSchema.title.isIP = ['v4', 'I want an IP address'];
    mockTarget.value = '1.2..5';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      title: {
        status: 'error',
        errorText: 'I want an IP address',
        value: mockTarget.value
      }
    });
  });

  test('isIP should work - [v4] ok case', async () => {
    mockSchema.title.isIP = 'v4';
    mockTarget.value = '198.156.23.5';
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

  test('isIP should work - [v6] error case', async () => {
    mockSchema.title.isIP = 'v6';
    mockTarget.value = '1.2..5';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      title: {
        status: 'error',
        errorText: 'title should be IPv6 address.',
        value: mockTarget.value
      }
    });
  });

  test('isIP should work - [v6] ok case', async () => {
    mockSchema.title.isIP = 'v6';
    mockTarget.value = '2001:DB8:0:0:1::1';
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

  test('isIP should work - [all] error case', async () => {
    mockSchema.title.isIP = 'all';
    mockTarget.value = '1.2..5';
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      title: {
        status: 'error',
        errorText: 'title should be IP address.',
        value: mockTarget.value
      }
    });
  });

  test('isIP should work - [all] ok case', async () => {
    mockSchema.title.isIP = 'all';
    mockTarget.value = '2001:DB8:0:0:1::1';
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

  test('isIP should work - [empty] ok case', async () => {
    mockSchema.title.isIP = '';
    mockTarget.value = '2001:DB8:0:0:1::1';
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
