import { withStyles } from '@material-ui/core';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import WarningIcon from '@material-ui/icons/Warning';
import { Typography } from 'ui-boom-components';
import { Field, reduxForm, submit } from 'redux-form';
import * as CompaniesActions from '../../../../redux/actions/companies.actions';
import translations from '../../../../translations/i18next';
import SelectableField from '../../FormComponents/SelectableInput/SelectableField';
import MDButton from '../../../MDButton/MDButton';

const styles = (theme) => ({
  formContainer: {
    margin: 20,
  },
  title: {
    margin: 0,
  },
  subtitle: {
    margin: 0,
    marginBottom: 10,
  },
  warningContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  warningIcon: {
    marginRight: 10,
    color: '#FF8A80',
  },
  permissionDescription: {
    fontWeight: '100',
  },
});

const validate = (values) => {
  const errors = {};
  if (!values.role) {
    errors.role = translations.t('forms.required');
  }
  if (!values.company) {
    errors.company = translations.t('forms.required');
  }
  return errors;
};

class UserRolesForm extends React.Component {
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(CompaniesActions.resetCompaniesFilters());
  }

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
    const filteredOptions = await dispatch(CompaniesActions.fetchSubCompanies());
    const newOptions = _.map(filteredOptions, (company) => ({
      value: String(company.id), // workaround for creatable component
      label: company.name,
    }));
    return newOptions;
  }

  render() {
    const {
      roles,
      form,
      classes,
      dispatch,
      user,
      companies: {
        data: { content: companies },
      },
    } = this.props;
    const selectedRole = form && form.values && form.values.role && _.find(roles, (role) => String(role.id) === form.values.role.value);
    const canCreate = user && !_.isEmpty(user);
    return (
      <div className={classes.formContainer}>
        {!canCreate ? (
          <div className={classes.warningContainer}>
            <WarningIcon className={classes.warningIcon} />
            <h3 className={classes.title} style={{ color: '#FF8A80' }}>
              {translations.t('forms.createUserBeforeRole')}
            </h3>
          </div>
        ) : (
          <h3 className={classes.subtitle}>{translations.t('forms.newAccessRule')}</h3>
        )}
        <h4 style={{ fontWeight: 100, marginTop: 5 }}>{translations.t('forms.accessRuleDescription')}</h4>
        <Field
          name="company"
          component={SelectableField}
          placeholder={translations.t('forms.companyRolePlaceholder')}
          title={translations.t('forms.companyForRole')}
          mandatory
          containerstyle={{ marginBottom: 15 }}
          titleContainerStyle={{ marginBottom: 0 }}
          isDisabled={!canCreate}
          onLoadOptions={(name) => this.onFilterSubcompanies(name)}
          defaultOptions={_.map(companies, (company) => ({
            value: String(company.id), // workaround for creatable component
            label: company.name,
          }))}
        />
        <Field
          name="role"
          component={SelectableField}
          placeholder={translations.t('forms.companyRolePlaceholder')}
          title={translations.t('company.role')}
          mandatory
          containerstyle={{ marginBottom: 15 }}
          titleContainerStyle={{ marginBottom: 0 }}
          isDisabled={!canCreate}
          onLoadOptions={(name) => this.onFilterRoles(name)}
          defaultOptions={_.map(roles, (role) => ({
            value: String(role.id), // workaround for creatable component
            label: translations.t(`roles.${role.name}`),
            permissions: role.permission,
          }))}
        />
        {selectedRole && (
          <Typography variantName="body2" style={{ marginTop: 20 }}>
            {translations.t(`rolesDescriptions.${selectedRole.name}`)}
          </Typography>
        )}
        <MDButton
          disabled={!canCreate}
          title={translations.t('forms.save')}
          backgroundColor="#5AC0B1"
          containerstyle={{ marginBottom: 20 }}
          onClick={() => dispatch(submit('UserRolesForm'))}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  form: state.form.UserRolesForm,
  companies: state.companies,
});

export default _.flow([
  connect(mapStateToProps),
  reduxForm({
    form: 'UserRolesForm',
    validate,
  }),
  withStyles(styles),
])(UserRolesForm);
