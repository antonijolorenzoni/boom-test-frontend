import React, { useCallback, useState } from 'react';
import { rawExtensions } from 'config/consts';
import { Button, Typography, TextArea, MessageBox, Dropdown } from 'ui-boom-components';
import { FileUpload, UploadStatus } from 'components/common/FileUpload';
import { useTranslation } from 'react-i18next';
import { useModal } from 'hook/useModal';
import { Modal } from 'components/Modals';
import { InfoPoint } from 'components/InfoPoint';
import { primaryColor } from 'components/common/colors';
import { Option } from 'types/Option';
import { logNumberOfFiles } from 'utils/logger';

interface Props {
  orderCode: string;
  onCompleteUpload: (comment: string, reasonCode?: string, reasonText?: string) => void;
  uploadPhotosSubTitle: string;
  uploadReleaseFormSubTitle: string;
  minFilesToConfirm?: number;
  minFilesForWarning?: number;
  requiredFiles?: number;
  maxFiles?: number;
  reasons?: (Option<string> & { requiresText: boolean })[];
}

export const UploadSection: React.FC<Props> = ({
  orderCode,
  onCompleteUpload,
  uploadPhotosSubTitle,
  uploadReleaseFormSubTitle,
  minFilesToConfirm = 1,
  minFilesForWarning = 1,
  requiredFiles = Infinity,
  maxFiles = Infinity,
  reasons = [],
}) => {
  const { t } = useTranslation();

  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  const [photosUploadStatus, setPhotosUploadStatus] = useState(UploadStatus.None);
  const [releaseFormsUploadStatus, setReleaseFormsUploadStatus] = useState(UploadStatus.None);

  const [isUploadPhotosComplete, setUploadPhotosComplete] = useState(false);
  const [isUploadPhotosLoading, setUploadPhotosLoading] = useState(false);
  const [isUploadReleaseFormLoading, setUploadReleaseFormLoading] = useState(false);
  const [selectedReason, setSelectedReason] = useState<(Option<string> & { requiresText: boolean }) | null>(null);
  const [textReason, setTextReason] = useState('');
  const [fileNumber, setFileNumber] = useState<{ photo: number; releaseForm: number }>({ photo: 0, releaseForm: 0 });

  const updatePhotoNumber = useCallback(
    (photoNumber: number) => setFileNumber((fileNumber) => ({ ...fileNumber, photo: photoNumber })),
    []
  );

  const updateReleaseFormNumber = useCallback(
    (releaseFormNumber: number) => setFileNumber((fileNumber) => ({ ...fileNumber, releaseForm: releaseFormNumber })),
    []
  );

  const completeUpload = ({
    additionalNotes,
    selectedReason,
    textReason,
  }: {
    additionalNotes: string;
    selectedReason?: string;
    textReason?: string;
  }) => {
    logNumberOfFiles({ orderCode, photoNumber: fileNumber.photo, releaseFormNumber: fileNumber.releaseForm });
    onCompleteUpload(additionalNotes, selectedReason, textReason);
  };

  const { openModal, onClose } = useModal();

  const uploadStatusToMessage: Map<UploadStatus, React.ReactNode> = new Map([
    [
      UploadStatus.UploadFailed,
      <MessageBox title={t('views.refused.filesNotUploaded')} subTitle={t('views.refused.filesNotUploadedSub')} type="error" />,
    ],
    [
      UploadStatus.InvalidNumber,
      <MessageBox title={t('views.refused.numberFileLower')} subTitle={t('views.refused.numberFileLowerSub')} type="warning" />,
    ],
    [UploadStatus.CorrectNumber, <MessageBox title={t('views.refused.correctNumberOfFiles')} type="success" />],
    [UploadStatus.None, null],
  ]);

  const isConfirmButtonDisabled = !isUploadPhotosComplete || isUploadPhotosLoading || isUploadReleaseFormLoading;

  return (
    <>
      <div style={{ display: 'flex', marginTop: 25 }}>
        <Typography variantName="body1">{`${t('views.accepted.uploadYourPhotos')} ${
          maxFiles !== Infinity
            ? t('views.accepted.maxFilesNumber', {
                maxFiles,
              })
            : ''
        }`}</Typography>
        <InfoPoint iconColor={primaryColor} style={{ marginLeft: 4 }} onClick={() => openModal('uploadInfo')} />
      </div>
      <Typography variantName="caption2" style={{ marginBottom: 10 }}>
        {uploadPhotosSubTitle}
      </Typography>
      <div style={{ marginBottom: 26 }}>
        <FileUpload
          orderCode={orderCode}
          mimeTypeWhiteList={rawExtensions.map((fileExtension) => `.${fileExtension}`)}
          size="default"
          type="RAW"
          onSetLoading={setUploadPhotosLoading}
          onSetCompleted={setUploadPhotosComplete}
          onStatusChanged={setPhotosUploadStatus}
          minItemsToConfirm={minFilesToConfirm}
          minItemsForWarning={minFilesForWarning}
          requiredItems={requiredFiles}
          maxItems={maxFiles}
          onFileNumberChange={updatePhotoNumber}
        />
        <div style={{ marginTop: 2 }}>{uploadStatusToMessage.get(photosUploadStatus)}</div>
      </div>
      <Typography variantName="body1">{t('views.refused.releaseForm')}</Typography>
      <Typography variantName="caption2" style={{ marginBottom: 10 }}>
        {uploadReleaseFormSubTitle}
      </Typography>
      <div style={{ marginBottom: 30 }}>
        <FileUpload
          orderCode={orderCode}
          mimeTypeWhiteList={['application/pdf']}
          size="small"
          type="RELEASE_FORM"
          onSetLoading={setUploadReleaseFormLoading}
          onStatusChanged={setReleaseFormsUploadStatus}
          onFileNumberChange={updateReleaseFormNumber}
        />
        <div style={{ marginTop: 2 }}>{uploadStatusToMessage.get(releaseFormsUploadStatus)}</div>
      </div>
      <TextArea
        placeholder={t('views.refused.additionalNotes').toUpperCase()}
        style={{ marginBottom: 38 }}
        value={additionalNotes}
        onChange={(input) => setAdditionalNotes(input.target.value)}
      />
      <Button
        size="medium"
        style={{ margin: 'auto', marginBottom: 39 }}
        disabled={isConfirmButtonDisabled}
        onClick={() =>
          [UploadStatus.CorrectNumber, UploadStatus.None].includes(photosUploadStatus)
            ? completeUpload({ additionalNotes })
            : openModal('selectReason')
        }
      >
        {t('views.refused.confirmUpload')}
      </Button>
      <Modal id="selectReason" style={{ width: 500, overflow: 'initial' }}>
        <MessageBox title={t('views.refused.numberFileLower')} subTitle={t('general.weNeedYourFeedback')} type={'warning'} />
        <div style={{ marginTop: 10 }}>
          <Dropdown
            placeholder={t('general.chooseAReason')}
            value={selectedReason}
            options={reasons
              .map((reason) => ({ ...reason, color: reason.requiresText ? '#5AC0B1' : '#000000' }))
              .sort((l, r) => Number(l.requiresText) - Number(r.requiresText))}
            onChange={setSelectedReason}
          />
        </div>
        {selectedReason?.requiresText && (
          <div>
            <TextArea value={textReason} onChange={(e: any) => setTextReason(e.target.value)} showError={false} />
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
          <Button
            onClick={() => {
              selectedReason &&
                completeUpload({ additionalNotes, selectedReason: selectedReason?.value, textReason: textReason || undefined });
              onClose('selectReason');
            }}
            disabled={selectedReason === null || (selectedReason.requiresText && textReason.length === 0)}
          >
            {t('general.confirmAndSubmit')}
          </Button>
        </div>
      </Modal>
      <Modal id="uploadInfo" style={{ width: 500, overflow: 'initial' }}>
        <Typography variantName="body1" textColor="#000">
          {t('views.refused.uploadYourPhotos')}
        </Typography>
        <ul>
          {(t('views.refused.uploadInfo', { returnObjects: true }) as Array<string>).map((info, i) => (
            <li key={i}>
              <Typography variantName="caption" textColor="#000">
                {info}
              </Typography>
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button onClick={() => onClose('uploadInfo')}>{t('general.ok')}</Button>
        </div>
      </Modal>
    </>
  );
};
