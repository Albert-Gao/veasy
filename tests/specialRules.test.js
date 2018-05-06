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
          errorText: 'title\'s length should be equal or less than 3. Current: 4',
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
        errorText: 'author should start with \'al\'.',
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

  test('should work - ok case', async () => {
    mockSchema.description.reliesOn.title.maxLength = 4;
    mockSchema.description.reliesOn.author = {
      startWith: 'a'
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
        errorText: '',
        status: 'ok',
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

  test('should work even with a wrong `reliesOn` rule - ok case', async () => {
    mockSchema.description.reliesOn.title.maxLength = 4;
    mockSchema.description.reliesOn.author = {
      startWith: 'a',
      asd: 'b'
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
        errorText: '',
        status: 'ok',
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

  test('Should work when value is available through collectValues', async () => {
    delete mockSchema.author;
    delete mockSchema.title;
    delete mockState.author;
    delete mockState.title;
    mockSchema.collectValues = {
      title: 'my.little.title'
    };
    mockState.my = {
      little: {
        title: 'abcd'
      }
    };

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
          errorText: 'title\'s length should be equal or less than 3. Current: 4',
          value: mockTarget.value
        },
        isFormOK: false,
        my: {
          little: {
            title: 'abcd'
          }
        }
      }
    );

  });

});

describe('Test the onlyWhen rule', () => {
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
        onlyWhen: { title: { maxLength: 3 } }
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

  test('When return false, this field should be ignored even field passes check', async () => {
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
          status: 'normal',
          errorText: '',
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

  test('When return false, this field should be ignored even field not passes check', async () => {
    delete mockSchema.author;
    delete mockState.author;
    mockTarget.value = '12345';

    await startValidating(
      mockTarget,
      mockSchema,
      mockUpdate,
      mockState
    );
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
        description: {
          status: 'normal',
          errorText: '',
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

  test('When return true, this field will be validated - ok case', async () => {
    delete mockSchema.author;
    delete mockState.author;
    mockSchema.description.onlyWhen.title.maxLength = 4;

    await startValidating(
      mockTarget,
      mockSchema,
      mockUpdate,
      mockState
    );
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
        description: {
          status: 'ok',
          errorText: '',
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

  test('onlyWhen - When return true, this field will be validated - error case', async () => {
    delete mockSchema.author;
    delete mockState.author;
    mockSchema.description.onlyWhen.title.maxLength = 4;
    mockTarget.value = '123';

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
          errorText: 'description\'s length should be equal or greater than 6. Current: 3',
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

});
