import { withStyles } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import IconTrash from '@material-ui/icons/Delete';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, submit } from 'redux-form';
import translations from '../../../../translations/i18next';
import MDButton from '../../../MDButton/MDButton';
import UserStatusView from '../../../UserStatusView/UserStatusView';
import MDTextInputField from '../../FormComponents/MDTextInput/MDTextInputField';
import MDSelectField from '../../FormComponents/MDSelectField/MDSelectField';
import { emailValidationRegexp } from '../../../../utils/validations';
import { useTranslation } from 'react-i18next';

const validate = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = 'required';
  } else if (!emailValidationRegexp.test(values.email)) {
    errors.email = 'required';
  }
  if (!values.firstName) {
    errors.firstName = 'required';
  }
  if (!values.lastName) {
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

const UserFormCc = ({ classes, dispatch, user, onResendConfirmationEmail, onDeleteUser }) => {
  const { t } = useTranslation();

  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.formContainer}>
        <h4>{t('forms.userData')}</h4>
        <Field name="email" component={MDTextInputField} label="Email" required multiline />
        <Field name="firstName" component={MDTextInputField} label={translations.t('forms.firstName')} multiline required />
        <Field name="lastName" component={MDTextInputField} label={translations.t('forms.lastName')} multiline required />
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
        {false && user && !_.isEmpty(user) && (
          <UserStatusView
            classes={classes}
            isEnabled={user && user.enabled}
            onResendConfirmationEmail={() => onResendConfirmationEmail(user.email)}
          />
        )}
        <Divider />
        {false && user && !_.isEmpty(user) && (
          <div>
            <h2 className={classes.title}>{translations.t('forms.deleteUser')}</h2>
            <h3 className={classes.subtitle}>{translations.t('forms.deleteUserExplanation')}</h3>
            <MDButton
              icon={<IconTrash />}
              title={translations.t('forms.deleteUser')}
              containerstyle={{ marginBottom: 20 }}
              onClick={() => onDeleteUser()}
            />
            <Divider />
          </div>
        )}
        <MDButton
          title={translations.t('forms.save')}
          backgroundColor="#5AC0B1"
          containerstyle={{ marginBottom: 20 }}
          onClick={() => dispatch(submit('UserFormCc'))}
        />
      </div>
    </MuiThemeProvider>
  );
};

const mapStateToProps = (state) => ({
  form: state.form.UserFormCc,
  user: state.users.selectedUser,
});

export default _.flow([
  connect(mapStateToProps),
  reduxForm({
    form: 'UserFormCc',
    validate,
    destroyOnUnmount: false,
  }),
  withStyles(styles),
])(UserFormCc);
