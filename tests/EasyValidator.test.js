/* eslint-disable import/no-extraneous-dependencies,react/jsx-filename-extension */
import React from 'react';
import Enzyme, { shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import EasyValidator from '../src/EasyValidator';

Enzyme.configure({ adapter: new Adapter() });

function FieldsBinding(props) {
  const names = Object.keys(props.schema);
  return React.Children.map(
    props.children,
    (child) => {
      const childName = child.props.name;
      if (names.includes(childName)) {
        const { fields } = props.formStatus;
        return React.cloneElement(child, {
          status: fields[childName].status,
          hint: fields[childName].errorText,
          value: fields[childName].value
        });
      }
      return child;
    }
  );
}

describe('Test the <EasyValidator />', () => {
  let mockSchema;
  let mockTarget;
  let mockComponent;
  let mockSetState = jest.fn();

  beforeEach(() => {
    mockSchema = {
      title: {
        string: {
          minLength: 1,
          default: ''
        }
      }
    };
    mockTarget = {
      name: 'title',
      value: 'abc'
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

  test('should allows to set 3 props', () => {
    const wrapper = mount(
      <EasyValidator
        schema={mockSchema}
        formStatus={mockComponent.state.formStatus}
        update={mockComponent.setState}
      >
        <input name="title" />
      </EasyValidator>
    );
    expect(wrapper.find(EasyValidator)).toHaveLength(1);
    expect(wrapper.props().schema).toEqual(mockSchema);
    expect(wrapper.props().formStatus).toEqual(mockComponent.state.formStatus);
    expect(wrapper.props().update).toEqual(mockComponent.setState);
  });

  test('Should render a section as container with a onChange function', () => {
    const wrapper = mount(
      <EasyValidator
        schema={mockSchema}
        formStatus={mockComponent.state.formStatus}
        update={mockComponent.setState}
      >
        <input name="title" />
        <input />
        <input />
      </EasyValidator>
    );
    expect(wrapper.find('section')).toHaveLength(1);
    expect(typeof wrapper.find('section').prop('onChange')).toEqual('function');
    wrapper.find('section').prop('onChange')({ target: mockTarget });
  });

  test('Should render 3 inputs as children of section', () => {
    const wrapper = shallow(
      <EasyValidator
        schema={mockSchema}
        formStatus={mockComponent.state.formStatus}
        update={mockComponent.setState}
      >
        <input />
        <input />
        <input />
      </EasyValidator>
    );
    const children = wrapper.find('section').children();
    expect(children).toHaveLength(3);
    expect(children.find('input')).toHaveLength(3);
  });

  test('The 1st children should have extra props', () => {
    const wrapper = shallow(
      <EasyValidator
        schema={mockSchema}
        formStatus={mockComponent.state.formStatus}
        update={mockComponent.setState}
      >
        <input name="title" />
        <input />
        <input />
      </EasyValidator>
    );
    const targetInput = wrapper.find('input').at(0);
    expect(targetInput.prop('name')).toEqual('title');
    expect(targetInput.prop('status')).toEqual('normal');
    expect(targetInput.prop('hint')).toEqual('');
    expect(targetInput.prop('value')).toEqual('');
  });
});