import moment from 'moment';
import React, { Component } from 'react';
import DatePickerView from './DatePickerView.jsx';

export default class DatePickerField extends Component {
  onHandleChange(e, input) {
    const { onHandleChange } = this.props;
    if (input) {
      input.onChange(e);
    }
    if (onHandleChange) {
      onHandleChange(e);
    }
  }

  render() {
    const { input, meta, isOutsideRange, title } = this.props;
    return (
      <div>
        {title && (
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <h4 style={{ margin: 0, marginBottom: 12 }}>{title}</h4>
          </div>
        )}
        <DatePickerView
          isOutsideRange={isOutsideRange ? isOutsideRange : () => false}
          {...input}
          {...this.props}
          date={moment(input.value)}
          onChange={(value) => this.onHandleChange(value)}
        />
        <div style={{ position: 'absolute', paddingTop: 5, color: 'red' }}>
          {meta.error && <h6 style={{ color: 'red', marginTop: 4, marginLeft: 10 }}>{meta.error}</h6>}
        </div>
      </div>
    );
  }
}
