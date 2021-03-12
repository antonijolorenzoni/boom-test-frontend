import React, { Component } from 'react';
import MDCheckBoxView from './MDCheckBoxView';

export default class MDCheckBoxField extends Component {
  onHandleChange(value, input) {
    const { onHandleChange } = this.props;
    if (input) {
      input.onChange(value);
    }
    if (onHandleChange) {
      onHandleChange(value);
    }
  }

  render() {
    const { input, checkBoxColor, containerstyle, showErrorLabel, meta } = this.props;
    const checked = input.value;
    const hasError = meta.touched && meta.error ? true : false;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', ...containerstyle }}>
        <MDCheckBoxView checked={checked} color={checkBoxColor} onSelect={(value) => this.onHandleChange(value, input)} {...this.props} />
        {showErrorLabel && hasError && <h6 style={{ color: 'red', marginTop: 4, marginLeft: 10, marginBottom: 0 }}>{meta.error}</h6>}
      </div>
    );
  }
}
