import { withStyles } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import translations from '../../../../translations/i18next';
import MDTextInputField from '../../FormComponents/MDTextInput/MDTextInputField';

const styles = (theme) => ({
  cssOutlinedInput: {
    borderColor: 'white',
    color: '#80888F',
    height: 45,
    fontFamily: 'Circular Book !important',
    backgroundColor: 'white',
    '&$cssFocused $notchedOutline': {
      borderColor: 'white',
    },
    '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
      borderColor: 'white',
    },
  },
  disabled: {},
  focused: {},
  error: {
    borderColor: 'red',
  },
  notchedOutline: {
    borderColor: 'white',
  },
  cssFocused: {},
  inputLabel: {
    fontFamily: 'Circular Book !important',
  },
});

const validate = (values) => {
  const errors = {};
  if (!values.newPassword) {
    errors.newPassword = translations.t('forms.required');
  }
  if (values.newPassword && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(values.newPassword)) {
    errors.newPassword = translations.t('forms.passwordValidation');
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = translations.t('forms.required');
  }
  if (values.confirmPassword && values.newPassword && values.confirmPassword !== values.newPassword) {
    errors.confirmPassword = translations.t('forms.passwordMustCoincide');
  }
  return errors;
};

const ConfirmPasswordForm = ({ classes }) => (
  <div style={{ marginRight: 20, width: '90%' }}>
    <h4 className="circular-book-label" style={{ color: '#70757b', marginBottom: 14, marginLeft: 20, fontSize: 15 }}>
      {translations.t('forms.newPassword').toUpperCase()}
    </h4>
    <Field
      name="newPassword"
      component={MDTextInputField}
      placeholder={translations.t('login.insertPassword')}
      required
      showErrorLabel
      type="password"
      InputProps={{
        classes: {
          root: classes.cssOutlinedInput,
          focused: classes.cssFocused,
          notchedOutline: classes.notchedOutline,
          error: classes.error,
          input: classes.inputLabel,
        },
      }}
    />
    <h4 className="circular-book-label" style={{ color: '#70757b', marginBottom: 14, marginLeft: 20, fontSize: 15, marginTop: 26 }}>
      {translations.t('forms.confirmPassword').toUpperCase()}
    </h4>
    <Field
      name="confirmPassword"
      component={MDTextInputField}
      placeholder={translations.t('forms.confirmPasswordLabel')}
      showErrorLabel
      required
      type="password"
      InputProps={{
        classes: {
          root: classes.cssOutlinedInput,
          focused: classes.cssFocused,
          notchedOutline: classes.notchedOutline,
          error: classes.error,
          input: classes.inputLabel,
        },
      }}
    />
  </div>
);

export default connect()(
  withStyles(styles)(
    reduxForm({
      form: 'ConfirmPasswordForm',
      validate,
    })(ConfirmPasswordForm)
  )
);
