import React from 'react';
import MDSelectView from './MDSelectView';

export default class MDSelectField extends React.Component {
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
    const { options, input, meta, containerstyle, className, disabled } = this.props;
    return (
      <div className={className} style={{ marginTop: 10, marginBottom: 20, ...containerstyle }}>
        <MDSelectView
          options={options}
          hasError={meta.touched && meta.error ? true : false}
          disabled={disabled}
          value={input.value}
          {...this.props}
          onSelect={(value) => this.onHandleChange(value, input)}
        />
      </div>
    );
  }
}
