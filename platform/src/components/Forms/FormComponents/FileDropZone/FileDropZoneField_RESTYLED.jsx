//
// ────────────────────────────────────────────────────────────────── I ──────────
//   :::::: F I L E   D R O P Z O N E : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────
//

import _ from 'lodash';
import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import { DownloadLink } from 'components/Shooting/DownloadLink';
import { useTranslation } from 'react-i18next';
import { TitleWrapper } from './styles';

const download = (file, title) => {
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = title;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const FileDropZoneField = ({
  onFileRejected,
  onFileDropped,
  onDropRejected,
  style,
  input,
  disabled,
  title,
  subtitle,
  body,
  mandatory,
  meta,
  accept,
  multiple,
  maxSize,
  minSize,
  containerstyle,
  color,
  onRemoveFile,
}) => {
  const [isFilled, setIsFilled] = useState(false);

  const { t } = useTranslation();

  const onDrop = (acceptedFiles, rejectedFiles, input) => {
    if (_.size(rejectedFiles) && onFileRejected) {
      setIsFilled(false);
      onFileRejected();
    } else {
      if (multiple) {
        input.onChange([...acceptedFiles, ...input.value]);
      } else {
        input.onChange(acceptedFiles);
      }

      setIsFilled(true);

      if (onFileDropped) {
        onFileDropped(acceptedFiles);
      }
    }
  };

  const onDragEnter = () => setIsFilled(true);

  const onDragLeave = () => setIsFilled(false);

  const hasError = meta?.touched && meta.error;
  const uploadedFile = input.value[0];
  const dropzoneStyle = { ...style, borderColor: isFilled ? color : '', cursor: disabled ? 'no-drop' : 'pointer' };

  return (
    <div style={containerstyle}>
      {title && (
        <TitleWrapper>
          <span>{title}</span>
          {mandatory && <span style={{ color: '#D71F4B' }}>*</span>}
        </TitleWrapper>
      )}
      {subtitle && <span>{subtitle}</span>}
      {Boolean(uploadedFile) ? (
        <DownloadLink
          filename={uploadedFile.name}
          onDownload={() => download(uploadedFile, uploadedFile.name)}
          color={color}
          onRemoveFile={() => {
            onRemoveFile();
            setIsFilled(false);
          }}
        />
      ) : (
        <Dropzone
          className="drop-file-container_RESTYLED"
          style={dropzoneStyle}
          accept={accept}
          onDrop={(acceptedFiles, rejectedFiles) => onDrop(acceptedFiles, rejectedFiles, input)}
          disabled={disabled}
          multiple={multiple}
          maxSize={maxSize}
          minSize={minSize}
          onDropRejected={
            onDropRejected
              ? () => {
                  setIsFilled(false);
                  onDropRejected();
                }
              : null
          }
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
        >
          <div style={{ cursor: disabled ? 'no-drop' : 'pointer' }}>
            <span>{body || t('forms.imageDropzonePlaceholderBody')}</span>
            <span style={{ color, textDecoration: 'underline' }}>{t('forms.dropzonePlaceholderSubBody')}</span>
          </div>
        </Dropzone>
      )}
      <span style={{ color: 'red', marginTop: 4, fontSize: 11, visibility: !hasError ? 'hidden' : '' }}>{t('forms.required')}</span>
    </div>
  );
};

export default FileDropZoneField;
