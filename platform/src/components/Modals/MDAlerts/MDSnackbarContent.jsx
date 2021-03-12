import React from 'react';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

export default function MDSnackbarContent(props) {
  const { classes, onClose, message } = props;
  return (
    <SnackbarContent
      classes={{
        root: classes.snackbarContent,
        message: classes.message,
      }}
      aria-describedby="client-snackbar"
      message={
        <b className={classes.alertMessage} id="message-id">
          {message}
        </b>
      }
      action={[
        <IconButton key="close" aria-label="Close" color="inherit" className={classes.close} onClick={onClose}>
          <CloseIcon />
        </IconButton>,
      ]}
    />
  );
}
