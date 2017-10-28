/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';

const RadioButtons = ({ name, label, values, value, onChange }) => {
  const controls = [];

  values.forEach((option, index) => {
    const forText = `${name}Choice${index}`;
    controls.push((
      <label
        key={option}
        className="radio"
        htmlFor={forText}
      >
        <input
          type="radio"
          name={name}
          id={forText}
          checked={value === option}
          value={option}
          onChange={onChange}
        />
        {option}
      </label>
    ));
  });

  return (
    <div onChange={onChange}>
      <label htmlFor={name} className="label is-medium">
        {label}
      </label>
      <div id={name} className="control">
        {controls}
      </div>
    </div>
  );
};

export default RadioButtons;
