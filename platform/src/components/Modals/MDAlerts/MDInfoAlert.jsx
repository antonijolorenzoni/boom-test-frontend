import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import blue from '@material-ui/core/colors/blue';
import MDSnackbarContent from './MDSnackbarContent';

const styles = (theme) => ({
  snackbarContent: {
    backgroundColor: blue[200],
  },
  close: {
    padding: theme.spacing.unit / 2,
    color: blue[800],
  },
  alertMessage: {
    color: blue[800],
  },
});

const SnackbarContentWrapper = withStyles(styles)(MDSnackbarContent);

class MDInfoAlert extends React.Component {
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

MDInfoAlert.defaultProps = {
  anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
};

export default MDInfoAlert;
