import PropTypes from 'prop-types';
/* eslint-disable react/forbid-prop-types,import/no-extraneous-dependencies */
import React from 'react';
import * as lib from './helpers';
import is from 'is_js';

export default class EasyV extends React.Component {
  getChildren = () => {
    const { schema, allState, children } = this.props;
    const names = Object.keys(schema);
    return React.Children.map(children, child => {
      const childName = child.props.name;
      if (names.includes(childName)) {
        return React.cloneElement(child, {
          status: allState[childName].status,
          hint: allState[childName].errorText,
          value: allState[childName].value
        });
      }
      return child;
    });
  };

  handleOnChange = e => {
    e.preventDefault();
    const { schema, allState, update } = this.props;
    lib.startValidating(e.target, schema, update, allState);
  };

  isRegisteredComponent = child => {
    if (is.lowerCase(child.type[0])) return false;

    const names = Object.keys(this.props.schema);
    const childName = child.props.name;
    if (React.isValidElement(child) && names.includes(childName)) {
      return true;
    }
    return false;
  };

  cloneElement = (child, childName) => {
    const { allState } = this.props;
    return React.cloneElement(child, {
      status: allState[childName].status,
      errorText: allState[childName].errorText,
      value: allState[childName].value
    });
  };

  recursiveCloneChildren = children => {
    return React.Children.map(children, child => {
      if (this.isRegisteredComponent(child)) {
        const childName = child.props.name;
        return this.cloneElement(child, childName);
      }
      
      const childProps = {};
      if (child.props) {
        // String has no Prop
        childProps.children = this.recursiveCloneChildren(child.props.children);
        return React.cloneElement(child, childProps);          
      }
      return child;
    });
  };

  render() {
    return (
      <section onChange={this.handleOnChange}>
        {this.recursiveCloneChildren(this.props.children)}
      </section>
    );
  }
}

EasyV.defaultProps = {
  allState: undefined
};

EasyV.propTypes = {
  schema: PropTypes.object.isRequired,
  allState: PropTypes.object,
  update: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired
};
