/* eslint-disable import/no-extraneous-dependencies,react/jsx-filename-extension */
import Enzyme, { mount, shallow, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import MyForm from './components/MyForm';

Enzyme.configure({ adapter: new Adapter() });

describe('Test <MyForm>', () => {
  beforeEach(() => {
  });

  test('should render a component with state.isFormOK equals true', () => {
    const wrapper = shallow( <MyForm /> );
    expect(wrapper.state().isFormOK).toEqual(true);
  });
});
