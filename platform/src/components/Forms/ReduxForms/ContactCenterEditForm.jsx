import React from 'react';
import { useDispatch } from 'react-redux';
import { Field, reduxForm, submit } from 'redux-form';
import translations from 'translations/i18next';
import MDButton from 'components/MDButton/MDButton';
import MDSelectField from 'components/Forms/FormComponents/MDSelectField/MDSelectField';
import MDTextInputField from 'components/Forms/FormComponents/MDTextInput/MDTextInputField';
import { LANGUAGE_LOCAL_MAP } from 'config/consts';

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = 'required';
  }

  return errors;
};

const ContactCenterForm = ({ name }) => {
  const dispatch = useDispatch();

  return (
    <div style={{ margin: 20, marginLeft: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 40 }}>
        <h3 style={{ margin: 0, fontSize: 22 }}>{name}</h3>
      </div>
      <Field name="name" component={MDTextInputField} label={translations.t('forms.name')} required />
      <Field
        title={translations.t('languages.language')}
        name="language"
        component={MDSelectField}
        options={Object.values(LANGUAGE_LOCAL_MAP).map(({ translation, backend }) => ({
          id: backend,
          value: translations.t(`languages.${translation}`),
        }))}
        label={translations.t('forms.language')}
        required
      />
      <Field name="phoneNumber" component={MDTextInputField} label={translations.t('forms.phone')} type="number" />
      <MDButton
        title={translations.t('forms.saveChanges')}
        className="gradient-button"
        titleStyle={{ fontSize: 15 }}
        containerstyle={{ marginTop: 50 }}
        backgroundColor="#5AC0B1"
        onClick={() => dispatch(submit('ContactCenter'))}
      />
    </div>
  );
};

export default reduxForm({ form: 'ContactCenter', validate })(ContactCenterForm);
