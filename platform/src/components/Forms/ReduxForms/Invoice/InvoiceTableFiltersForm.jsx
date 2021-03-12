import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, submit } from 'redux-form';
import { getYearsList } from '../../../../config/utils';
import translations from '../../../../translations/i18next';
import MDButton from '../../../MDButton/MDButton';
import MDSelectField from '../../FormComponents/MDSelectField/MDSelectField';

const validate = (values) => {
  const errors = {};
  if (!values.description) {
    errors.description = translations.t('forms.required');
  }
  if (!values.currencyId) {
    errors.currencyId = translations.t('forms.required');
  }
  if (!values.amount) {
    errors.amount = translations.t('forms.required');
  }
  if (!values.type) {
    errors.type = translations.t('forms.required');
  }
  return errors;
};

const yearsOptions = getYearsList();

const InvoiceTableFiltersForm = ({ dispatch, onResetFilters }) => {
  return (
    <div style={{ display: 'flex', marginBottom: 20 }}>
      <Field
        title={translations.t('forms.month')}
        name="month"
        component={MDSelectField}
        containerstyle={{ width: '20%', marginRight: 20 }}
        options={_.map(moment.months(), (monthString) => ({
          id: moment()
            .month(monthString)
            .format('M'),
          value: monthString,
        }))}
      />
      <Field
        title={translations.t('forms.year')}
        name="year"
        containerstyle={{ width: '15%', marginRight: 20 }}
        component={MDSelectField}
        options={_.map(yearsOptions, (year) => ({
          id: year,
          value: year,
        }))}
      />
      <MDButton
        title={translations.t('forms.search')}
        className="gradient-button"
        containerstyle={{ marginRight: 20 }}
        backgroundColor="#5AC0B1"
        onClick={() => dispatch(submit('InvoiceTableFiltersForm'))}
      />
      <MDButton title="X" className="gradient-button" onClick={() => onResetFilters()} />
    </div>
  );
};

const mapStateToProps = (state) => ({
  invoiceTableFiltersForm: state.form.InvoiceTableFiltersForm,
});

export default connect(mapStateToProps)(
  reduxForm({
    form: 'InvoiceTableFiltersForm',
    validate,
  })(InvoiceTableFiltersForm)
);
