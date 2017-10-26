/* eslint-disable import/no-extraneous-dependencies,react/jsx-filename-extension */
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import React from 'react';
import Veasy from '../src/Veasy';

Enzyme.configure({ adapter: new Adapter() });

const Input = () => <input type="text" />
const Email = () => <input type="email" />

describe('Test the <Veasy />', () => {
  let mockSchema;
  let mockTarget;
  let mockComponent;

  beforeEach(() => {
    mockSchema = {
      title: {
        minLength: 1,
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
      setState: x => {}
    };
  });

  test('should allows to set 3 props', () => {
    const wrapper = mount(
      <Veasy
        schema={mockSchema}
        allState={mockComponent.state}
        update={mockComponent.setState}
      >
        <Input name="title" />
      </Veasy>
    );
    expect(wrapper.find(Veasy)).toHaveLength(1);
    expect(wrapper.props().schema).toEqual(mockSchema);
    expect(wrapper.props().allState).toEqual(mockComponent.state);
    expect(wrapper.props().update).toEqual(mockComponent.setState);
  });

  test('Should render a section as container with a onChange function', () => {
    const wrapper = mount(
      <Veasy
        schema={mockSchema}
        allState={mockComponent.state}
        update={mockComponent.setState}
      >
        <Input name="title" />
        <input />
        <input />
      </Veasy>
    );
    expect(wrapper.find('section')).toHaveLength(1);
    expect(typeof wrapper.find('section').prop('onChange')).toEqual('function');
    wrapper.find('section').prop('onChange')({ 
      preventDefault: () => {}, 
      target: mockTarget
    });
  });

  test('Should render 3 inputs as children of section', () => {
    const wrapper = shallow(
      <Veasy
        schema={mockSchema}
        allState={mockComponent.state}
        update={mockComponent.setState}
      >
        <input />
        <input />
        <input />
      </Veasy>
    );
    const children = wrapper.find('section').children();
    expect(children).toHaveLength(3);
    expect(children.find('input')).toHaveLength(3);
  });

  test('The 1st children should have extra props', () => {
    const wrapper = shallow(
      <Veasy
        schema={mockSchema}
        allState={mockComponent.state}
        update={mockComponent.setState}
      >
        <Input name="title" />
        <input />
        <input />
      </Veasy>
    );
    const targetInput = wrapper.find('Input').at(0);
    expect(targetInput.prop('name')).toEqual('title');
    expect(targetInput.prop('status')).toEqual('normal');
    expect(targetInput.prop('errorText')).toEqual('');
    expect(targetInput.prop('value')).toEqual('');
  });

  test('The 2nd and 3rd children shouldn`t have extra props', () => {
    const wrapper = shallow(
      <Veasy
        schema={mockSchema}
        allState={mockComponent.state}
        update={mockComponent.setState}
      >
        <Input name="title" />
        <input />
        <input />
      </Veasy>
    );
    const targetInput = wrapper.find('input').at(1);
    expect(targetInput.prop('name')).toBe(undefined);
    expect(targetInput.prop('status')).toBe(undefined);
    expect(targetInput.prop('errorText')).toBe(undefined);
    expect(targetInput.prop('value')).toBe(undefined);

    const targetInput1 = wrapper.find('input').at(2);
    expect(targetInput1.prop('name')).toBe(undefined);
    expect(targetInput1.prop('status')).toBe(undefined);
    expect(targetInput1.prop('errorText')).toBe(undefined);
    expect(targetInput1.prop('value')).toBe(undefined);
  });

  test('Should bind recursive element', () => {
    const wrapper = shallow(
      <Veasy
        schema={mockSchema}
        allState={mockComponent.state}
        update={mockComponent.setState}
      >
        <div>
          <p>
            <Input name="title" />
          </p>
        </div>
        <input />
        <div>
          <input />
        </div>
      </Veasy>
    );
    const targetInput = wrapper.find('Input').at(0);
    expect(targetInput.prop('name')).toBe('title');
    expect(targetInput.prop('status')).toBe('normal');
    expect(targetInput.prop('errorText')).toBe('');
    expect(targetInput.prop('value')).toBe('');
  });

  test('Should maintain the user`s prop', () => {
    const wrapper = shallow(
      <Veasy
        schema={mockSchema}
        allState={mockComponent.state}
        update={mockComponent.setState}
      >
        <div>
          <p>
            <Input name="title" />
          </p>
        </div>
        <input />
        <div>
          <Email super="ok" cool="true" />
        </div>
      </Veasy>
    );
    const targetInput = wrapper.find('Email').at(0);
    expect(targetInput.prop('super')).toBe('ok');
    expect(targetInput.prop('cool')).toBe('true');
  });

  test('trigger onBlur should invoke triggerValidation', () => {
    
    const wrapper = shallow(
      <Veasy
        schema={mockSchema}
        allState={mockComponent.state}
        update={mockComponent.setState}
      >
        <div>
          <p>
            <Input name="title" />
          </p>
        </div>
        <input />
        <div>
          <Email super="ok" cool="true" />
        </div>
      </Veasy>
    );
    const mockTrigger = jest.fn();
    wrapper.instance().triggerValidation = mockTrigger;
    expect(mockTrigger.mock.calls.length).toBe(0);
    const target = wrapper.find('section').at(0);
    target.simulate('blur');
    expect(mockTrigger.mock.calls.length).toBe(1);
  });
});
