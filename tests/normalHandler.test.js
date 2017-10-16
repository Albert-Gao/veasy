/* eslint-disable no-new */
import { startValidating } from '../src/helpers';

describe('Test the validate method - Normal', () => {
  let mockSchema;
  const mockSetState = jest.fn();
  let mockComponent;
  let mockTarget;

  beforeEach(() => {
    mockSchema = {
      title: {
        string: {
          default: ''
        },
        enum: ['tom', 'jerry']
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

  test('enum should work - error case', async () => {
    mockTarget.value = 'not';
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
          title: {
            status: 'error',
            errorText: 'Value of title should be within [tom,jerry].',
            value: mockTarget.value
          }
        }
      }
    });
  });

  test('enum should work - ok case', async () => {
    mockTarget.value = 'tom';
    await startValidating(
        mockTarget,
        mockSchema,
        mockComponent.state.formStatus,
        mockComponent.setState
      );
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

  test('matchRegex should work - error case', async () => {
    mockSchema.title.matchRegex = /^([a-z0-9]{5,})$/;
    mockTarget.value = 'tom';
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
    delete mockSchema.title.enum;
    mockSchema.title.matchRegex = /^([a-z0-9]{5,})$/;
    mockTarget.value = '9tom';
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
    mockSchema.title.matchRegex = /^([a-z]{5,})$/;
    mockTarget.value = 'jerry';
    await startValidating(
        mockTarget,
        mockSchema,
        mockComponent.state.formStatus,
        mockComponent.setState
      );
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
});
