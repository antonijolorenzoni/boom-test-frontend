import React from 'react';
import MDSelectMultipleView from './MDSelectMultipleView';

export default class MDSelectMultipleField extends React.Component {
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
    const { options, input, meta, containerstyle } = this.props;
    return (
      <div style={{ marginTop: 10, marginBottom: 20, ...containerstyle }}>
        <MDSelectMultipleView
          options={options}
          hasError={meta.touched && meta.error ? true : false}
          value={input.value || []}
          {...this.props}
          onSelect={(value) => this.onHandleChange(value, input)}
        />
      </div>
    );
  }
}
