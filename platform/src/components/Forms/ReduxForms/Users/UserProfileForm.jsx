import { withStyles } from '@material-ui/core';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, submit } from 'redux-form';
import translations from '../../../../translations/i18next';
import MDButton from '../../../MDButton/MDButton';
import MDTextInputField from '../../FormComponents/MDTextInput/MDTextInputField';
import MDSelectField from '../../FormComponents/MDSelectField/MDSelectField';
import { emailValidationRegexp } from '../../../../utils/validations';

const validate = (values) => {
  const errors = {};
  if (!values.email.trim()) {
    errors.email = 'required';
  } else if (!emailValidationRegexp.test(values.email.trim())) {
    errors.email = 'required';
  }
  if (!values.firstName.trim()) {
    errors.firstName = 'required';
  }
  if (!values.lastName.trim()) {
    errors.lastName = 'required';
  }
  return errors;
};

const styles = (theme) => ({
  formContainer: {
    margin: 20,
  },
  title: {
    margin: 0,
    marginTop: 20,
  },
  subtitle: {
    margin: 0,
    fontWeight: '100',
    marginBottom: 20,
  },
  enabledText: {
    color: '#66c0b0',
    margin: 0,
  },
  disabledText: {
    color: 'red',
    margin: 0,
  },
});

const theme = createMuiTheme({
  palette: {
    primary: { 500: '#5AC0B1' },
    secondary: { main: '#CC0033' },
  },
  typography: {
    useNextVariants: true,
  },
});

const UserProfileForm = ({ classes, dispatch, user, onResendConfirmationEmail, onDeleteUser }) => (
  <MuiThemeProvider theme={theme}>
    <div className={classes.formContainer}>
      <Field name="email" component={MDTextInputField} label="Email" required multiline />
      <Field name="firstName" component={MDTextInputField} label={translations.t('forms.firstName')} multiline required />
      <Field name="lastName" component={MDTextInputField} label={translations.t('forms.lastName')} multiline required />
      <Field name="jobTitle" component={MDTextInputField} label={translations.t('forms.jobTitle')} multiline />
      <Field name="phoneNumber" component={MDTextInputField} label={translations.t('forms.phone')} multiline type="number" />
      <Field
        title={translations.t('languages.language')}
        name="language"
        component={MDSelectField}
        options={[
          {
            id: 'ITALIAN',
            value: translations.t('languages.it'),
          },
          {
            id: 'ENGLISH',
            value: translations.t('languages.en'),
          },
        ]}
        label={translations.t('forms.language')}
        required
        containerstyle={{ marginBottom: 40 }}
      />
      <MDButton
        title={translations.t('forms.save')}
        backgroundColor="#5AC0B1"
        containerstyle={{ marginBottom: 20 }}
        onClick={() => dispatch(submit('UserProfileForm'))}
      />
    </div>
  </MuiThemeProvider>
);

const mapStateToProps = (state) => ({
  form: state.form.UserProfileForm,
});

export default _.flow([
  connect(mapStateToProps),
  reduxForm({
    form: 'UserProfileForm',
    validate,
    destroyOnUnmount: false,
  }),
  withStyles(styles),
])(UserProfileForm);
