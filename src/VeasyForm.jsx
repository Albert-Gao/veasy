/* eslint-disable react/forbid-prop-types,import/no-extraneous-dependencies */
import is from 'is_js';
import PropTypes from 'prop-types';
import React from 'react';
import * as lib from './helpers/helpers';

export default class VeasyForm extends React.Component {
  triggerValidation = e => {
    e.persist();
    const { schema, allState, update } = this.props;
    lib.startValidating(e.target, schema, update, allState);
  };

  handleOnChange = e => this.triggerValidation(e);

  handleBlur = e => this.triggerValidation(e);

  isRegisteredComponent = child => {
    // Skip HTML element
    if (is.string(child.type)) return false;

    if (!is.propertyDefined(child.props, 'name')) return false;

    const childName = child.props.name;
    const names = Object.keys(this.props.schema);
    if (names.includes(childName)) return true;

    return false;
  };

  cloneElement = (child, childName) => {
    const childProp = this.props.allState[childName];
    return React.cloneElement(child, {
      status: childProp.status,
      errorText: childProp.errorText,
      value: childProp.value,
      onChange: this.handleOnChange
    });
  };

  recursiveCloneChildren = children =>
    React.Children.map(children, child => {
      if (!React.isValidElement(child)) return child;

      if (this.isRegisteredComponent(child)) {
        return this.cloneElement(child, child.props.name);
      }

      if (is.not.propertyDefined(child.props, 'children')) return child;

      const childProps = {};

      // String has no Prop
      childProps.children = this.recursiveCloneChildren(child.props.children);
      return React.cloneElement(child, childProps);
    });

  handleReset = e => {
    e.preventDefault();
    const { update, schema, allState } = this.props;
    update(lib.resetForm(schema, allState));
  };

  render() {
    const { schema, allState, update, children, tag, ...reset } = this.props;
    const Component = tag;
    return (
      <Component
        onBlur={this.handleBlur}
        onReset={this.handleReset}
        {...reset}
      >
        {this.recursiveCloneChildren(children)}
      </Component>
    );
  }
}

VeasyForm.defaultProps = {
  allState: undefined,
  tag: 'form'
};

VeasyForm.propTypes = {
  schema: PropTypes.object.isRequired,
  allState: PropTypes.object,
  update: PropTypes.func.isRequired,
  tag: PropTypes.string,
  children: PropTypes.any.isRequired
};
