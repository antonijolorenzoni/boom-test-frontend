import { withStyles, IconButton } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import Grow from '@material-ui/core/Grow';
import React from 'react';
import translations from '../../../translations/i18next';
import MDButton from '../../MDButton/MDButton';

const styles = (theme) => ({
  innerContainer: {
    padding: 20,
    paddingTop: 0,
    paddingLeft: 25,
  },
  actionsContainer: {
    marginBottom: 20,
  },
  bodyText: {
    margin: 0,
    fontWeight: '100',
  },
});

function Transition(props) {
  return <Grow {...props} />;
}

class MDDialog extends React.Component {
  onClose() {
    const { onCancel, hideModal } = this.props;
    if (onCancel) {
      onCancel();
    }
    hideModal();
  }

  onConfirm() {
    const { onConfirm, hideModal } = this.props;
    if (onConfirm) {
      onConfirm();
    } else {
      hideModal();
    }
  }

  render() {
    const {
      title,
      bodyText,
      fullScreen,
      maxWidth,
      width,
      height,
      overflow,
      cancelText,
      content,
      ContentComponent,
      confirmText,
      onConfirm,
      titleStyle,
      bodyTextStyle,
      innerContainerStyle,
      bodyContentContainerStyle,
      hideCancel,
      classes,
      paperStyle,
    } = this.props;
    return (
      <Dialog
        open
        fullScreen={fullScreen}
        maxWidth={maxWidth}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => this.props.hideModal()}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
          style: paperStyle,
        }}
      >
        <div style={{ position: 'relative', width, height, overflow }}>
          <IconButton
            onClick={() => {
              this.props.onCloseModal && this.props.onCloseModal();
              this.props.hideModal();
            }}
            style={{ position: 'absolute', right: 5, top: 5 }}
          >
            <CloseIcon />
          </IconButton>
          <DialogTitle id="alert-dialog-slide-title" style={{ marginRight: 40, marginTop: -3 }}>
            <h4 style={{ margin: 0, marginBottom: 20, ...titleStyle }}>{title}</h4>
          </DialogTitle>
          <div className={classes.innerContainer} style={innerContainerStyle}>
            <div id="alert-dialog-slide-description" style={bodyContentContainerStyle}>
              {bodyText && (
                <h5 className={classes.bodyText} style={{ ...bodyTextStyle }}>
                  {bodyText || ''}
                </h5>
              )}
              {content || ''}
              {ContentComponent && <ContentComponent />}
            </div>
          </div>
          {(!hideCancel || onConfirm) && (
            <DialogActions className={classes.actionsContainer}>
              {!hideCancel && (
                <MDButton
                  title={cancelText || translations.t('modals.cancel')}
                  onClick={() => this.onClose()}
                  backgroundColor="#bdbdbd"
                  containerstyle={{ margin: 0, marginRight: 20 }}
                />
              )}
              {onConfirm && (
                <MDButton
                  title={confirmText || translations.t('modals.confirm')}
                  onClick={() => this.onConfirm()}
                  backgroundColor="#5AC0B1"
                  containerstyle={{ margin: 0, marginRight: 20 }}
                />
              )}
            </DialogActions>
          )}
        </div>
      </Dialog>
    );
  }
}
export default withStyles(styles)(MDDialog);
