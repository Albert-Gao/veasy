/* eslint-disable no-new */
import EasyV from '../src/index';

describe('Test the createInitialState method', () => {
    let schema;
    const component = { dummy: true };
  
    beforeEach(() => {
      schema = { title: { type: String }, name: { type: String } };
    });
  
    test('Should return an object with certain properties', () => {
      const state = new EasyV(component, schema).createInitialState();
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
      const state = new EasyV(component, schema).createInitialState();
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