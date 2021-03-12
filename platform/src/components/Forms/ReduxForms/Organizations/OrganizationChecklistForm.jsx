import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, submit } from 'redux-form';
import * as CompaniesActions from '../../../../redux/actions/companies.actions';
import translations from '../../../../translations/i18next';
import MDButton from '../../../MDButton/MDButton';
import MDTextInputField from '../../FormComponents/MDTextInput/MDTextInputField';
import SelectableField from '../../FormComponents/SelectableInput/SelectableField';
import { featureFlag } from 'config/featureFlags';

const validate = (values) => {
  const errors = {};
  if (!values.url) {
    errors.url = translations.t('forms.required');
  } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(values.url)) {
    errors.url = translations.t('forms.required');
  }
  if (!values.title) {
    errors.title = translations.t('forms.required');
  }
  return errors;
};

class OrganizationChecklistForm extends React.Component {
  async onFilterSubcompanies(name) {
    const {
      companies: { selectedRootCompany },
      organizations: { selectedOrganization: organization },
    } = this.props;
    const filteredOptions = await CompaniesActions.fetchSubCompaniesOptions(name, selectedRootCompany, organization);
    const newOptions = _.map(filteredOptions, (company) => ({
      value: String(company.id), // workaround for creatable component
      label: company.name,
    }));
    return newOptions;
  }

  render() {
    const { dispatch } = this.props;
    const isB1Enabled = featureFlag.isFeatureEnabled('b1-new-company-structure');
    return (
      <div style={{ marginTop: 20, marginRight: 20, padding: 20 }}>
        <Field name="url" component={MDTextInputField} label="URL" multiple={false} required />
        <Field name="title" component={MDTextInputField} label={translations.t('company.titleChecklist')} multiple={false} required />
        <h4>{translations.t('company.makeChecklistAvailableCompany')}</h4>
        <Field
          name="compainesSelected"
          component={SelectableField}
          placeholder={isB1Enabled ? translations.t('company.companies') : translations.t('company.companiesOld')}
          multi
          containerstyle={{ marginTop: 20 }}
          onLoadOptions={(name) => this.onFilterSubcompanies(name)}
        />
        <MDButton
          title={translations.t('forms.save')}
          className="gradient-button"
          titleStyle={{ fontSize: 15 }}
          containerstyle={{ marginTop: 40 }}
          backgroundColor="#5AC0B1"
          onClick={() => dispatch(submit('OrganizationChecklistForm'))}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  companies: state.companies,
  organizations: state.organizations,
});

export default connect(mapStateToProps)(
  reduxForm({
    form: 'OrganizationChecklistForm',
    validate,
  })(OrganizationChecklistForm)
);
