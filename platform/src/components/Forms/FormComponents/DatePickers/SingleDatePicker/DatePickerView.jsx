import React from 'react';
import { SingleDatePicker } from 'react-dates';

export default class DatePickerView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
    };

    this.onDateChange = this.onDateChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
  }

  onDateChange(date) {
    const { onChange } = this.props;
    onChange(date.valueOf());
  }

  onFocusChange({ focused }) {
    this.setState({ focused });
  }

  render() {
    const { focused } = this.state;
    return (
      <SingleDatePicker
        numberOfMonths={1}
        focused={focused}
        onDateChange={this.onDateChange}
        onFocusChange={this.onFocusChange}
        {...this.props}
      />
    );
  }
}
