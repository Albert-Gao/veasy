/* eslint-disable no-new */
import { startValidating } from '../src/helpers';

describe('Test the validate method - Number', () => {
  let mockSchema;
  const mockSetState = jest.fn();
  let mockComponent;
  let mockTarget;

  beforeEach(() => {
    mockSchema = {
      age: {
        number: {
          min: 1,
          max: 5,
          default: ''
        }
      }
    };
    mockTarget = {
      name: 'age',
      value: '0'
    };
    mockComponent = {
      state: {
        formStatus: {
          isFormOK: false,
          fields: {
            age: {
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

  test('min should work - [int]error case', async () => {
    await startValidating(
        mockTarget,
        mockSchema,
        mockComponent.state.formStatus,
        mockComponent.setState
      );
    expect(mockSetState.mock.calls.length).toBe(1);
    expect(mockSetState).toBeCalledWith({
      formStatus: {
        isFormOK: false,
        fields: {
          age: {
            status: 'error',
            errorText: 'age should be greater than 1. Current: 0',
            value: '0'
          }
        }
      }
    });
  });

  test('min should work - [float]error case', async () => {
    mockTarget.value = '0.5';
    await startValidating(
        mockTarget,
        mockSchema,
        mockComponent.state.formStatus,
        mockComponent.setState
      );
    expect(mockSetState.mock.calls.length).toBe(1);
    expect(mockSetState).toBeCalledWith({
      formStatus: {
        isFormOK: false,
        fields: {
          age: {
            status: 'error',
            errorText: 'age should be greater than 1. Current: 0.5',
            value: '0.5'
          }
        }
      }
    });
  });

  test('min should work - [negative]error case', async () => {
    mockTarget.value = '-15';
    await startValidating(
        mockTarget,
        mockSchema,
        mockComponent.state.formStatus,
        mockComponent.setState
      );
    expect(mockSetState.mock.calls.length).toBe(1);
    expect(mockSetState).toBeCalledWith({
      formStatus: {
        isFormOK: false,
        fields: {
          age: {
            status: 'error',
            errorText: 'age should be greater than 1. Current: -15',
            value: '-15'
          }
        }
      }
    });
  });

  test('max should work - [int]error case', async () => {
    mockTarget.value = '7';
    await startValidating(
        mockTarget,
        mockSchema,
        mockComponent.state.formStatus,
        mockComponent.setState
      );
    expect(mockSetState.mock.calls.length).toBe(1);
    expect(mockSetState).toBeCalledWith({
      formStatus: {
        isFormOK: false,
        fields: {
          age: {
            status: 'error',
            errorText: 'age should be less than 5. Current: 7',
            value: '7'
          }
        }
      }
    });
  });

  test('max should work - [float]error case', async () => {
    mockTarget.value = '9.91';
    await startValidating(
        mockTarget,
        mockSchema,
        mockComponent.state.formStatus,
        mockComponent.setState
      );
    expect(mockSetState.mock.calls.length).toBe(1);
    expect(mockSetState).toBeCalledWith({
      formStatus: {
        isFormOK: false,
        fields: {
          age: {
            status: 'error',
            errorText: 'age should be less than 5. Current: 9.91',
            value: '9.91'
          }
        }
      }
    });
  });

  test('max should work - [negative]error case', async () => {
    mockTarget.value = '-7';
    delete mockSchema.age.number.min;
    mockSchema.age.number.max = '-10';
    await startValidating(
        mockTarget,
        mockSchema,
        mockComponent.state.formStatus,
        mockComponent.setState
      );
    expect(mockSetState.mock.calls.length).toBe(1);
    expect(mockSetState).toBeCalledWith({
      formStatus: {
        isFormOK: false,
        fields: {
          age: {
            status: 'error',
            errorText: 'age should be less than -10. Current: -7',
            value: '-7'
          }
        }
      }
    });
  });  
});
