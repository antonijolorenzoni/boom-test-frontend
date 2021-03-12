import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import orange from '@material-ui/core/colors/orange';
import MDSnackbarContent from './MDSnackbarContent';

const styles = (theme) => ({
  snackbarContent: {
    backgroundColor: orange[200],
  },
  close: {
    padding: theme.spacing.unit / 2,
    color: orange[800],
  },
  alertMessage: {
    color: orange[800],
  },
});

const SnackbarContentWrapper = withStyles(styles)(MDSnackbarContent);

class MDWarningAlert extends React.Component {
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

MDWarningAlert.defaultProps = {
  anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
};

export default MDWarningAlert;
