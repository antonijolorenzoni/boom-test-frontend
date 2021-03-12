import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { Icon, Typography } from 'ui-boom-components/lib';

interface Props {
  onDrop: (file: any) => void;
  disabled?: boolean;
  body?: string;
  color?: string;
}

export const UploadComponent: React.FC<Props> = ({ onDrop, disabled = false, body, color }) => {
  const { t } = useTranslation();
  const [droppedFile, setDroppedFile] = useState<string>('');

  const handleOnDrop = (acceptedFiles: File[], rejectedFiles: any) => {
    setDroppedFile(acceptedFiles[0].name);
    onDrop(acceptedFiles);
  };

  const handleDeleteFile = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    onDrop('');
    setDroppedFile('');
  };

  return (
    <Dropzone
      onDrop={handleOnDrop}
      className={'drop-file-container_RESTYLED'}
      style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}
    >
      {!droppedFile && (
        <div style={{ cursor: disabled ? 'no-drop' : 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variantName={'title3'}>{body || t('forms.imageDropzonePlaceholderBody')}</Typography>
          <Typography variantName={'caption2'} textColor={color ?? ''} style={{ textDecoration: 'underline' }}>
            {t('forms.dropzonePlaceholderSubBody')}
          </Typography>
        </div>
      )}
      {droppedFile && (
        <div style={{ display: 'flex', color: '#000', alignItems: 'center' }}>
          <Icon name={'insert_photo'} size={16} style={{ marginRight: 10 }} />
          <Typography variantName={'body1'}>{droppedFile}</Typography>
          <Icon name={'close'} size={16} style={{ marginLeft: 10 }} onClick={(e) => handleDeleteFile(e)} />
        </div>
      )}
    </Dropzone>
  );
};
