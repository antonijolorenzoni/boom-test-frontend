import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import translations from '../../../../translations/i18next';
import MDTextInputField from '../../FormComponents/MDTextInput/MDTextInputField';

const validate = (values) => {
  const errors = {};
  if (!values.comment) {
    errors.comment = translations.t('forms.required');
  }
  return errors;
};

const BoomRefuseShootingForm = ({ containerStyle }) => (
  <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', marginTop: 10, ...containerStyle }}>
    <Field
      name="comment"
      component={MDTextInputField}
      placeholder={translations.t('forms.insertCommentRefuse')}
      label={translations.t('forms.commentRefuse')}
      multiline
      rows="3"
      containerstyle={{ width: '100%' }}
    />
  </div>
);

const mapStateToProps = (state) => ({
  form: state.form.BoomRefuseShootingForm,
});

export default _.flow([
  connect(mapStateToProps),
  reduxForm({
    form: 'BoomRefuseShootingForm',
    validate,
  }),
])(BoomRefuseShootingForm);
