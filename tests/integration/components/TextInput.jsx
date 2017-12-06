/* eslint-disable react/prefer-stateless-function */
import PropTypes from "prop-types";
import React from "react";

const TextInput = ({
  name,
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