import { withStyles } from '@material-ui/core';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, submit } from 'redux-form';
import translations from '../../../../translations/i18next';
import MDButton from '../../../MDButton/MDButton';
import MDTextInputField from '../../FormComponents/MDTextInput/MDTextInputField';
import * as CompaniesActions from '../../../../redux/actions/companies.actions';
import { emailValidationRegexp } from '../../../../utils/validations';
import MDSelectField from 'components/Forms/FormComponents/MDSelectField/MDSelectField';
import { LANGUAGE_LOCAL_MAP } from 'config/consts';

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
  if (!values.role || _.isEmpty(values.role)) {
    errors.role = translations.t('forms.required');
  }
  if (!values.company) {
    errors.company = translations.t('forms.required');
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
    marginLeft: 10,
    marginBottom: 20,
  },
  statusTag: {
    marginRight: 10,
    paddingLeft: 10,
    paddingRight: 10,
    color: 'white',
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

class NewUserCcForm extends React.Component {
  async onFilterRoles(name) {
    const { roles } = this.props;
    const filteredOptions = _.filter(roles, (role) => {
      return translations.t(`roles.${role.name}`).toLowerCase().includes(name.toLowerCase());
    });
    const newOptions = _.map(filteredOptions, (role) => ({
      value: String(role.id), // workaround for creatable component
      label: translations.t(`roles.${role.name}`),
    }));
    return newOptions;
  }

  async onFilterSubcompanies(name) {
    const { dispatch } = this.props;
    dispatch(CompaniesActions.setCompaniesFilter('name', name));
    const filteredOptions = await dispatch(CompaniesActions.fetchCompanies());
    const newOptions = _.map(filteredOptions, (company) => ({
      value: String(company.id), // workaround for creatable component
      label: company.name,
    }));
    return newOptions;
  }

  render() {
    const { classes, dispatch, user } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <h2 className={classes.headerTitle}>{translations.t('users.createNewUser')}</h2>
        <div className={classes.formContainer}>
          <Field name="email" component={MDTextInputField} label="Email" required multiline disabled={user && !_.isEmpty(user)} />
          <Field name="firstName" component={MDTextInputField} label={translations.t('forms.firstName')} multiline required />
          <Field name="lastName" component={MDTextInputField} label={translations.t('forms.lastName')} multiline required />
          <Field
            title={translations.t('languages.language')}
            name="language"
            component={MDSelectField}
            options={Object.values(LANGUAGE_LOCAL_MAP).map(({ translation, backend }) => ({
              id: backend,
              value: translations.t(`languages.${translation}`),
            }))}
            label={translations.t('forms.language')}
            required
          />
          <MDButton
            title={translations.t('forms.save')}
            backgroundColor="#5AC0B1"
            containerstyle={{ marginBottom: 20 }}
            onClick={() => dispatch(submit('NewUserCcForm'))}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = (state) => ({
  form: state.form.NewUserCcForm,
  companies: state.companies,
});

export default _.flow([
  connect(mapStateToProps),
  reduxForm({
    form: 'NewUserCcForm',
    validate,
    destroyOnUnmount: false,
  }),
  withStyles(styles),
])(NewUserCcForm);
