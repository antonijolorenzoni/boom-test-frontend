//
// ────────────────────────────────────────────────────────────────── I ──────────
//   :::::: F I L E   D R O P Z O N E : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────
//

import { createMuiTheme, IconButton, MuiThemeProvider, withStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import PhotoIcon from '@material-ui/icons/Photo';
import _ from 'lodash';
import React from 'react';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import FileUpload from '../../../../assets/icons/file-upload.svg';
import translations from '../../../../translations/i18next';

const styles = (theme) => ({
  errorText: {
    color: 'red',
    marginTop: 4,
  },
  placeholderContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 10,
  },
  placeHolderTitle: {
    color: '#abacae',
    fontSize: 15,
    margin: 0,
    textAlign: 'center',
  },
  placeHolderSubTitle: {
    color: '#abacae',
    fontSize: 15,
    fontWeight: 100,
    margin: 0,
    textAlign: 'center',
  },
  placeHolderImage: {
    color: '#abacae',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
  },
  titleText: {
    margin: 0,
    marginRight: 5,
    fontSize: 15,
    fontWeight: 'bold',
  },
  subtitleText: {
    margin: 0,
    marginRight: 5,
    fontSize: 13,
    fontWeight: 100,
    marginBottom: 20,
  },
  uploadText: {
    color: '#abacae',
    fontWeight: 100,
    fontSize: 15,
    textAlign: 'center',
    margin: 0,
    marginBottom: 5,
  },
  uploadContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '80%',
  },
  thumb: {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    marginTop: 8,
    height: 100,
    width: 100,
    padding: 4,
    boxSizing: 'border-box',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbInner: {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden',
  },
  img: {
    display: 'block',
    width: '100%',
    height: '100%',
  },
  photoIconPreview: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  photoIconPreviewText: {
    flexWrap: 'wrap',
    textAlign: 'center',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'noWrap',
    margin: 0,
    width: 80,
  },
});

const theme = createMuiTheme({
  palette: {
    primary: { 500: '#5AC0B1' },
    seconday: '#cc0033',
  },
  typography: {
    useNextVariants: true,
  },
});

class FileDropZoneField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropzoneActive: false,
    };
  }

  onDrop(acceptedFiles, rejectedFiles, input) {
    const { multiple, onFileRejected, onFileDropped } = this.props;
    if (_.size(rejectedFiles) && onFileRejected) {
      onFileRejected();
    } else {
      if (multiple) {
        input.onChange([...acceptedFiles, ...input.value]);
      } else {
        input.onChange(acceptedFiles);
      }
      this.setState({ dropzoneActive: true });
      if (onFileDropped) onFileDropped(acceptedFiles);
    }
  }

  onDragEnter() {
    this.setState({ dropzoneActive: true });
  }

  onDragLeave() {
    this.setState({ dropzoneActive: false });
  }

  onDeleteFile(e, f) {
    const { onDeleteFile, input } = this.props;
    e.stopPropagation();
    if (onDeleteFile) onDeleteFile(f);
    const newFiles = _.filter(input.value, (file) => file.name !== f.name);
    input.onChange(newFiles);
    if (_.isEmpty(newFiles)) this.setState({ dropzoneActive: false });
  }

  render() {
    const {
      onDropRejected,
      style,
      input,
      classes,
      disabled,
      title,
      subtitle,
      body,
      mandatory,
      meta,
      accept,
      icon,
      placeholder,
      multiple,
      maxSize,
      minSize,
      containerstyle,
    } = this.props;
    const { dropzoneActive } = this.state;
    return (
      <MuiThemeProvider theme={theme}>
        <div style={{ ...containerstyle }}>
          {title && (
            <div className={classes.titleContainer}>
              <h4 className={classes.titleText}>{title}</h4>
              {mandatory && <span style={{ color: '#D71F4B' }}>*</span>}
            </div>
          )}
          {subtitle && <h4 className={classes.subtitleText}>{subtitle}</h4>}
          <Dropzone
            className={`drop-file-container ${dropzoneActive && 'drop-file-container-active'}`}
            style={style}
            accept={accept}
            onDrop={(acceptedFiles, rejectedFiles) => this.onDrop(acceptedFiles, rejectedFiles, input)}
            disabled={disabled}
            multiple={multiple}
            maxSize={maxSize}
            minSize={minSize}
            onDropRejected={onDropRejected ? () => onDropRejected() : null}
            onDragEnter={() => this.onDragEnter()}
            onDragLeave={() => this.onDragLeave()}
          >
            {input.value && !_.isString(input.value) && !_.isEmpty(input.value) && (
              <div style={{ width: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <div key={_.first(input.value)} style={{ display: 'flex', alignItems: 'center' }}>
                  {icon || <PhotoIcon />}
                  <h5 style={{ marginLeft: 10, marginRight: 10 }}>{_.first(input.value).name}</h5>
                  <IconButton onClick={(e) => this.onDeleteFile(e, _.first(input.value))}>
                    <CloseIcon />
                  </IconButton>
                </div>
              </div>
            )}
            {(!input.value || _.isEmpty(input.value) || _.isString(input.value)) && (
              <div className={classes.placeholderContainer}>
                <img src={FileUpload} className={classes.placeHolderImage} alt="upload" />
                <h5 className={classes.placeHolderTitle}>{body || translations.t('forms.imageDropzonePlaceholderBody')}</h5>
                <h5 className={classes.placeHolderSubTitle}>{placeholder || translations.t('forms.dropzonePlaceholderSubBody')}</h5>
              </div>
            )}
          </Dropzone>
          {meta.touched && meta.error && <h6 className={classes.errorText}>{translations.t('forms.required')}</h6>}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default connect()(withStyles(styles)(FileDropZoneField));
