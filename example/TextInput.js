/* eslint-disable react/prefer-stateless-function */
import PropTypes from "prop-types";
import React from "react";
import './TextInput.css';

const TextInput = ({
  name,
  placeholder,
  status,
  errorText,
  value,
  onChange
}) => (
  <div>
    <label htmlFor={name}>
      <input
        type="text"
        id={name}
        name={name}
        className={status}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <p>{errorText}</p>
    </label>
  </div>
);

TextInput.propTypes = {
  name: PropTypes.string.isRequired
};

export default TextInput;

/**
 * Could further reduce the code to the following
 */
// const SimpleBindingTextInput = ({
//   name,
//   status,
//   errorText,
//   ...rest
// }) => (
//   <div>
//     <label htmlFor={name}>
//       <input
//         type="text"
//         id={name}
//         name={name}
//         className={status}
//         {...rest}
//       />
//       <p>{errorText}</p>
//     </label>
//   </div>
// );