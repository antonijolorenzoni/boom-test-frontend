import React from 'react';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { KeyboardArrowRight, KeyboardArrowLeft, Clear } from '@material-ui/icons';
import { MuiPickersUtilsProvider, InlineDatePicker } from 'material-ui-pickers';
import IconButton from '@material-ui/core/IconButton';

export default class MDDatePickerField extends React.Component {
  onHandleChange(value, input) {
    const { onHandleChange, minDate, timezone } = this.props;
    let selectedDate = moment.tz(moment.utc(value), timezone).valueOf();
    if (minDate && moment(selectedDate).isBefore(moment(minDate))) {
      selectedDate = moment().valueOf();
    }

    if (input) {
      input.onChange(selectedDate);
    }

    if (onHandleChange) {
      onHandleChange(selectedDate);
    }
  }

  render() {
    const { input, meta, showErrorLabel, containerstyle, format, clearable, timezone } = this.props;
    const hasError = meta.touched && meta.error;
    return (
      <MuiPickersUtilsProvider utils={MomentUtils} locale={moment.locale()} moment={moment}>
        <div style={{ marginBottom: 20, minWidth: 200, ...containerstyle }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <InlineDatePicker
              variant="outlined"
              margin="normal"
              onlyCalendar
              autoOk
              format={format || 'DD MMMM YYYY'}
              value={input.value ? moment.tz(moment.utc(input.value), timezone) : null}
              onChange={(value) => this.onHandleChange(value, input)}
              leftArrowIcon={<KeyboardArrowLeft />}
              rightArrowIcon={<KeyboardArrowRight />}
              {...this.props}
            />
            {input.value && clearable && (
              <IconButton style={{ marginLeft: -40, marginTop: 10 }} onClick={() => input.onChange(null)}>
                <Clear style={{ width: 15, height: 15 }} />
              </IconButton>
            )}
          </div>
          {showErrorLabel && hasError && <h6 style={{ color: 'red', marginTop: 4, marginLeft: 10 }}>{meta.error}</h6>}
        </div>
      </MuiPickersUtilsProvider>
    );
  }
}
