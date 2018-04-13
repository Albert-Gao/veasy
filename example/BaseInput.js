/*
*  This component is purely for solving the issue of jumping cursor of React controlled component
*  If you don't mind or using another workaround.
*  Feel free to ignore and change the BaseInput usage in `TextInput.js` to normal `input`
*/

import React from "react";

class BaseInput extends React.Component {
  constructor (...args) {
    super(...args);
    this._rawStr = '';
    this._caretPosition = 0;
  }

  componentDidUpdate ({ value }) {
    if (this.props.value !== value) {
      const str = this._rawStr.substr(0, this._caretPosition);
      const index = String(this.props.value).indexOf(str) + this._caretPosition;

      if (index !== -1) {
        this.refs.input.selectionStart = this.refs.input.selectionEnd = index;
      }
    }
  }

  handleChange = (ev) => {
    this._rawStr = String(ev.target.value);
    this._caretPosition = Number(ev.target.selectionEnd);

    if (this.props.onChange) {
      this.props.onChange(ev);
    }
  }

  render () {
    return (
      <input
        {...this.props}
        ref="input"
        onChange={this.handleChange}
      />
    );
  }
};

export default BaseInput;
