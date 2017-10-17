/* eslint-disable no-new */
import { startValidating } from '../src/helpers';

/**
 * There is a work flow to assemble the final result
 * Here we will focus on test this behaviour,
 * like create the final state without losing the original one
 */

describe('Test the validate method - String', () => {
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
      value: 'abc'
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

  test('Should test the 2 components case - one error and one right', async () => {
    mockSchema = {
      title: {
        minLength: 2,
        maxLength: 4,
        default: ''
      },
      description: {
        minLength: 2,
        maxLength: 4,
        default: ''
      }
    };

    mockComponent.state.description = {
      status: 'error',
      errorText: 'desc error text',
      value: 'desc'
    };

    mockTarget.value = '';
    await startValidating(
      mockTarget,
      mockSchema,
      mockUpdate,
      mockComponent.state
    );
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      isFormOK: false,
      title: {
        status: 'error',
        errorText: "title's length should be greater than 2. Current: 0",
        value: ''
      },
      description: {
        status: 'error',
        errorText: 'desc error text',
        value: 'desc'
      }
    });
  });

  test('Shouldn`t lost the user`s custom nested state - 1 component', async () => {
    // if the user embed one in title: { superhandy: 11}, we will maintain it
    mockSchema = {
      title: {
        minLength: 2,
        maxLength: 4,
        default: ''
      }
    };

    mockComponent.state.title.cool = 'super';
    mockComponent.state.title.super = {
      name: 'flash',
      title: 'wow'
    };
    mockComponent.state.title.age = 2;
    await startValidating(
      mockTarget,
      mockSchema,
      mockUpdate,
      mockComponent.state
    );
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      isFormOK: true,
      title: {
        status: 'ok',
        errorText: '',
        value: 'abc',
        cool: 'super',
        super: {
          name: 'flash',
          title: 'wow'
        },
        age: 2
      }
    });
  });

  test('Shouldn`t lost the user`s custom state - 2 component', async () => {
    // if the user embed one in title: { superhandy: 11}, we will maintain it
    mockSchema = {
      title: {
        minLength: 2,
        maxLength: 4,
        default: ''
      },
      description: {
        notEmpty: true
      }
    };

    mockComponent.state.description = {
      a: 1,
      b: {
        A: 1,
        B: 2
      },
      c: 'a'
    };
    mockComponent.state.title.cool = 'super';
    mockComponent.state.title.super = {
      name: 'flash',
      title: 'wow'
    };
    mockComponent.state.title.age = 2;
    await startValidating(
      mockTarget,
      mockSchema,
      mockUpdate,
      mockComponent.state
    );
    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate).toBeCalledWith({
      isFormOK: true,
      title: {
        status: 'ok',
        errorText: '',
        value: 'abc',
        cool: 'super',
        super: {
          name: 'flash',
          title: 'wow'
        },
        age: 2
      },
      description: {
        a: 1,
        b: {
          A: 1,
          B: 2
        },
        c: 'a'
      }
    });
  });
});
