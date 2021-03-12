import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import _ from 'lodash';
import styled from 'styled-components';
import { Field, reduxForm } from 'redux-form';
import * as ModalsActions from '../../../../redux/actions/modals.actions';
import ZipIcon from '../../../../assets/icons/zip-uploaded.svg';
import translations from '../../../../translations/i18next';
import FileDropZoneField from '../../FormComponents/FileDropZone/FileDropZoneField_RESTYLED';
import StarRateField from '../../FormComponents/StarRateView/StarRateField';
import { TextAreaField } from '../../FormComponents/TextAreaField';
import { submit, change } from 'redux-form';
import { Button, Typography } from 'ui-boom-components';
import { DownloadLink } from 'components/Shooting/DownloadLink';

const StarsRow = styled.div`
  display: flex;
  align-items: center;

  & div {
    flex-basis: 50%;
  }

  @media screen and (max-width: 1080px) {
    flex-direction: column;
    flex-basis: 100%;
    align-items: flex-start;
  }
`;

const DropzoneWrapper = styled.div`
  width: 50%;

  @media screen and (max-width: 1080px) {
    width: 100%;
  }
`;

const download = (url, title, onError) => {
  fetch(url)
    .then((resp) => {
      if (resp.status < 300) {
        return resp.blob();
      }
      throw new Error();
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch(onError);
};

const checkFormCompleted = ({ zipFile, ...evaluations }, extEditorPhotosDownloadable) => {
  const fullEvaluations = Object.values(evaluations).every((value) => value > 0);
  const isZipFilled = !extEditorPhotosDownloadable && !_.isEmpty(zipFile);

  return fullEvaluations && isZipFilled;
};

const BoomCompleteShootingForm = ({
  disabled,
  color,
  form,
  showErrorDialog,
  clearUploadedFile,
  submitForm,
  downloadLink,
  isDownloadLinkActive,
  code,
  isExternalEditing,
}) => {
  const [extEditorPhotosDownloadable, setExtEditorPhotosDownloadable] = useState(isDownloadLinkActive);

  const isFormCompleted = checkFormCompleted(_.omit(form.values, 'uploadNotes'), extEditorPhotosDownloadable);

  const dispatch = useDispatch();

  const onErrorDownloading = () =>
    dispatch(
      ModalsActions.showModal('DOWNLOAD_POST_PROSUCED_PHOTOS_ERROR', {
        modalType: 'ERROR_ALERT',
        modalProps: {
          message: translations.t('boomCompleteShootingForm.errorDownloadingPostProducedAlert'),
        },
      })
    );

  return (
    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
      <span style={{ fontSize: 17, fontWeight: 500, opacity: disabled ? '50%' : '100%' }}>
        {translations.t('shootings.evaluatePhotographerCompleted')}
      </span>
      <StarsRow style={{ marginTop: 25, marginBottom: 2 }}>
        <Field
          name="accuracy"
          title={translations.t('shootingBoomEvaluations.accuracy')}
          component={StarRateField}
          color={color}
          disabled={disabled}
        />
        <Field
          name="composition"
          title={translations.t('shootingBoomEvaluations.composition')}
          component={StarRateField}
          color={color}
          disabled={disabled}
        />
      </StarsRow>
      <StarsRow style={{ marginBottom: 25 }}>
        <Field
          name="equipment"
          title={translations.t('shootingBoomEvaluations.equipment')}
          component={StarRateField}
          color={color}
          disabled={disabled}
        />
        <Field
          name="technique"
          title={translations.t('shootingBoomEvaluations.technique')}
          component={StarRateField}
          color={color}
          disabled={disabled}
        />
      </StarsRow>
      <div style={{ marginBottom: 14 }}>
        <span style={{ fontSize: 17, fontWeight: 500, opacity: disabled ? '50%' : '100%' }}>
          {translations.t('shootings.uploadPostProducedPhotos')}
        </span>
        {isExternalEditing && (
          <Typography variantName="caption">{translations.t('boomCompleteShootingForm.inThisBoxYouCanDownload')}</Typography>
        )}
      </div>
      <DropzoneWrapper style={{ cursor: disabled ? 'no-drop' : 'pointer', opacity: disabled ? '50%' : '100%' }}>
        {extEditorPhotosDownloadable ? (
          <div style={{ marginBottom: 21 }}>
            <DownloadLink
              filename={`${code}.zip`}
              color={color}
              onDownload={() => download(downloadLink, `${code}.zip`, onErrorDownloading)}
              onRemoveFile={() => {
                setExtEditorPhotosDownloadable(false);
              }}
            />
          </div>
        ) : (
          <Field
            name="zipFile"
            component={FileDropZoneField}
            required
            multiple={false}
            accept=".zip"
            icon={<img src={ZipIcon} alt="zipFile" />}
            body={translations.t('forms.shootingDropzonePlaceholderBody')}
            color={color}
            onRemoveFile={clearUploadedFile}
            onDropRejected={showErrorDialog}
            disabled={disabled}
          />
        )}
      </DropzoneWrapper>
      <span style={{ fontSize: 17, fontWeight: 500, opacity: disabled ? '50%' : '100%', marginBottom: 5 }}>
        {translations.t('forms.commentUpload')}
      </span>
      <Field name="uploadNotes" id="uploadNotes" rows={3} component={TextAreaField} containerStyle={{ marginTop: 4 }} disabled={disabled} />
      <div style={{ display: 'flex', marginTop: 6, marginBottom: 20 }}>
        <Button size="small" backgroundColor="#5AC0B1" onClick={submitForm} disabled={!isFormCompleted || disabled}>
          {translations.t('shootings.markShootingComplete')}
        </Button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  form: state.form.BoomCompleteShootingForm,
});

const mapDispatchToProps = (dispatch) => ({
  showErrorDialog: () =>
    dispatch(
      ModalsActions.showModal('INVOICE_ITEM_DELETE_ERROR', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          title: translations.t('forms.warning'),
          bodyText: translations.t('forms.zipFormatError'),
          cancelText: translations.t('forms.close'),
        },
      })
    ),
  clearUploadedFile: () => dispatch(change('BoomCompleteShootingForm', 'zipFile', null)),
  submitForm: () => dispatch(submit('BoomCompleteShootingForm')),
});

export default _.flow([
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'BoomCompleteShootingForm',
    initialValues: {
      accuracy: 0,
      composition: 0,
      equipment: 0,
      technique: 0,
      zipFile: null,
      uploadNotes: '',
    },
  }),
])(BoomCompleteShootingForm);
