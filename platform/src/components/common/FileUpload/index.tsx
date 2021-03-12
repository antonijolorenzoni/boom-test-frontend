import { Modal } from 'components/Modals';
import { useOrderFiles } from 'hook/orders/useOrderFiles';
import { useModal } from 'hook/useModal';
import React, { useState, useEffect } from 'react';
import Dropzone, { DropFileEventHandler } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FileType } from 'types/orders/OrderFileUploadRequest';
import { Accordion, Typography } from 'ui-boom-components';
import { neutralDarkGray, neutralLightGrey, productAccepted, warning, white, error } from '../colors';
import { FileUploadProgress, Status } from '../FileUploadProgress';
import { UploadingSummary } from '../UploadingSummary';
import { ErrorPanel } from './ErrorPanel';
import { InfoPanel } from 'components/Modals/Panels/InfoPanel';
import { logExceededFilesNumber } from 'utils/logger';

export enum UploadStatus {
  UploadFailed = 'UploadFailed',
  InvalidNumber = 'InvalidNumber',
  CorrectNumber = 'CorrectNumber',
  None = 'None',
}

interface Props {
  orderCode: string;
  minItemsToConfirm?: number;
  minItemsForWarning?: number;
  requiredItems?: number;
  maxItems?: number;
  mimeTypeWhiteList: string[];
  size: 'default' | 'small';
  type: FileType;
  onStatusChanged?: (status: UploadStatus) => void;
  onSetLoading?: (loading: boolean) => void;
  onSetCompleted?: (completed: boolean) => void;
  onFileNumberChange: (photoNumber: number) => void;
  style?: React.CSSProperties;
}

const Wrapper = styled.div`
  width: 100%;
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='5' ry='5' stroke='%23A3ABB1FF' stroke-width='1' stroke-dasharray='4' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e");
  border-radius: 5px;
  padding: 2px;
`;

const DivCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MessageArea = styled.div<{ height: number }>`
  height: ${({ height }) => height}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DropzoneStyled = styled(Dropzone)<{ dropzoneColor: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ dropzoneColor }) => dropzoneColor};
  height: 100%;
  width: 100%;
  height: ${({ height }) => height}px;
`;

export const isFile = (f: File | RemoteFile): f is File => {
  return (f as File).type !== undefined;
};

export interface RemoteFile {
  name: string;
  size: number;
}

export interface FileUpload {
  file: File | RemoteFile;
  load: number;
  failed: boolean;
  completed: boolean;
}

const totalLoad = (files: FileUpload[]) => Number((files.map((f) => f.load).reduce((acc, i) => acc + i) / files.length).toFixed(0));

const totalSize = (files: FileUpload[]) => files.map((fileUpload) => fileUpload.file.size).reduce((acc, n) => acc + n);

export const FileUpload: React.FC<Props> = ({
  orderCode,
  size = 'default',
  mimeTypeWhiteList = [],
  minItemsForWarning = 1,
  minItemsToConfirm = 1,
  maxItems = Infinity,
  requiredItems = maxItems,
  type,
  onStatusChanged,
  onSetLoading,
  onSetCompleted,
  onFileNumberChange,
  style,
}) => {
  const { t } = useTranslation();
  const [dropzoneColor, setDropzoneColor] = useState(white);
  const [dropTypeRejected, setDropTypeRejected] = useState(false);
  const [dropNumberRejected, setDropNumberRejected] = useState(false);
  const [duplicatedFiles, setDuplicatedFiles] = useState<Array<File>>([]);

  const { files, addFiles, removeFiles, retryFiles } = useOrderFiles(orderCode, type);

  const mimeTypeAccepted: string = mimeTypeWhiteList.join(', ');
  const isErrorUploading = files.some(({ failed }) => failed);

  const { openModal, onClose } = useModal();

  useEffect(() => {
    const length = files.filter((f) => f.completed).length;
    onFileNumberChange(length);
  }, [onFileNumberChange, files]);

  useEffect(() => {
    if (onStatusChanged) {
      const filesLength = files.length;

      if (isErrorUploading) {
        onStatusChanged(UploadStatus.UploadFailed);
      } else if (requiredItems !== Infinity && filesLength >= minItemsForWarning && filesLength < requiredItems) {
        onStatusChanged(UploadStatus.InvalidNumber);
      } else if (filesLength >= requiredItems) {
        onStatusChanged(UploadStatus.CorrectNumber);
      } else {
        onStatusChanged(UploadStatus.None);
      }
    }
  }, [isErrorUploading, onStatusChanged, files, minItemsForWarning, requiredItems]);

  useEffect(() => {
    const allFilesUploadedSuccessfully = files.every(({ completed }) => completed);

    if (allFilesUploadedSuccessfully && files.length >= minItemsToConfirm) {
      onSetLoading && onSetLoading(false);
      onSetCompleted && onSetCompleted(true);
    } else {
      onSetCompleted && onSetCompleted(false);
    }
  }, [files, onSetLoading, onSetCompleted, minItemsToConfirm]);

  useEffect(() => {
    if (dropNumberRejected && dropTypeRejected) {
      setDropTypeRejected(false);
    }
  }, [dropNumberRejected, dropTypeRejected]);

  const dropFiles: DropFileEventHandler = (acceptedFiles) => {
    const renamedAcceptedFiles = acceptedFiles.map((file) => new File([file], file.name.replace(/\s/g, '_'), { type: file.type }));

    const currentFileNames = files.map((f) => f.file.name);
    const duplicated = renamedAcceptedFiles.filter((f) => currentFileNames.includes(f.name));

    if (maxItems && renamedAcceptedFiles.length + files.length > maxItems) {
      setDropNumberRejected(true);
      logExceededFilesNumber({ orderCode, filesNumber: renamedAcceptedFiles.length + files.length, limit: maxItems });
    } else {
      setDuplicatedFiles(duplicated);
      duplicated.length && openModal(`overrideFile-${type}`);

      addFiles(renamedAcceptedFiles.filter((f) => !duplicated.some((d) => d.name === f.name)));

      onSetLoading && onSetLoading(true);
      onSetCompleted && onSetCompleted(false);
    }
  };

  const overrideFiles = async () => {
    const oldFiles = files.filter((f) => duplicatedFiles.map((dp) => dp.name).includes(f.file.name));
    try {
      await removeFiles(oldFiles);
      addFiles(duplicatedFiles);

      onSetLoading && onSetLoading(true);
      onSetCompleted && onSetCompleted(false);
    } catch (err) {
      onStatusChanged && onStatusChanged(UploadStatus.UploadFailed);
    }
  };

  return (
    <>
      <Wrapper style={style}>
        {dropTypeRejected && !dropNumberRejected && (
          <MessageArea height={100}>
            <ErrorPanel
              errorLabel={t('fileUpload.fileFormatNotSupported')}
              errorBodyLabel={t('fileUpload.weAcceptOnlySingle')}
              onConfirm={() => setDropTypeRejected(false)}
              color={warning}
            />
          </MessageArea>
        )}
        {dropNumberRejected && (
          <MessageArea height={100}>
            <ErrorPanel
              errorLabel={t('fileUpload.numberOfFilesHigher')}
              errorBodyLabel={t('fileUpload.uploadCorrectNumber')}
              onConfirm={() => setDropNumberRejected(false)}
              color={error}
            />
          </MessageArea>
        )}
        {!dropTypeRejected && !dropNumberRejected && (
          <DropzoneStyled
            disableClick
            onDragEnter={() => setDropzoneColor(neutralLightGrey)}
            onDragLeave={() => setDropzoneColor(white)}
            onDrop={() => setDropzoneColor(white)}
            onDropAccepted={dropFiles}
            onDropRejected={() => setDropTypeRejected(true)}
            accept={mimeTypeAccepted}
            dropzoneColor={dropzoneColor}
            height={size === 'small' ? 50 : 100}
          >
            {({ open }) => (
              <DivCenter>
                <Typography variantName="caption2" textColor={neutralDarkGray}>
                  {t('forms.dragAndDrop')}
                </Typography>
                {'\u00A0'}
                <Typography variantName="caption2" textColor={productAccepted} onClick={open} style={{ cursor: 'pointer' }}>
                  {t('forms.browse')}
                </Typography>
              </DivCenter>
            )}
          </DropzoneStyled>
        )}
        {Boolean(files.length) && (
          <Accordion
            color={neutralDarkGray}
            iconStyle={{ bottom: 6, right: -1 }}
            titleComponent={
              <UploadingSummary
                totalFiles={files.length}
                totalFilesSize={totalSize(files)}
                load={totalLoad(files)}
                loading={files.some(({ load, failed }) => !load && !failed)}
                completed={files.every(({ completed }) => completed)}
                error={isErrorUploading}
              />
            }
            initiallyOpen
          >
            {files.map((fileUpload, index) => (
              <FileUploadProgress
                key={fileUpload.file.name}
                fileName={fileUpload.file.name}
                fileSize={fileUpload.file.size}
                load={fileUpload.load}
                index={index}
                status={fileUpload.completed ? Status.COMPLETED : fileUpload.failed ? Status.FAILED : Status.PROGRESS}
                onDelete={() => removeFiles([fileUpload])}
                onRetry={() => retryFiles([fileUpload])}
              />
            ))}
          </Accordion>
        )}
      </Wrapper>
      <Modal id={`overrideFile-${type}`} style={{ width: 475 }}>
        <InfoPanel
          title={t('views.accepted.yourFiles')}
          subtitle={t('views.accepted.overridePhotos', {
            files: duplicatedFiles.map(({ name }) => name).join(', '),
            plural: duplicatedFiles.length > 0,
          })}
          button={t('views.accepted.yesReplace')}
          buttonCancel={t('general.noThanks')}
          onConfirm={() => {
            overrideFiles();
            onClose(`overrideFile-${type}`);
          }}
          onCancel={() => {
            setDuplicatedFiles([]);
            onClose(`overrideFile-${type}`);
          }}
        />
      </Modal>
    </>
  );
};
