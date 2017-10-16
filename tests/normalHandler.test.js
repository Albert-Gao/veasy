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

    test('enum should work - error case', async () => {
        mockSchema.title.enum = ['tom', 'jerry'];
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
                        errorText:
                            'Value of title should be within [tom,jerry].',
                        value: mockTarget.value
                    }
                }
            }
        });
    });

    test('enum should work - ok case', async () => {
        mockSchema.title.enum = ['tom', 'jerry'];
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

    test('matchRegex should work - ok case', async () => {
        mockSchema.title.matchRegex = /^([a-z0-9]{5,})$/;
        mockTarget.value = 'wow18';
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

    test('isOK should be changed from true to false when an error occurs - error case', async () => {
        mockComponent.state.formStatus.fields.title.isOK = true;
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

    test('isEmail should work - error case', async () => {
        mockSchema.title.isEmail = true;
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
                        errorText: 'title should be email.',
                        value: mockTarget.value
                    }
                }
            }
        });
    });

    test('isEmail should work - ok case', async () => {
        mockSchema.title.isEmail = true;
        mockTarget.value = 'wow18@gmail.com';
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

    test('isUrl should work - error case', async () => {
        mockSchema.title.isUrl = true;
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
                        errorText: 'title should be a URL.',
                        value: mockTarget.value
                    }
                }
            }
        });
    });

    test('isUrl should work - ok case', async () => {
        mockSchema.title.isUrl = true;
        mockTarget.value = 'http://wow.com';
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

    test('isCreditCard should work - error case', async () => {
        mockSchema.title.isCreditCard = true;
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
                        errorText: 'title should be a credit card number.',
                        value: mockTarget.value
                    }
                }
            }
        });
    });

    test('isCreditCard should work - ok case', async () => {
        mockSchema.title.isCreditCard = true;
        mockTarget.value = '378282246310005';
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

    test('isHexColor should work - error case', async () => {
        mockSchema.title.isHexColor = true;
        mockTarget.value = '#3333';
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
                        errorText: 'title should be a hex color.',
                        value: mockTarget.value
                    }
                }
            }
        });
    });

    test('isHexColor should work - ok case', async () => {
        mockSchema.title.isHexColor = true;
        mockTarget.value = '#333';
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

    test('notEmpty should work - error case', async () => {
        mockSchema.title.notEmpty = true;
        mockTarget.value = '';
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
                        errorText: 'title should not be empty.',
                        value: mockTarget.value
                    }
                }
            }
        });
    });

    test('notEmpty should work - ok case', async () => {
        mockSchema.title.notEmpty = true;
        mockTarget.value = 'big fish';
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

    test('isIP should work - [v4] error case', async () => {
        mockSchema.title.isIP = 'v4';
        mockTarget.value = '1.2..5';
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
                        errorText: 'title should be IPv4 address.',
                        value: mockTarget.value
                    }
                }
            }
        });
    });

    test('isIP should work - [v4] ok case', async () => {
        mockSchema.title.isIP = 'v4';
        mockTarget.value = '198.156.23.5';
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

    test('isIP should work - [v6] error case', async () => {
        mockSchema.title.isIP = 'v6';
        mockTarget.value = '1.2..5';
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
                        errorText: 'title should be IPv6 address.',
                        value: mockTarget.value
                    }
                }
            }
        });
    });

    test('isIP should work - [v6] ok case', async () => {
        mockSchema.title.isIP = 'v6';
        mockTarget.value = '2001:DB8:0:0:1::1';
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

    test('isIP should work - [all] error case', async () => {
        mockSchema.title.isIP = 'all';
        mockTarget.value = '1.2..5';
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
                        errorText: 'title should be IP address.',
                        value: mockTarget.value
                    }
                }
            }
        });
    });

    test('isIP should work - [all] ok case', async () => {
        mockSchema.title.isIP = 'all';
        mockTarget.value = '2001:DB8:0:0:1::1';
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
