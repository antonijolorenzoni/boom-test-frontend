import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, submit } from 'redux-form';
import translations from '../../../../translations/i18next';
import MDButton from '../../../MDButton/MDButton';
import MDSelectField from '../../FormComponents/MDSelectField/MDSelectField';
import MDTextInputField from '../../FormComponents/MDTextInput/MDTextInputField';
import { INVOICE_ITEMS_OPTIONS_TYPES } from '../../../../config/consts';

const validate = (values) => {
  const errors = {};
  if (!values.description) {
    errors.description = translations.t('forms.required');
  }
  if (!values.amount) {
    errors.amount = translations.t('forms.required');
  } else if (values.amount <= 0) {
    errors.amount = translations.t('forms.required');
  }
  if (!values.type) {
    errors.type = translations.t('forms.required');
  }
  return errors;
};

const InvoiceItemsForm = ({ currency, dispatch, invoiceItemsForm }) => {
  const currencySymbol = currency ? `(${currency.symbol})` : '';
  return (
    <div style={{ marginTop: 20, marginRight: 20, padding: 20 }}>
      <h4>{translations.t('invoice.newPenaltiesRefund')}</h4>
      <Field name="description" component={MDTextInputField} label={translations.t('forms.invoiceItemDescription')} required />

      <Field
        name="amount"
        component={MDTextInputField}
        label={`${translations.t('forms.invoiceItemValue')} ${currencySymbol}`}
        required
        type="number"
      />
      <Field
        title={translations.t('forms.invoiceItemType')}
        name="type"
        component={MDSelectField}
        containerstyle={{ marginBottom: 25 }}
        options={_.map(INVOICE_ITEMS_OPTIONS_TYPES, (type) => ({
          id: type,
          value: `${translations.t(`invoiceTypes.${type}`)}`,
        }))}
      />
      <MDButton
        title={translations.t('forms.save')}
        className="gradient-button"
        titleStyle={{ fontSize: 15 }}
        containerstyle={{ marginTop: 40 }}
        backgroundColor="#5AC0B1"
        onClick={() => dispatch(submit('InvoiceItemsForm'))}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  invoiceItemsForm: state.form.InvoiceItemsForm,
});

export default connect(mapStateToProps)(
  reduxForm({
    form: 'InvoiceItemsForm',
    validate,
  })(InvoiceItemsForm)
);
