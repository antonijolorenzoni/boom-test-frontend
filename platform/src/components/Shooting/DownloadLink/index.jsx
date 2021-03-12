import React from 'react';
import { Wrapper, IconsWrapper } from './styles';
import { Icon, IconButton } from 'ui-boom-components';

const zipUploadedIcon = require('../../../assets/icons/zip-uploaded-2.png');

const DownloadLink = ({ onDownload, filename, color, onRemoveFile }) => {
  return (
    <Wrapper>
      <div>
        <img style={{ width: 22, height: 22, marginRight: 5 }} src={zipUploadedIcon} alt="uploaded_zip" />
        {filename}
      </div>
      <IconsWrapper>
        <IconButton onClick={onDownload}>
          <Icon name="vertical_align_bottom" color={color} />
        </IconButton>
        {onRemoveFile && (
          <IconButton onClick={onRemoveFile}>
            <Icon name="close" color="#80888D" />
          </IconButton>
        )}
      </IconsWrapper>
    </Wrapper>
  );
};

export { DownloadLink };
