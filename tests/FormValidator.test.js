import {getConstructorErrorMessage} from '../src/helpers';
/* eslint-disable no-new */
import FormValidator from '../src/index';

describe('test the constructor - Property component', () => {
  const schema = { dummy: { min: 0 } };

  test('should throw when give none parameters', () => {
    expect(() => {
      new FormValidator();
    }).toThrow(getConstructorErrorMessage('Parameter component', undefined));
  });

  test('Should throw when give a number', () => {
    expect(() => {
      new FormValidator(1, schema);
    }).toThrow(getConstructorErrorMessage('Parameter component', 1));
  });

  test('Should throw when give a string', () => {
    expect(() => {
      new FormValidator('a', schema);
    }).toThrow(getConstructorErrorMessage('Parameter component', 'a'));
  });

  test('Should throw when give an empty object', () => {
    expect(() => {
      new FormValidator({}, schema);
    }).toThrow(
      getConstructorErrorMessage('Parameter component', '[object Object]')
    );
  });

  test('Should not throw when give an object with none value property', () => {
    expect(() => {
      new FormValidator({ name: null }, schema);
    }).not.toThrow();
  });

  test('Should throw when give an object which has an empty object as an property', () => {
    expect(() => {
      new FormValidator({ name: {} }, schema);
    }).not.toThrow();
  });
});

describe('test the constructor - Property schema', () => {
  const component = { dummy: true };

  test('should throw when give none parameters', () => {
    expect(() => {
      new FormValidator(component);
    }).toThrow(getConstructorErrorMessage('Parameter schema', undefined));
  });

  test('Should throw when give a number', () => {
    expect(() => {
      new FormValidator(component, 1);
    }).toThrow(getConstructorErrorMessage('Parameter schema', 1));
  });

  test('Should throw when give a string', () => {
    expect(() => {
      new FormValidator(component, 'a');
    }).toThrow(getConstructorErrorMessage('Parameter schema', 'a'));
  });

  test('Should throw when give an empty object', () => {
    expect(() => {
      new FormValidator(component, {});
    }).toThrow(
      getConstructorErrorMessage('Parameter schema', '[object Object]')
    );
  });

  test('Should throw when give an object with none value property', () => {
    expect(() => {
      new FormValidator(component, { name: { first: 'albert' }, age: null });
    }).toThrow(
      '[Form Validation - schema.age] Expect: non empty object. Actual: null'
    );
  });

  test('Should throw when give an object which has an empty object as an property', () => {
    expect(() => {
      new FormValidator(component, { name: {}, age: 26 });
    }).toThrow(
      '[Form Validation - schema.name] Expect: non empty object. Actual: [object Object]'
    );
  });
});

describe('Test the createInitialState method', () => {
  let schema;
  const component = { dummy: true };

  beforeEach(() => {
    schema = { title: { type: String }, name: { type: String } };
  });

  test('Should return an object with certain properties', () => {
    const state = new FormValidator(component, schema).createInitialState();
    expect(state).toEqual({
      formStatus: {
        isFormOK: false,
        fields: {
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
        }
      }
    });
  });

  test('Should return an object with value equal default if there is', () => {
    schema.title.default = 'I am default';
    schema.name.default = 'albert';
    const state = new FormValidator(component, schema).createInitialState();
    expect(state).toEqual({
      formStatus: {
        isFormOK: false,
        fields: {
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
        }
      }
    });
  });
});

describe('Test the validate method - String', () => {
  let mockSchema;
  const mockSetState = jest.fn();
  let mockComponent;
  let mockTarget;

  beforeEach(() => {
    mockSchema = {
      title: {
        string: {
          minLength: 1,
          maxLength: 10,
          enum: ['tom', 'jerry'],
          default: ''
        }
      }
    };
    mockTarget = {
      name: 'title',
      value: '6'
    };
    mockComponent = {
      state: {
        formStatus: {
          isFormOK: false,
          fields: {
            title: {
              status: 'normal',
              errorText: '',
              value: ''
            }
          }
        }
      },
      setState: mockSetState
    };
  });

  afterEach(() => {
    mockSetState.mockReset();
  });

  test('minLength should work - error case', async () => {
    mockTarget.value = '';
    const fv = new FormValidator(mockComponent, mockSchema);
    await fv.validate(mockTarget);
    expect(mockSetState.mock.calls.length).toBe(1);
    expect(mockSetState).toBeCalledWith({
      formStatus: {
        isFormOK: false,
        fields: {
          title: {
            status: 'error',
            errorText: 'title\'s length should be greater than 1. Current: 0',
            value: ''
          }
        }
      }
    });
  });

  test('maxLength should work - error case', async () => {
    mockTarget.value = '123456789011';
    const fv = new FormValidator(mockComponent, mockSchema);
    await fv.validate(mockTarget);
    expect(mockSetState.mock.calls.length).toBe(1);
    expect(mockSetState).toBeCalledWith({
      formStatus: {
        isFormOK: false,
        fields: {
          title: {
            status: 'error',
            errorText: `title's length should be less than 10. Current: ${mockTarget
              .value.length}`,
            value: mockTarget.value
          }
        }
      }
    });
  });

  test('enum should work - error case', async () => {
    mockTarget.value = 'not';
    const fv = new FormValidator(mockComponent, mockSchema);
    await fv.validate(mockTarget);
    expect(mockSetState.mock.calls.length).toBe(1);
    expect(mockSetState).toBeCalledWith({
      formStatus: {
        isFormOK: false,
        fields: {
          title: {
            status: 'error',
            errorText: 'Value of title should be within [tom,jerry].',
            value: mockTarget.value
          }
        }
      }
    });
  });

  test('matchRegex should work - error case', async () => {
    mockSchema.title.string.matchRegex = /^([a-z0-9]{5,})$/;
    mockTarget.value = 'tom';
    const fv = new FormValidator(mockComponent, mockSchema);
    await fv.validate(mockTarget);
    expect(mockSetState.mock.calls.length).toBe(1);
    expect(mockSetState).toBeCalledWith({
      formStatus: {
        isFormOK: false,
        fields: {
          title: {
            status: 'error',
            errorText: 'Value of title is not valid.',
            value: mockTarget.value
          }
        }
      }
    });
  });

  test('isOK should be changed from true to false when an error occurs - error case', async () => {
    mockComponent.state.formStatus.fields.title.isOK = true;
    delete mockSchema.title.string.enum;
    mockSchema.title.string.matchRegex = /^([a-z0-9]{5,})$/;
    mockTarget.value = '9tom';
    const fv = new FormValidator(mockComponent, mockSchema);
    await fv.validate(mockTarget);
    expect(mockSetState.mock.calls.length).toBe(1);
    expect(mockSetState).toBeCalledWith({
      formStatus: {
        isFormOK: false,
        fields: {
          title: {
            status: 'error',
            errorText: 'Value of title is not valid.',
            value: mockTarget.value
          }
        }
      }
    });
  });

  test('should set isOK:true when no error and value not empty - non-error case', async () => {
    mockSchema.title.string.matchRegex = /^([a-z]{5,})$/;
    mockTarget.value = 'jerry';
    const fv = new FormValidator(mockComponent, mockSchema);
    await fv.validate(mockTarget);
    expect(mockSetState.mock.calls.length).toBe(1);
    expect(mockSetState).toBeCalledWith({
      formStatus: {
        isFormOK: true,
        fields: {
          title: {
            status: 'ok',
            errorText: '',
            value: mockTarget.value
          }
        }
      }
    });
  });

  test('Should test the 2 components case - one error and one right', async () => {
    mockSchema = {
      title: {
        string: {
          minLength: 2,
          maxLength: 4,
          default: ''
        }
      },
      description: {
        string: {
          minLength: 2,
          maxLength: 4,
          default: ''
        }
      }
    };

    mockComponent.state.formStatus.fields.description = {
      status: 'error',
      errorText: 'desc error text' ,
      value: 'desc'
    };

    mockTarget.value = '';
    const fv = new FormValidator(mockComponent, mockSchema);
    await fv.validate(mockTarget);
    expect(mockSetState.mock.calls.length).toBe(1);
    expect(mockSetState).toBeCalledWith({
      formStatus: {
        isFormOK: false,
        fields: {
          title: {
            status: 'error',
            errorText: 'title\'s length should be greater than 2. Current: 0',
            value: ''
          },
          description: {
            status: 'error',
            errorText: 'desc error text' ,
            value: 'desc'
          }
        }
      }
    });

  });
});
