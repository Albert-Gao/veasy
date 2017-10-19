import PropTypes from 'prop-types';
/* eslint-disable react/forbid-prop-types,import/no-extraneous-dependencies */
import React from 'react';
import * as lib from './helpers';

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

  render() {
    const newChildren = this.getChildren();
    return <section onChange={this.handleOnChange}>{newChildren}</section>;
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
