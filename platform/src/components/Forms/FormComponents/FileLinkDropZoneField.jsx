//
// ────────────────────────────────────────────────────────────────── I ──────────
//   :::::: F I L E   D R O P Z O N E : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────
//

import _ from 'lodash';
import React from 'react';
import Dropzone from 'react-dropzone';
import { download } from 'utils/download';
import translations from '../../../translations/i18next';
import { DownloadLink } from '../../Shooting/DownloadLink';

class FileDropZoneField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropzoneActive: false,
    };
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    const { onFileRejected, onFileDropped, multiple } = this.props;
    if (_.size(rejectedFiles) && onFileRejected) {
      this.setState({ dropzoneActive: false }, () => onFileRejected());
    } else {
      if (onFileDropped) {
        onFileDropped(multiple ? acceptedFiles : acceptedFiles[0]);
      }
    }
  };

  onDragEnter = () => {
    this.setState({ dropzoneActive: true });
  };

  onDragLeave = () => {
    this.setState({ dropzoneActive: false });
  };

  onRemoveFile = () => {
    this.props.onRemoveFile();
    this.setState({ dropzoneActive: false });
  };

  render() {
    const {
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
      confirmDownload,
    } = this.props;

    const url = input.value;
    const { filename } = this.props;

    const { dropzoneActive } = this.state;

    const hasError = meta.touched && meta.error;
    const dropzoneStyle = { ...style, borderColor: dropzoneActive ? color : '' };

    return (
      <div style={{ ...containerstyle }}>
        {title && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginBottom: 10,
              fontSize: 17,
              fontWeight: 500,
            }}
          >
            <span>{title}</span>
            {mandatory && <span style={{ color: '#D71F4B' }}>*</span>}
          </div>
        )}
        {subtitle && <span>{subtitle}</span>}
        {Boolean(url) && (
          <DownloadLink
            onDownload={() => {
              download(url, filename);
              confirmDownload();
            }}
            filename={filename}
            color={color}
            onRemoveFile={this.props.onRemoveFile ? this.onRemoveFile : null}
          />
        )}
        {!Boolean(url) && (
          <Dropzone
            className="drop-file-container_RESTYLED"
            style={dropzoneStyle}
            accept={accept}
            onDrop={this.onDrop}
            disabled={disabled}
            multiple={multiple}
            maxSize={maxSize}
            minSize={minSize}
            onDropRejected={
              onDropRejected
                ? () => {
                    this.setState({ dropzoneActive: false }, () => onDropRejected());
                  }
                : null
            }
            onDragEnter={this.onDragEnter}
            onDragLeave={this.onDragLeave}
          >
            <div style={{ cursor: 'pointer' }}>
              <span>{body || translations.t('forms.imageDropzonePlaceholderBody')}</span>
              <span style={{ color, textDecoration: 'underline' }}>{translations.t('forms.dropzonePlaceholderSubBody')}</span>
            </div>
          </Dropzone>
        )}
        <span style={{ color: 'red', marginTop: 4, fontSize: 11, visibility: !hasError ? 'hidden' : '' }}>
          {translations.t('forms.required')}
        </span>
      </div>
    );
  }
}

export default FileDropZoneField;
