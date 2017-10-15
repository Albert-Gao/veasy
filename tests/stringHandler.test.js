/* eslint-disable no-new */
import EasyV from '../src/index';

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
    const fv = new EasyV(mockComponent, mockSchema);
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
    const fv = new EasyV(mockComponent, mockSchema);
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
    const fv = new EasyV(mockComponent, mockSchema);
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
