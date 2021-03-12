import React from 'react';

import MDTextInputView from './MDTextInputView';

export default class MDTextInputField extends React.Component {
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
    const { input, meta, showErrorLabel, containerstyle, min, step, onHandleChange, ...others } = this.props;
    const hasError = meta.touched && meta.error;

    return (
      <div style={{ marginTop: 10, marginBottom: 10, ...containerstyle }}>
        <MDTextInputView
          error={hasError}
          value={input.value || ''}
          min={min}
          step={step}
          onChange={(value) => this.onHandleChange(value, input)}
          {...others}
        />
        {showErrorLabel && hasError && <h6 style={{ color: 'red', marginTop: 4, marginBottom: 0, marginLeft: 10 }}>{meta.error}</h6>}
      </div>
    );
  }
}
