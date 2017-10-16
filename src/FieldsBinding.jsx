import React from 'react';
import PropTypes from 'prop-types';
import * as lib from './helpers';

export default class FieldsBinding extends React.Component {
  validate(target) {
    const { schema, formStatus, update } = this.props;
    lib.startValidating( target, schema, formStatus, update )
  }

  handleOnChange = e =>  (this.validate(e.target));

  render() {
    const names = Object.keys(this.props.schema);
    const { fields } = this.props.formStatus;    
    const newChild = React.Children.map(this.props.children, child => {
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
    return <section onChange={this.handleOnChange}>{newChild}</section>;
  }
}

FieldsBinding.propTypes = {
  schema: PropTypes.object.isRequired,
  formStatus: PropTypes.object.isRequired,
  update: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired
};
