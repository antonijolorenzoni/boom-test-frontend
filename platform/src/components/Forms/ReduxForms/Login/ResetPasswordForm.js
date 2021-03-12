import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import MDTextInputField from '../../FormComponents/MDTextInput/MDTextInputField';
import { emailValidationRegexp } from '../../../../utils/validations';

const validate = (values) => {
  const errors = {};
  if (!values.username) {
    errors.username = 'required';
  } else if (!emailValidationRegexp.test(values.username)) {
    errors.username = 'required';
  }
  return errors;
};

const ResetPasswordForm = (props) => (
  <div style={{ marginRight: 20 }}>
    <Field
      name="username"
      component={MDTextInputField}
      placeholder="Insert text here.."
      label="Email"
      required
      multiline
      containerstyle={{ marginTop: 20 }}
    />
  </div>
);

export default connect()(
  reduxForm({
    form: 'ResetPasswordForm',
    validate,
  })(ResetPasswordForm)
);
