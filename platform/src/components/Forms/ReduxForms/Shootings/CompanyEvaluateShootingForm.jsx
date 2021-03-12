import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import translations from '../../../../translations/i18next';
import MDStarRateField from '../../FormComponents/MDStarRateField/MDStarRateField';

const validate = (values) => {
  const errors = {};
  if (!values.evaluation) {
    errors.evaluation = translations.t('forms.required');
  }
  return errors;
};

const CompanyEvaluateShootingForm = ({ containerStyle }) => (
  <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10, ...containerStyle }}>
    <Field minimumValue={1} name="evaluation" component={MDStarRateField} />
  </div>
);

const mapStateToProps = (state) => ({
  form: state.form.CompanyEvaluateShootingForm,
});

export default _.flow([
  connect(mapStateToProps),
  reduxForm({
    form: 'CompanyEvaluateShootingForm',
    validate,
  }),
])(CompanyEvaluateShootingForm);
