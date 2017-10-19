/* eslint-disable import/no-extraneous-dependencies,react/jsx-filename-extension */
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import React from 'react';
import EasyValidator from '../src/EasyV';

Enzyme.configure({ adapter: new Adapter() });

describe('Test the <EasyVLib />', () => {
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
      <EasyValidator
        schema={mockSchema}
        allState={mockComponent.state}
        update={mockComponent.setState}
      >
        <input name="title" />
      </EasyValidator>
    );
    expect(wrapper.find(EasyValidator)).toHaveLength(1);
    expect(wrapper.props().schema).toEqual(mockSchema);
    expect(wrapper.props().allState).toEqual(mockComponent.state);
    expect(wrapper.props().update).toEqual(mockComponent.setState);
  });

  test('Should render a section as container with a onChange function', () => {
    const wrapper = mount(
      <EasyValidator
        schema={mockSchema}
        allState={mockComponent.state}
        update={mockComponent.setState}
      >
        <input name="title" />
        <input />
        <input />
      </EasyValidator>
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
      <EasyValidator
        schema={mockSchema}
        allState={mockComponent.state}
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
        allState={mockComponent.state}
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

  test('snapshot tests.', () => {
    const wrapper = mount(
      <EasyValidator
        schema={mockSchema}
        allState={mockComponent.state}
        update={mockComponent.setState}
      >
        <input name="title" />
        <input />
        <input />
      </EasyValidator>
    );
    // const tree = renderer.create(wrapper).toJSON();
    expect(wrapper.debug()).toMatchSnapshot();
  });

  test('snapshot tests using 3rd.', () => {
    const wrapper = mount(
      <EasyValidator
        schema={mockSchema}
        allState={mockComponent.state}
        update={mockComponent.setState}
      >
        <input name="title" />
        <input />
        <input />
      </EasyValidator>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
