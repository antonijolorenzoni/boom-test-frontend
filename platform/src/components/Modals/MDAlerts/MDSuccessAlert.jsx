import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import green from '@material-ui/core/colors/green';
import MDSnackbarContent from './MDSnackbarContent';

const styles = (theme) => ({
  snackbarContent: {
    backgroundColor: green[200],
  },
  close: {
    padding: theme.spacing.unit / 2,
    color: green[800],
  },
  alertMessage: {
    color: green[800],
  },
});

const SnackbarContentWrapper = withStyles(styles)(MDSnackbarContent);

class MDSuccessAlert extends React.Component {
  handleClose = (event, reason) => {
    const { hideModal } = this.props;
    if (reason === 'clickaway') {
      return;
    }
    hideModal();
  };

  render() {
    const { anchorOrigin, message } = this.props;
    return (
      <div>
        <Snackbar anchorOrigin={anchorOrigin} open autoHideDuration={5000} onClose={this.handleClose}>
          <SnackbarContentWrapper onClose={this.handleClose} message={message} />
        </Snackbar>
      </div>
    );
  }
}

MDSuccessAlert.defaultProps = {
  anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
};

export default MDSuccessAlert;
