import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, submit } from 'redux-form';
import translations from '../../../../translations/i18next';
import MDButton from '../../../MDButton/MDButton';
import MDTextInputField from '../../FormComponents/MDTextInput/MDTextInputField';

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = translations.t('forms.required');
  }
  return errors;
};

const OrganizationServiceForm = ({ dispatch }) => (
  <div style={{ marginTop: 20, marginRight: 20, padding: 20 }}>
    <h4 style={{ fontWeight: 100 }}>{translations.t('company.newServiceDescription')}</h4>
    <Field name="name" component={MDTextInputField} label={translations.t('company.serviceName')} required />
    <MDButton
      title={translations.t('forms.save')}
      className="gradient-button"
      titleStyle={{ fontSize: 15 }}
      containerstyle={{ marginTop: 40 }}
      backgroundColor="#5AC0B1"
      onClick={() => dispatch(submit('OrganizationServiceForm'))}
    />
  </div>
);

const mapStateToProps = (state) => ({
  companies: state.companies,
  organizations: state.organizations,
});

export default connect(mapStateToProps)(
  reduxForm({
    form: 'OrganizationServiceForm',
    validate,
  })(OrganizationServiceForm)
);
