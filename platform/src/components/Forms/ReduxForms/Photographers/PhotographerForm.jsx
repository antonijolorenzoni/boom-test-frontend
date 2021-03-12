import { Divider, withStyles } from '@material-ui/core';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import IconTrash from '@material-ui/icons/Delete';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, submit } from 'redux-form';

import { LANGUAGES_LONG } from 'config/consts';
import { emailValidationRegexp, phoneValidationRegexp } from 'utils/validations';
import translations from 'translations/i18next';
import MDButton from 'components/MDButton/MDButton';
import UserStatusView from 'components/UserStatusView/UserStatusView';
import MDSelectField from 'components/Forms/FormComponents/MDSelectField/MDSelectField';
import MDTextInputField from 'components/Forms/FormComponents/MDTextInput/MDTextInputField';
import MDCheckBoxGroupField from 'components/Forms/FormComponents/MDCheckBox/MDCheckBoxGroupField';
import Card from '@material-ui/core/Card';
import { MessageBox } from 'ui-boom-components';

const validate = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = translations.t('forms.required');
  } else if (!emailValidationRegexp.test(values.email)) {
    errors.email = translations.t('forms.invalidEmail');
  }
  if (!values.firstName) {
    errors.firstName = translations.t('forms.required');
  }
  if (!values.lastName) {
    errors.lastName = translations.t('forms.required');
  }
  if (!values.role || _.isEmpty(values.role)) {
    errors.role = translations.t('forms.required');
  }
  if (!values.company) {
    errors.company = translations.t('forms.required');
  }
  if (!values.photoTypes) {
    errors.photoTypes = translations.t('forms.required');
  }
  if (!values.phoneNumber) {
    errors.phoneNumber = translations.t('forms.required');
  } else if (!phoneValidationRegexp.test(values.phoneNumber)) {
    errors.phoneNumber = translations.t('forms.invalidPhone');
  }
  if (!values.language) {
    errors.language = translations.t('forms.required');
  }
  return errors;
};

const styles = (theme) => ({
  formContainer: {
    margin: 20,
    marginTop: 20,
  },
  title: {
    margin: 0,
    marginTop: 20,
  },
  headerTitle: {
    marginLeft: 20,
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
  statusContainer: {
    marginBottom: 20,
  },
  statusTag: {
    marginRight: 10,
    paddingLeft: 10,
    paddingRight: 10,
    color: 'white',
  },
  image: {
    objectFit: 'cover',
    height: 100,
    width: 100,
    borderRadius: 50,
    marginBottom: 20,
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

const PhotographerForm = ({
  classes,
  dispatch,
  photographer,
  onDeletePhotographer,
  onResendConfirmationEmail,
  photoTypes,
  canDelete,
  canEdit,
  canCreate,
  form,
}) => {
  const isFallbackAlertActive = [LANGUAGES_LONG.FRENCH, LANGUAGES_LONG.SPANISH].includes(_.get(form.values, 'language'));
  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.formContainer} style={{ marginTop: photographer ? 0 : 60 }}>
        {!photographer && <h4>{translations.t('photographers.createNewPhotographer')}</h4>}
        {photographer && photographer.picture && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Card className={classes.image}>
              <img alt="logo" className={classes.image} src={photographer.picture} />
            </Card>
          </div>
        )}
        <Field
          name="email"
          component={MDTextInputField}
          label="Email"
          required
          multiline
          disabled={photographer && !_.isEmpty(photographer)}
        />
        <Field
          name="firstName"
          component={MDTextInputField}
          label={translations.t('forms.firstName')}
          multiline
          required
          disabled={photographer && !_.isEmpty(photographer)}
        />
        <Field
          name="lastName"
          component={MDTextInputField}
          label={translations.t('forms.lastName')}
          multiline
          required
          disabled={photographer && !_.isEmpty(photographer)}
        />
        <Field name="phoneNumber" component={MDTextInputField} label={translations.t('forms.phone')} required />
        <h4 className={classes.title} style={{ marginBottom: 10 }}>
          {translations.t('forms.photoTypesPhotographer')}
        </h4>
        <Field
          name="photoTypes"
          containerstyle={{ marginTop: 10 }}
          options={_.map(photoTypes, (photoType) => ({ id: photoType.id, value: translations.t(`photoTypes.${photoType.type}`) }))}
          component={MDCheckBoxGroupField}
          showErrorLabel
          horizontal
        />
        {(!photographer || _.isEmpty(photographer)) && (
          <Field
            title={translations.t('languages.language')}
            name="language"
            component={MDSelectField}
            disabled={photographer && !_.isEmpty(photographer) && !canEdit}
            options={[
              {
                id: 'ITALIAN',
                value: translations.t('languages.it'),
              },
              {
                id: 'ENGLISH',
                value: translations.t('languages.en'),
              },
              {
                id: 'FRENCH',
                value: translations.t('languages.fr'),
              },
              {
                id: 'SPANISH',
                value: translations.t('languages.es'),
              },
            ]}
            label={translations.t('forms.language')}
            required
            containerstyle={{ marginBottom: 40 }}
          />
        )}
        {(!photographer || _.isEmpty(photographer)) && isFallbackAlertActive && (
          <div style={{ marginBottom: 50 }}>
            <MessageBox title={translations.t('languages.fallbackAlertBOOM')} type="generic" />
          </div>
        )}
        {photographer && !_.isEmpty(photographer) && (
          <UserStatusView
            classes={classes}
            isEnabled={photographer && photographer.user.enabled}
            onResendConfirmationEmail={() => onResendConfirmationEmail()}
          />
        )}
        {photographer && !_.isEmpty(photographer) && canDelete && (
          <div>
            <h2 className={classes.title}>{translations.t('forms.deleteUser')}</h2>
            <h3 className={classes.subtitle}>{translations.t('forms.deleteUserExplanation')}</h3>
            <MDButton
              icon={<IconTrash />}
              title={translations.t('forms.deleteUser')}
              containerstyle={{ marginBottom: 20 }}
              onClick={() => onDeletePhotographer()}
            />
            <Divider />
          </div>
        )}
        {(canEdit || canCreate) && (
          <MDButton
            title={translations.t('forms.save')}
            backgroundColor="#5AC0B1"
            containerstyle={{ marginBottom: 20 }}
            onClick={() => dispatch(submit('PhotographerForm'))}
          />
        )}
      </div>
    </MuiThemeProvider>
  );
};

const mapStateToProps = (state) => ({
  form: state.form.PhotographerForm,
  companies: state.companies,
});

PhotographerForm.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  dispatch: PropTypes.func.isRequired,
  photographer: PropTypes.shape({}).isRequired,
  onDeletePhotographer: PropTypes.func.isRequired,
  onResendConfirmationEmail: PropTypes.func.isRequired,
};

export default _.flow([
  connect(mapStateToProps),
  reduxForm({
    form: 'PhotographerForm',
    validate,
    destroyOnUnmount: false,
  }),
  withStyles(styles),
])(PhotographerForm);
