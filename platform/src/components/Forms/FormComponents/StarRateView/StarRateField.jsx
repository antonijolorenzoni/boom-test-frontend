import React from 'react';
import StarRateView from './';

class StarRateField extends React.Component {
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
      <StarRateView
        value={input.value}
        totalValues={5}
        minimumValue={minimumValue}
        onSelectValue={(value) => this.onHandleChange(value, input)}
        {...this.props}
      />
    );
  }
}

export default StarRateField;
