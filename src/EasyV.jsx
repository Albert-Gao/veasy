import PropTypes from 'prop-types';
/* eslint-disable react/forbid-prop-types,import/no-extraneous-dependencies */
import React from 'react';
import * as lib from './helpers';

export default class EasyV extends React.Component {
  getChildren = () => {
    const { schema, formStatus, children } = this.props;
    const names = Object.keys(schema);
    const { fields } = formStatus;
    return React.Children.map(children, child => {
      const childName = child.props.name;
      if (names.includes(childName)) {
        return React.cloneElement(child, {
          status: fields[childName].status,
          hint: fields[childName].errorText,
          value: fields[childName].value
        });
      }
      return child;
    });
  };

  handleOnChange = e => (this.validate(e.target));

  validate(target) {
    const { schema, formStatus, update } = this.props;
    lib.startValidating(target, schema, formStatus, update)
  }

  render() {
    const newChildren = this.getChildren();
    return <section onChange={this.handleOnChange}>{newChildren}</section>;
  }
}

EasyV.propTypes = {
  schema: PropTypes.object.isRequired,
  formStatus: PropTypes.shape({
    isFormOK: PropTypes.bool,
    fields: PropTypes.object
  }).isRequired,
  update: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired
};
