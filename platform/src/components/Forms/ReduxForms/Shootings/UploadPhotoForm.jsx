import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import ZipIcon from '../../../../assets/icons/zip-uploaded.svg';
import * as ModalsActions from '../../../../redux/actions/modals.actions';
import translations from '../../../../translations/i18next';
import FileDropZoneField from '../../FormComponents/FileDropZone/FileDropZoneField';
import MDTextInputField from '../../FormComponents/MDTextInput/MDTextInputField';

const validate = (values) => {
  const errors = {};
  if (!values.zipFile || _.isEmpty(values.zipFile)) {
    errors.zipFile = translations.t('forms.required');
  }
  return errors;
};

const theme = createMuiTheme({
  palette: {
    primary: { 500: '#5AC0B1' },
    secondary: { main: '#CC0033' },
  },
  typography: {
    useNextVariants: true,
  },
});

const UploadPhotoForm = ({ title, subtitle, dispatch, hideComments, onDeleteFile }) => (
  <MuiThemeProvider theme={theme}>
    <Field
      name="zipFile"
      component={FileDropZoneField}
      required
      multiple={false}
      accept=".zip"
      icon={<img src={ZipIcon} alt="zipFile" />}
      onDeleteFile={onDeleteFile ? () => onDeleteFile() : null}
      onDropRejected={() =>
        dispatch(
          ModalsActions.showModal('INVOICE_ITEM_DELETE_ERROR', {
            modalType: 'MODAL_DIALOG',
            modalProps: {
              title: translations.t('forms.warning'),
              bodyText: translations.t('forms.zipFormatError'),
              cancelText: translations.t('forms.close'),
            },
          })
        )
      }
      title={title}
      subtitle={subtitle}
    />
    {!hideComments && (
      <Field
        name="comments"
        component={MDTextInputField}
        label={translations.t('forms.commentUpload')}
        multiline
        rows="3"
        containerstyle={{ width: '100%', marginTop: 40 }}
      />
    )}
  </MuiThemeProvider>
);

const mapStateToProps = (state) => ({
  form: state.form.UploadPhotoForm,
  companies: state.companies,
});

export default _.flow([
  connect(mapStateToProps),
  reduxForm({
    form: 'UploadPhotoForm',
    validate,
  }),
])(UploadPhotoForm);
