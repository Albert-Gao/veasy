/* eslint-disable import/no-extraneous-dependencies,react/jsx-filename-extension */
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import React from 'react';
import VeasyForm from '../src/VeasyForm';
import * as lib from '../src/helpers';

Enzyme.configure({ adapter: new Adapter() });

const Input = () => <input type="text" />;
const Email = () => <input type="email" />;

describe('Test the <Veasy />', () => {
  let mockSchema;
  let mockTarget;
  let mockComponent;
  let componentToRender;

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
    componentToRender = (
      <VeasyForm
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
      </VeasyForm>
    );
  });

  test('should allows to set 3 props', () => {
    const wrapper = mount(
      <VeasyForm
        schema={mockSchema}
        allState={mockComponent.state}
        update={mockComponent.setState}
      >
        <Input name="title" />
      </VeasyForm>
    );
    expect(wrapper.find(VeasyForm)).toHaveLength(1);
    expect(wrapper.props().schema).toEqual(mockSchema);
    expect(wrapper.props().allState).toEqual(mockComponent.state);
    expect(wrapper.props().update).toEqual(mockComponent.setState);
  });

  test('Should render a section as container with a onChange function', () => {
    const wrapper = mount(
      <VeasyForm
        schema={mockSchema}
        allState={mockComponent.state}
        update={mockComponent.setState}
      >
        <Input name="title" />
        <input />
        <input />
      </VeasyForm>
    );
    expect(wrapper.find('form')).toHaveLength(1);
    expect(wrapper.find('section')).toHaveLength(0);
    expect(typeof wrapper.find('form').prop('onChange')).toEqual('function');
    wrapper.find('form').prop('onChange')({
      preventDefault: () => {},
      target: mockTarget
    });
  });

  test('Should render 3 inputs as children of section', () => {
    const wrapper = shallow(
      <VeasyForm
        schema={mockSchema}
        allState={mockComponent.state}
        update={mockComponent.setState}
      >
        <input />
        <input />
        <input />
      </VeasyForm>
    );
    const children = wrapper.find('form').children();
    expect(children).toHaveLength(3);
    expect(children.find('input')).toHaveLength(3);
  });

  test('The 1st children should have extra props', () => {
    const wrapper = shallow(
      <VeasyForm
        schema={mockSchema}
        allState={mockComponent.state}
        update={mockComponent.setState}
      >
        <Input name="title" />
        <input />
        <input />
      </VeasyForm>
    );
    const targetInput = wrapper.find('Input').at(0);
    expect(targetInput.prop('name')).toEqual('title');
    expect(targetInput.prop('status')).toEqual('normal');
    expect(targetInput.prop('errorText')).toEqual('');
    expect(targetInput.prop('value')).toEqual('');
  });

  test('The 2nd and 3rd children shouldn`t have extra props', () => {
    const wrapper = shallow(
      <VeasyForm
        schema={mockSchema}
        allState={mockComponent.state}
        update={mockComponent.setState}
      >
        <Input name="title" />
        <input />
        <input />
      </VeasyForm>
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
    const wrapper = shallow(componentToRender);
    const targetInput = wrapper.find('Input').at(0);
    expect(targetInput.prop('name')).toBe('title');
    expect(targetInput.prop('status')).toBe('normal');
    expect(targetInput.prop('errorText')).toBe('');
    expect(targetInput.prop('value')).toBe('');
  });

  test('Should maintain the user`s prop', () => {
    const wrapper = shallow(componentToRender);
    const targetInput = wrapper.find('Email').at(0);
    expect(targetInput.prop('super')).toBe('ok');
    expect(targetInput.prop('cool')).toBe('true');
  });

  test('trigger onBlur should invoke triggerValidation', () => {
    const wrapper = shallow(componentToRender);
    const mockTrigger = jest.fn();
    wrapper.instance().triggerValidation = mockTrigger;
    expect(mockTrigger.mock.calls.length).toBe(0);
    const target = wrapper.find('form').at(0);
    target.simulate('blur');
    expect(mockTrigger.mock.calls.length).toBe(1);
  });

  test('should trigger lib.resetForm', () => {
    const mockReset = jest.fn();
    const mockUpdate = jest.fn();
    lib.resetForm = mockReset;
    const wrapper = shallow(
      <VeasyForm
        schema={mockSchema}
        allState={mockComponent.state}
        update={mockUpdate}
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
      </VeasyForm>
    );
    const target = wrapper.find('form').at(0);
    target.simulate('reset', { preventDefault: () => {} });
    expect(mockReset.mock.calls.length).toBe(1);
    expect(mockReset).toBeCalledWith({
      title: {
        default: '',
        minLength: 1
      }
    });
    expect(mockUpdate.mock.calls.length).toBe(1);
  });

  test('Should render a form with 3 inputs with extra props', () => {
    const wrapper = shallow(
      <VeasyForm
        schema={mockSchema}
        allState={mockComponent.state}
        update={mockComponent.setState}
        name='super'
        action='google'
        onSubmit={() => {}}
      >
        <Input name="title" />
        <input />
        <input />
      </VeasyForm>
    );
    console.log(wrapper.debug());
    const form = wrapper.find('form').at(0);
    expect(form.prop('name')).toEqual('super');
    expect(form.prop('action')).toEqual('google');  
    expect(typeof form.prop('onSubmit')).toEqual('function');
  });
});
