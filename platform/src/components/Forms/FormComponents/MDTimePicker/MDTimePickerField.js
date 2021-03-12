import MomentUtils from '@date-io/moment';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import ClockIcon from '@material-ui/icons/QueryBuilder';
import { Clear } from '@material-ui/icons';
import { InlineTimePicker, MuiPickersUtilsProvider, TimePicker } from 'material-ui-pickers';
import moment from 'moment';
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import translations from '../../../../translations/i18next';

const theme = createMuiTheme({
  palette: {
    primary: { 500: '#5AC0B1' },
    seconday: '#5AC0B1',
  },
  typography: {
    useNextVariants: true,
  },
});
class MDTimePickerField extends React.Component {
  onHandleChange(value, input) {
    const { timezone } = this.props;
    const minutes = moment.tz(moment.utc(value).toISOString(), timezone).minutes();
    const roundedValues = moment.tz(moment.utc(value).toISOString(), timezone).set('minutes', minutes - (minutes % 5));
    const { onHandleChange } = this.props;
    if (input) {
      input.onChange(moment.tz(moment.utc(roundedValues), timezone).valueOf());
    }
    if (onHandleChange) {
      onHandleChange(moment(roundedValues, 'HH:mm A').valueOf());
    }
  }

  render() {
    const { input, meta, showErrorLabel, containerstyle, timezone, isInline, clearable } = this.props;
    const hasError = meta.touched && meta.error;
    return (
      <MuiThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={MomentUtils} locale={moment.locale()} moment={moment}>
          <div style={{ marginTop: 10, marginBottom: 20, ...containerstyle }}>
            {isInline ? (
              <TimePicker
                keyboard
                ampm={false}
                clearable
                placeholder="HH:mm"
                variant="outlined"
                minutesStep={5}
                error={hasError}
                keyboardIcon={<ClockIcon />}
                invalidDateMessage={translations.t('forms.dateFormatInvalid')}
                mask={[/\d/, /\d/, ':', /\d/, /\d/]}
                value={input.value ? moment.tz(moment.utc(input.value), timezone) : null}
                onChange={(value) => this.onHandleChange(value, input)}
                {...this.props}
              />
            ) : (
              <InlineTimePicker
                ampm={false}
                error={hasError}
                variant="outlined"
                {...this.props}
                format="HH:mm"
                value={input.value ? moment.tz(moment.utc(input.value), timezone) : null}
                onChange={(value) => this.onHandleChange(value, input)}
                inputProps={{
                  step: 300, // 5 min
                }}
              />
            )}
            {input.value && clearable && (
              <IconButton style={{ marginLeft: -40, marginTop: 10 }} onClick={() => input.onChange(null)}>
                <Clear style={{ width: 15, height: 15 }} />
              </IconButton>
            )}
            {showErrorLabel && hasError && <h6 style={{ color: 'red', marginTop: 4, marginLeft: 0 }}>{meta.error}</h6>}
          </div>
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    );
  }
}

export default MDTimePickerField;
