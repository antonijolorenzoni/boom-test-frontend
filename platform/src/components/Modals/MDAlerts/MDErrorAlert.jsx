import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import red from '@material-ui/core/colors/red';
import MDSnackbarContent from './MDSnackbarContent';

const styles = (theme) => ({
  snackbarContent: {
    backgroundColor: red[200],
  },
  close: {
    padding: theme.spacing.unit / 2,
    color: red[800],
  },
  message: {
    maxWidth: 400,
  },
  alertMessage: {
    color: red[800],
  },
});

const SnackbarContentWrapper = withStyles(styles)(MDSnackbarContent);

class MDErrorAlert extends React.Component {
  handleClose = (event, reason) => {
    const { hideModal } = this.props;
    if (reason === 'clickaway') {
      return;
    }
    hideModal();
  };

  render() {
    const { anchorOrigin, message, autoHideDuration } = this.props;
    return (
      <div>
        <Snackbar anchorOrigin={anchorOrigin} open autoHideDuration={autoHideDuration || 5000} onClose={this.handleClose}>
          <SnackbarContentWrapper onClose={this.handleClose} message={message} />
        </Snackbar>
      </div>
    );
  }
}

MDErrorAlert.defaultProps = {
  anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
};

export default MDErrorAlert;
