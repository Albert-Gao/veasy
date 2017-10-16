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
        mockSchema.age.number.min = 1;
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

    test('min should work - [int]ok case', async () => {
        mockSchema.age.number.min = 1;
        mockTarget.value = '2';
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
                    age: {
                        status: 'ok',
                        errorText: '',
                        value: '2'
                    }
                }
            }
        });
    });

    test('min should work - [float]error case', async () => {
        mockSchema.age.number.min = 1;
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

    test('min should work - [float]ok case', async () => {
        mockSchema.age.number.min = 1;
        mockTarget.value = '1.78';
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
                    age: {
                        status: 'ok',
                        errorText: '',
                        value: '1.78'
                    }
                }
            }
        });
    });

    test('min should work - [negative]error case', async () => {
        mockSchema.age.number.min = '1';
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

    test('min should work - [negative]ok case', async () => {
        mockSchema.age.number.min = '1';
        mockTarget.value = '-9';
        mockSchema.age.number.min = '-10';
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
                    age: {
                        status: 'ok',
                        errorText: '',
                        value: '-9'
                    }
                }
            }
        });
    });

    test('max should work - [int]error case', async () => {
        mockSchema.age.number.max = 5;
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

    test('max should work - [int]ok case', async () => {
        mockSchema.age.number.max = 5;
        mockTarget.value = '4';
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
                    age: {
                        status: 'ok',
                        errorText: '',
                        value: '4'
                    }
                }
            }
        });
    });

    test('max should work - [float]error case', async () => {
        mockSchema.age.number.max = 5;
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

    test('max should work - [float]ok case', async () => {
        mockSchema.age.number.max = 5;
        mockTarget.value = '4.91';
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
                    age: {
                        status: 'ok',
                        errorText: '',
                        value: '4.91'
                    }
                }
            }
        });
    });

    test('max should work - [negative]error case', async () => {
        mockSchema.age.number.max = 5;
        mockTarget.value = '-7';
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

    test('max should work - [negative]ok case', async () => {
        mockSchema.age.number.max = 5;
        mockTarget.value = '-15';
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
                isFormOK: true,
                fields: {
                    age: {
                        status: 'ok',
                        errorText: '',
                        value: '-15'
                    }
                }
            }
        });
    });

    test('equal should work - error case', async () => {
        mockSchema.age.number.equal = 5;
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
                        errorText: 'age should equal to 5.',
                        value: '-15'
                    }
                }
            }
        });
    });

    test('equal should work - ok case', async () => {
        mockSchema.age.number.equal = '-15';
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
                isFormOK: true,
                fields: {
                    age: {
                        status: 'ok',
                        errorText: '',
                        value: '-15'
                    }
                }
            }
        });
    });

    test('notEqual should work - error case', async () => {
        mockSchema.age.number.notEqual = 5.2;
        mockTarget.value = '5.2';
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
                        errorText: 'age should not equal to 5.2.',
                        value: '5.2'
                    }
                }
            }
        });
    });

    test('notEqual should work - ok case', async () => {
        mockSchema.age.number.notEqual = '-12';
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
                isFormOK: true,
                fields: {
                    age: {
                        status: 'ok',
                        errorText: '',
                        value: '-15'
                    }
                }
            }
        });
    });

    test('isPositive should work - error case', async () => {
        mockSchema.age.number.isPositive = true;
        mockTarget.value = '-5.2';
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
                        errorText: 'age should be positive.',
                        value: '-5.2'
                    }
                }
            }
        });
    });

    test('isPositive should work - ok case', async () => {
        mockSchema.age.number.isPositive = true;
        mockTarget.value = '15';
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
                    age: {
                        status: 'ok',
                        errorText: '',
                        value: '15'
                    }
                }
            }
        });
    });

    test('isNegative should work - error case', async () => {
        mockSchema.age.number.isNegative = true;
        mockTarget.value = '5.2';
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
                        errorText: 'age should be negative.',
                        value: '5.2'
                    }
                }
            }
        });
    });

    test('isNegative should work - ok case', async () => {
        mockSchema.age.number.isNegative = true;
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
                isFormOK: true,
                fields: {
                    age: {
                        status: 'ok',
                        errorText: '',
                        value: '-15'
                    }
                }
            }
        });
    });

    test('isInt should work - error case', async () => {
        mockSchema.age.number.isInt = true;
        mockTarget.value = '5.2';
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
                        errorText: 'age should be integer.',
                        value: '5.2'
                    }
                }
            }
        });
    });

    test('isInt should work - ok case', async () => {
        mockSchema.age.number.isInt = true;
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
                isFormOK: true,
                fields: {
                    age: {
                        status: 'ok',
                        errorText: '',
                        value: '-15'
                    }
                }
            }
        });
    });
});
