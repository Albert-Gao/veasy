/* eslint-disable no-new */
import {startValidating} from '../src/helpers/helpers';

describe('Test the before feature', () => {
  let mockSchema;
  const mockUpdate = jest.fn();
  let mockTarget;

  beforeEach(() => {
    mockSchema = {
      title: {
        default: '1',
        beforeValidation: undefined,
      }
    };
    mockTarget = {
      name: 'title',
      value: '1'
    };
  });

  afterEach(() => {
    mockUpdate.mockReset();
  });

  test('Should execute the function in beforeValidation rule', async () => {
    mockSchema.title.beforeValidation = value => `${value}023`;
    expect(mockTarget.value).toBe('1');
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      title: {
        status: 'ok',
        errorText: '',
        value: '1023'
      }
    });
  });

  test('Should ignore before rule if not a function', async () => {
    mockSchema.title.before = 1;
    expect(mockTarget.value).toBe('1');
    await startValidating(mockTarget, mockSchema, mockUpdate);
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      title: {
        status: 'ok',
        errorText: '',
        value: '1'
      }
    });
  });
});

describe('Test the reliesOn rule', () => {
  let mockSchema;
  const mockUpdate = jest.fn();
  let mockTarget;
  let mockState;

  beforeEach(() => {
    mockSchema = {
      title: {
        minLength: 2
      },
      author: {
        startWith: 'a'
      },
      description: {
        minLength: 6,
        reliesOn: {
          title: {
            maxLength: 3
          }
        }
      }
    };
    mockTarget = {
      name: 'description',
      value: 'this-is-description'
    };
    mockState = {
      isFormOK: false,
      title: {
        status: 'normal',
        errorText: '',
        value: '1234'
      },
      author: {
        status: 'normal',
        errorText: '',
        value: 'abc'
      },
      description: {
        status: 'normal',
        errorText: '',
        value: '123456'
      }
    };
  });

  afterEach(() => {
    mockUpdate.mockReset();
  });

  test('reliesOn should work - error case', async () => {
    delete mockSchema.author;
    delete mockState.author;

    await startValidating(
      mockTarget,
      mockSchema,
      mockUpdate,
      mockState
    );
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
        description: {
          status: 'error',
          errorText: 'title should be less than 3. Current: 4.',
          value: mockTarget.value
        },
        isFormOK: false,
        title: {
          errorText: "",
          status: "normal",
          value: "1234"
        }
      }
    );
  });

  test('should report 2nd rule has error - error case ', async () => {
    delete mockSchema.author;
    delete mockState.author;
    mockSchema.description.reliesOn.title.maxLength = 4;
    mockSchema.description.reliesOn.title.startWith = '0';

    await startValidating(
      mockTarget,
      mockSchema,
      mockUpdate,
      mockState
    );
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      description: {
        status: 'error',
        errorText: 'title should start with \'0\'.',
        value: mockTarget.value
      },
      isFormOK: false,
      title: {
        errorText: "",
        status: "normal",
        value: "1234"
      }
    });
  });

  test('Should support reliesOn more than one field', async () => {
    mockSchema.description.reliesOn.title.maxLength = 4;
    mockSchema.description.reliesOn.author = {
      startWith: 'al'
    };
    await startValidating(
      mockTarget,
      mockSchema,
      mockUpdate,
      mockState
    );
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      author: {
        errorText: "",
        status: "normal",
        value: "abc"
      },
      description: {
        errorText: 'author should start with \'ab\'.',
        status: 'error',
        value: mockTarget.value
      },
      isFormOK: false,
      title: {
        errorText: "",
        status: "normal",
        value: "1234"
      }
    });
  });

  test('should support the `test` sub-rule which runs regex against another field', () => {
  });
});

describe('Test the Normal rules', () => {
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

  test('inArray should work - error case', async () => {
    mockSchema.title.inArray = ['tom', 'jerry'];
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

  test('Should throw user errMsg, inArray - error case', async () => {
    mockSchema.title.inArray = [
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

  test('inArray should work - ok case', async () => {
    mockSchema.title.inArray = ['tom', 'jerry'];
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

  test('isUrl should honour false', async () => {
    mockSchema.title.isUrl = false;
    mockTarget.value = '123';
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

  test('isCreditCard should honour false', async () => {
    mockSchema.title.isCreditCard = false;
    mockTarget.value = 'abc';
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

  test('isHexColor should honour false', async () => {
    mockSchema.title.isHexColor = false;
    mockTarget.value = '321';
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
