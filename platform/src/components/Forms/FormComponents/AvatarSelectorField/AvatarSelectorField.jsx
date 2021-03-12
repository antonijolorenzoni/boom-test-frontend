//
// ────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: S E L E C T O R   F O R   P R O F I L E   P I C T U R E S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import { Paper, withStyles } from '@material-ui/core';
import UserIcon from '@material-ui/icons/Person';
import _ from 'lodash';
import React from 'react';
import Dropzone from 'react-dropzone';
import translations from '../../../../translations/i18next';

const styles = (theme) => ({
  errorText: {
    color: 'red',
    marginTop: 4,
  },
  placeholderContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 50,
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
    fontWeight: 100,
  },
  dropContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  previewImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
});

class AvatarSelectorField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropzoneActive: false,
      preview: props.input && props.input.value,
    };
  }

  onDrop(acceptedFiles, rejectedFiles, input) {
    const { onFileRejected, onDropFile } = this.props;
    if (_.size(rejectedFiles)) {
      if (onFileRejected) {
        onFileRejected();
      }
    } else {
      var file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        this.setState({ preview: event.target.result });
      };
      reader.readAsDataURL(file);
      input.onChange(acceptedFiles);
      onDropFile(file);
      this.setState({ dropzoneActive: true });
    }
  }

  onDragEnter() {
    this.setState({ dropzoneActive: true });
  }

  onDragLeave() {
    this.setState({ dropzoneActive: false });
  }

  onDeleteFile(e, f) {
    const { onDeleteFile } = this.props;
    e.stopPropagation();
    if (onDeleteFile) onDeleteFile(f);
    this.setState({ dropzoneActive: false });
  }

  render() {
    const {
      style,
      input,
      classes,
      disabled,
      title,
      mandatory,
      meta,
      multiple,
      maxSize,
      minSize,
      containerstyle,
      previewImageStyle,
    } = this.props;
    const { dropzoneActive, preview } = this.state;
    return (
      <div style={{ margin: 10, display: 'flex', justifyContent: 'center', ...containerstyle }}>
        {title && (
          <div className={classes.titleContainer}>
            <h4 className={classes.titleText}>{title}</h4>
            {mandatory && <span style={{ color: '#D71F4B' }}>*</span>}
          </div>
        )}
        <Paper className={classes.dropContainer}>
          <Dropzone
            className={`avatar-drop-container ${dropzoneActive && 'avatar-drop-container-active'}`}
            style={{ ...style }}
            accept="image/*"
            onDrop={(acceptedFiles, rejectedFiles) => this.onDrop(acceptedFiles, rejectedFiles, input)}
            disabled={disabled}
            multiple={multiple}
            maxSize={maxSize}
            minSize={minSize}
            onDragEnter={() => this.onDragEnter()}
            onDragLeave={() => this.onDragLeave()}
          >
            {input.value ? (
              <div key={input.value} style={{ display: 'flex', alignItems: 'center' }}>
                <img src={preview} className={classes.previewImage} style={{ ...previewImageStyle }} alt="profile" />
              </div>
            ) : (
              <div className={classes.placeholderContainer}>
                <UserIcon className={classes.placeHolderImage} />
              </div>
            )}
          </Dropzone>
        </Paper>
        {meta.touched && meta.error && <h6 className={classes.errorText}>{translations.t('forms.required')}</h6>}
      </div>
    );
  }
}

export default withStyles(styles)(AvatarSelectorField);
