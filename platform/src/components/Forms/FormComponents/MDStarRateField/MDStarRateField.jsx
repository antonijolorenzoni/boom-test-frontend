import React from 'react';
import MDStarRateView from './MDStarRateView';

class MDStarRateField extends React.Component {
  onHandleChange(value, input) {
    const { onHandleChange, minimumValue } = this.props;
    const finalValue = value < minimumValue ? minimumValue : value;
    if (input) {
      input.onChange(finalValue);
    }
    if (onHandleChange) {
      onHandleChange(finalValue);
    }
  }

  render() {
    const { input, minimumValue } = this.props;
    return (
      <MDStarRateView
        value={input.value}
        totalValues={5}
        minimumValue={minimumValue}
        onSelectValue={(value) => this.onHandleChange(value, input)}
        {...this.props}
      />
    );
  }
}

export default MDStarRateField;
