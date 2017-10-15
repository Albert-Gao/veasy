/* eslint-disable no-new */
import EasyV from '../src/index';

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

  test('min should work - error case', async () => {
    const fv = new EasyV(mockComponent, mockSchema);
    await fv.validate(mockTarget);
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

  test('max should work - error case', async () => {
    mockTarget.value = '7';
    const fv = new EasyV(mockComponent, mockSchema);
    await fv.validate(mockTarget);
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
});
