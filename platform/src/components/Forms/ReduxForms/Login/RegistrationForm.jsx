import { withStyles } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { TERMS_AND_CONDITIONS_URL, PRIVACY_POLICY_URL } from '../../../../config/consts';
import translations from '../../../../translations/i18next';
import MDCheckBoxField from '../../FormComponents/MDCheckBox/MDCheckBoxField';
import MDTextInputField from '../../FormComponents/MDTextInput/MDTextInputField';

const styles = (theme) => ({
  cssOutlinedInput: {
    borderColor: 'white',
    color: '#80888F',
    height: 40,
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
  error: {},
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
  if (!values.newPassword || (values.newPassword && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(values.newPassword))) {
    errors.newPassword = translations.t('forms.passwordValidation');
  }
  if (!values.confirmPassword || (values.confirmPassword && values.newPassword && values.confirmPassword !== values.newPassword)) {
    errors.confirmPassword = translations.t('forms.passwordMustCoincide');
  }
  if (!values.thermsAndCondition) {
    errors.thermsAndCondition = translations.t('forms.required');
  }
  if (!values.privacyPolicy) {
    errors.privacyPolicy = translations.t('forms.required');
  }

  return errors;
};

const RegistrationForm = ({ classes }) => (
  <div style={{ marginRight: 0, width: '100%' }}>
    <h4 id="circular-bold-label" style={{ color: '#70757b', marginBottom: 14, marginLeft: 20, fontSize: 15 }}>
      {translations.t('forms.newPassword').toUpperCase()}
    </h4>
    <Field
      name="newPassword"
      component={MDTextInputField}
      placeholder={translations.t('login.insertPassword')}
      required
      InputProps={{
        classes: {
          root: classes.cssOutlinedInput,
          focused: classes.cssFocused,
          notchedOutline: classes.notchedOutline,
          input: classes.inputLabel,
        },
      }}
      showErrorLabel
      type="password"
    />
    <h4 id="circular-bold-label" style={{ color: '#70757b', marginBottom: 14, marginLeft: 20, fontSize: 15, marginTop: 26 }}>
      {translations.t('forms.confirmPassword').toUpperCase()}
    </h4>
    <Field
      name="confirmPassword"
      component={MDTextInputField}
      placeholder={translations.t('forms.confirmPasswordLabel')}
      InputLabelProps={{
        classes: {
          root: classes.cssOutlinedInput,
          focused: classes.cssFocused,
        },
      }}
      InputProps={{
        classes: {
          root: classes.cssOutlinedInput,
          focused: classes.cssFocused,
          notchedOutline: classes.notchedOutline,
          input: classes.inputLabel,
        },
      }}
      showErrorLabel
      required
      type="password"
    />
    <Field
      name="privacyPolicy"
      component={MDCheckBoxField}
      containerstyle={{ marginLeft: 10 }}
      label={
        <div style={{ alignItems: 'center', display: 'flex' }}>
          <h4 id="circular-bold-label" style={{ color: 'white', fontSize: 12, margin: 0, marginRight: 5, fontWeight: 100 }}>
            {translations.t('forms.iAcceptPrivacy')}
          </h4>
          <h4
            id="circular-bold-label"
            className="link-label"
            style={{ fontSize: 12, margin: 0, color: '#98c8f8', fontWeight: 100 }}
            onClick={(e) => window.open(PRIVACY_POLICY_URL)}
          >
            {translations.t('forms.privacyPolicy')}
          </h4>
        </div>
      }
      showErrorLabel
    />
    <Field
      name="thermsAndCondition"
      component={MDCheckBoxField}
      containerstyle={{ marginLeft: 10, marginBottom: 10 }}
      label={
        <div style={{ alignItems: 'center', display: 'flex' }}>
          <h4 id="circular-bold-label" style={{ color: 'white', fontSize: 12, margin: 0, marginRight: 5, fontWeight: 100 }}>
            {translations.t('forms.iAcceptThe')}
          </h4>
          <h4
            id="circular-bold-label"
            className="link-label"
            style={{ fontSize: 12, margin: 0, color: '#98c8f8', fontWeight: 100 }}
            onClick={(e) => window.open(TERMS_AND_CONDITIONS_URL)}
          >
            {translations.t('forms.termsAndConditions')}
          </h4>
        </div>
      }
      showErrorLabel
    />
  </div>
);

export default connect()(
  withStyles(styles)(
    reduxForm({
      form: 'RegistrationForm',
      validate,
    })(RegistrationForm)
  )
);
