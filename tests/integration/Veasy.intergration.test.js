/* eslint-disable import/no-extraneous-dependencies,react/jsx-filename-extension */
import Enzyme, { mount, shallow, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import React from 'react';
import renderer from 'react-test-renderer';
import MyForm from './components/MyForm';

Enzyme.configure({ adapter: new Adapter() });

describe('Test <MyForm>', () => {
  beforeEach(() => {
  });

  test('should render a component with submit button not disable', () => {
    const wrapper = mount( <MyForm /> );
    expect(wrapper.state().isFormOK).toEqual(true);
  });
});
