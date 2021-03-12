import { Grid, withStyles } from '@material-ui/core';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Field, reduxForm, change } from 'redux-form';

import translations from '../../../../translations/i18next';
import MDCheckBoxField from '../../FormComponents/MDCheckBox/MDCheckBoxField';
import MDDatePickerField from '../../FormComponents/MDDatePicker/MDDatePickerField';
import MDTimePickerField from '../../FormComponents/MDTimePicker/MDTimePickerField';
import { getPlaceTimezone } from '../../../../api/instances/googlePlacesInstance';

const styles = () => ({
  container: {
    marginTop: 0,
  },
  text: {
    margin: 0,
    color: '#80888d',
  },
});

const validate = (values) => {
  const errors = {};
  if (!values.date) {
    errors.date = translations.t('forms.required');
  }
  if (!values.startTime) {
    errors.startTime = translations.t('forms.required');
  } else if (moment(values.startTime).hours() < 8) {
    errors.startTime = translations.t('forms.unvabilabilityStartTimeEarlyError');
  } else if (moment(values.startTime).hours() > 20 || moment(values.startTime).hours() === 20) {
    errors.startTime = translations.t('forms.unvabilabilityStartTimeLateError');
  }
  if (!values.endTime) {
    errors.endTime = translations.t('forms.required');
  }
  if (values.endTime && values.startTime && moment(values.startTime).isAfter(moment(values.endTime))) {
    errors.startTime = translations.t('forms.unvabilabilityStartAfterEndError');
  }

  return errors;
};

class NewUnavailabilityForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timezone: moment.tz.guess(),
    };
  }

  async componentWillMount() {
    const {
      user: {
        data: {
          address: { location },
        },
      },
    } = this.props;
    const timezone = await getPlaceTimezone(location.latitude, location.longitude);
    this.setState({ timezone });
  }

  setEventFullDay() {
    const { dispatch, form } = this.props;
    const currentSelectedDate = form && form.values && form.values.date;
    const newStartTime = moment(currentSelectedDate)
      .set('hours', 8)
      .set('minutes', 0)
      .valueOf();
    const newEndTime = moment(currentSelectedDate)
      .set('hours', 20)
      .set('minutes', 0)
      .valueOf();
    dispatch(change('NewUnavailabilityForm', 'startTime', newStartTime));
    dispatch(change('NewUnavailabilityForm', 'endTime', newEndTime));
  }

  render() {
    const { classes } = this.props;
    const { timezone } = this.state;
    return (
      <div className={classes.container}>
        <Grid container spacing={8}>
          <Grid item xs={12} md={12}>
            <Field name="date" component={MDDatePickerField} showErrorLabel label={translations.t('calendar.unavailableDate')} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Field
              name="startTime"
              component={MDTimePickerField}
              showErrorLabel
              timezone={timezone}
              label={translations.t('calendar.shootingStartTime')}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Field
              name="endTime"
              component={MDTimePickerField}
              showErrorLabel
              timezone={timezone}
              label={translations.t('calendar.shootingEndTime')}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Field
              name="fullDay"
              component={MDCheckBoxField}
              containerstyle={{ marginTop: 15, justifyContent: 'center', marginLeft: 10 }}
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <h4
                    style={{
                      fontSize: '1em',
                      margin: 0,
                      marginRight: 10,
                      fontWeight: 100,
                      color: '#80888d',
                    }}
                  >
                    {translations.t('forms.isfullDay')}
                  </h4>
                </div>
              }
              onHandleChange={() => this.setEventFullDay()}
              showErrorLabel
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Field
              name="periodicity"
              component={MDCheckBoxField}
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <h4
                    style={{
                      fontSize: '1em',
                      margin: 0,
                      marginRight: 10,
                      fontWeight: 100,
                      color: '#80888d',
                    }}
                  >
                    {translations.t('calendar.repeatUnavailability')}
                  </h4>
                </div>
              }
              showErrorLabel
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

NewUnavailabilityForm.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  form: state.form.NewUnavailabilityForm,
});

export default _.flow([
  connect(mapStateToProps),
  withStyles(styles),
  reduxForm({
    form: 'NewUnavailabilityForm',
    validate,
  }),
])(NewUnavailabilityForm);
