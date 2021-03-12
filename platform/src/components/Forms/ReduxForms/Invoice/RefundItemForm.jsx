import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, submit } from 'redux-form';
import translations from '../../../../translations/i18next';
import MDButton from '../../../MDButton/MDButton';
import MDTextInputField from '../../FormComponents/MDTextInput/MDTextInputField';

const validate = (values) => {
  const errors = {};
  if (!values.amount) {
    errors.amount = translations.t('forms.required');
  }
  return errors;
};

const RefundItemForm = ({ currency, dispatch }) => {
  return (
    <div style={{ width: '100%', padding: 20 }}>
      <Field
        name="amount"
        component={MDTextInputField}
        label={`${translations.t('forms.invoiceItemValue')} ${currency}`}
        required
        type="number"
      />
      <MDButton
        title={translations.t('forms.save')}
        className="gradient-button"
        titleStyle={{ fontSize: 15 }}
        containerstyle={{ marginTop: 40 }}
        backgroundColor="#5AC0B1"
        onClick={() => dispatch(submit('RefundItemForm'))}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  refundItemForm: state.form.RefundItemForm,
});

export default connect(mapStateToProps)(
  reduxForm({
    form: 'RefundItemForm',
    validate,
  })(RefundItemForm)
);
