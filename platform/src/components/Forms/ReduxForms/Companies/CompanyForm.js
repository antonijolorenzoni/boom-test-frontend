import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { change, Field, reduxForm, submit } from 'redux-form';
import translations from '../../../../translations/i18next';
import MDButton from '../../../MDButton/MDButton';
import * as ModalsActions from '../../../../redux/actions/modals.actions';
import FileDropZoneField from '../../FormComponents/FileDropZone/FileDropZoneField';
import MDSelectField from '../../FormComponents/MDSelectField/MDSelectField';
import MDTextInputField from '../../FormComponents/MDTextInput/MDTextInputField';
import MDCheckBoxGroupField from '../../FormComponents/MDCheckBox/MDCheckBoxGroupField';

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = 'required';
  }
  if (!values.photoTypes) {
    errors.photoTypes = translations.t('forms.required');
  }
  return errors;
};

const CompanyForm = ({ company, photoTypes, dispatch }) => (
  <div style={{ margin: 20, marginLeft: 20 }}>
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 40 }}>
      {company && company.logo && (
        <img alt="logo" style={{ objectFit: 'contain', height: 50, borderRadius: 10, marginRight: 20 }} src={company && company.logo} />
      )}
      <h3 style={{ margin: 0, fontSize: 22 }}>{(company && company.name) || translations.t('company.newCompany')}</h3>
    </div>
    <Field name="name" component={MDTextInputField} label={translations.t('forms.companyName')} required />
    <Field
      name="logo"
      title="LOGO"
      preview={company && company.logo}
      multiple={false}
      accept={['image/*', '.raw', '.tif']}
      component={FileDropZoneField}
      onFileRejected={() =>
        dispatch(
          ModalsActions.showModal('FILE_TOO_LARGE', {
            modalType: 'ERROR_ALERT',
            modalProps: {
              message: translations.t('forms.fileTooLarge'),
            },
          })
        )
      }
      onDeleteFile={() => dispatch(change('CompanyForm', 'logo', null))}
      containerstyle={{ marginBottom: 50 }}
    />
    <Field
      name="phoneNumber"
      component={MDTextInputField}
      label={translations.t('forms.phone')}
      type="number"
      containerstyle={{ marginBottom: 40 }}
    />
    <Field
      title={translations.t('languages.language')}
      name="language"
      component={MDSelectField}
      options={[
        {
          id: 'ITALIAN',
          value: translations.t('languages.it'),
        },
        {
          id: 'ENGLISH',
          value: translations.t('languages.en'),
        },
      ]}
      label={translations.t('forms.language')}
      required
      containerstyle={{ marginBottom: 40 }}
    />
    <Field
      name="photoTypes"
      title={translations.t('forms.photoTypes')}
      containerstyle={{ marginLeft: 10 }}
      options={_.map(photoTypes, (photoType) => ({ id: photoType.id, value: translations.t(`photoTypes.${photoType.type}`) }))}
      component={MDCheckBoxGroupField}
      showErrorLabel
      mandatory
      horizontal
    />
    <MDButton
      title={company && !_.isEmpty(company) ? translations.t('forms.saveChanges') : translations.t('forms.save')}
      className="gradient-button"
      titleStyle={{ fontSize: 15 }}
      containerstyle={{ marginTop: 50 }}
      backgroundColor="#5AC0B1"
      onClick={() => dispatch(submit('CompanyForm'))}
    />
  </div>
);

export default connect()(
  reduxForm({
    form: 'CompanyForm',
    validate,
  })(CompanyForm)
);
