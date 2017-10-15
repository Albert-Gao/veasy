import React from 'react';

function FieldsBinding(props) {
  const names = Object.keys(props.schema);
  return React.Children.map(
    props.children,
    (child) => {
      const childName = child.props.name;
      console.info(childName);
      if (names.includes(childName)) {
        const { fields } = props.state.formStatus;
        return React.cloneElement(child, {
          status: fields[childName].status,
          hint: fields[childName].errorText,
          value: fields[childName].value
        });
      }
      return child;
    }
  );
}

export default FieldsBinding;