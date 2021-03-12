import React, { useEffect, useMemo } from 'react';
import { withStyles } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { Field, reduxForm, submit, change } from 'redux-form';
import { Typography } from 'ui-boom-components';
import translations from '../../../../translations/i18next';
import MDButton from '../../../MDButton/MDButton';
import MDTextInputField from '../../FormComponents/MDTextInput/MDTextInputField';
import SelectableField from '../../FormComponents/SelectableInput/SelectableField';
import * as CompaniesActions from '../../../../redux/actions/companies.actions';
import { emailValidationRegexp, phoneValidationRegexp } from '../../../../utils/validations';
import { OrganizationTier, USER_ROLES } from 'config/consts';
import { featureFlag } from 'config/featureFlags';
import { Segment } from 'types/Segment';

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
  if (!_.isEmpty(values.phoneNumber) && !phoneValidationRegexp.test(values.phoneNumber)) {
    errors.phoneNumber = translations.t('forms.invalidPhone');
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

const NewUserForm = ({ companies, roles, classes }) => {
  const dispatch = useDispatch();

  const { selectedRootCompany, selectedOrganization, form } = useSelector((state) => ({
    selectedRootCompany: state.companies.selectedRootCompany,
    selectedOrganization: state.organizations.selectedOrganization,
    form: state.form.NewUserForm,
  }));

  const isB1Enabled = featureFlag.isFeatureEnabled('b1-new-company-structure');

  const onFilterRoles = async (name) => {
    const filteredOptions = _.filter(roles, (role) => {
      return translations.t(`roles.${role.name}`).toLowerCase().includes(name.toLowerCase());
    });

    const newOptions = _.map(filteredOptions, (role) => ({
      value: String(role.id), // workaround for creatable component
      label: translations.t(`roles.${role.name}`),
    }));
    return newOptions;
  };

  const onFilterSubcompanies = async (name) => {
    dispatch(CompaniesActions.setCompaniesFilter('name', name));
    const filteredOptions = await dispatch(CompaniesActions.fetchCompanies());
    const newOptions = _.map(filteredOptions, (company) => ({
      value: String(company.id), // workaround for creatable component
      label: company.name,
    }));
    return newOptions;
  };

  const isSmbCompany = isB1Enabled ? Segment.SMB === selectedOrganization.segment : selectedRootCompany.tier === OrganizationTier.SMB;

  const dropdownRoles = useMemo(
    () =>
      roles
        .filter((role) => (isSmbCompany ? role.name === USER_ROLES.ROLE_SMB : role.name !== USER_ROLES.ROLE_SMB))
        .map((role) => ({
          value: String(role.id),
          label: translations.t(`roles.${role.name}`),
        })),
    [isSmbCompany, roles]
  );

  const selectedRole = form.values.role ? _.find(roles, (role) => String(role.id) === form.values.role.value) : null;

  useEffect(() => {
    if (isSmbCompany) {
      const rootSmbCompany = companies[0];
      dispatch(change('NewUserForm', 'company', { value: String(rootSmbCompany.id), label: String(rootSmbCompany.name) }));
      dispatch(change('NewUserForm', 'role', dropdownRoles[0]));
    }
  }, [dispatch, isSmbCompany, companies, dropdownRoles]);

  return (
    <MuiThemeProvider theme={theme}>
      <h2 className={classes.headerTitle}>{translations.t('users.createNewUser')}</h2>
      <div className={classes.formContainer}>
        <Field name="email" component={MDTextInputField} label="Email" required multiline showErrorLabel />
        <Field name="firstName" component={MDTextInputField} label={translations.t('forms.firstName')} multiline required showErrorLabel />
        <Field name="lastName" component={MDTextInputField} label={translations.t('forms.lastName')} multiline required showErrorLabel />
        <Field name="jobTitle" component={MDTextInputField} label={translations.t('forms.jobTitle')} multiline />
        <Field
          name="phoneNumber"
          component={MDTextInputField}
          label={translations.t('forms.phone')}
          multiline
          type="number"
          showErrorLabel
        />
        <Divider />
        <h2 className={classes.title}>{translations.t('forms.userRole')}</h2>
        <h3 className={classes.subtitle}>{translations.t('forms.assignTheRole')}</h3>
        <Field
          name="company"
          component={SelectableField}
          placeholder={translations.t('forms.companyRolePlaceholder')}
          title={translations.t('forms.companyForRole')}
          mandatory
          containerstyle={{ marginTop: 20 }}
          titleContainerStyle={{ marginBottom: 0 }}
          onLoadOptions={onFilterSubcompanies}
          defaultOptions={_.map(companies, (company) => ({
            value: String(company.id), // workaround for creatable component
            label: company.name,
          }))}
          isDisabled={isSmbCompany}
        />
        <Field
          name="role"
          component={SelectableField}
          placeholder={translations.t('forms.companyRolePlaceholder')}
          title={translations.t('company.role')}
          mandatory
          containerstyle={{ marginTop: 20 }}
          titleContainerStyle={{ marginBottom: 0 }}
          onLoadOptions={onFilterRoles}
          defaultOptions={dropdownRoles}
          isDisabled={isSmbCompany}
        />
        {selectedRole && (
          <Typography variantName="body2" style={{ marginTop: 20 }}>
            {translations.t(`rolesDescriptions.${selectedRole.name}`)}
          </Typography>
        )}
        <MDButton
          title={translations.t('forms.save')}
          backgroundColor="#5AC0B1"
          containerstyle={{ marginBottom: 20 }}
          onClick={() => dispatch(submit('NewUserForm'))}
        />
      </div>
    </MuiThemeProvider>
  );
};

export default _.flow([
  reduxForm({
    form: 'NewUserForm',
    validate,
    initialValues: {},
    destroyOnUnmount: false,
  }),
  withStyles(styles),
])(NewUserForm);
