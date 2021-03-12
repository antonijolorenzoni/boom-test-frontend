import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';

const styles = (theme) => ({
  popper: {
    zIndex: 20000,
    borderRadius: 5,
  },
  close: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

class MDPopper extends React.Component {
  onClosePopper = () => {
    const { onClose, hideModal } = this.props;
    if (onClose) {
      onClose();
    }
    if (hideModal) hideModal();
  };

  render() {
    const { id, anchorEl, classes, placement, content, isClosed, containerstyle, hideCloseButton } = this.props;

    return (
      <div style={{ zIndex: 20000, ...containerstyle }}>
        <Popper className={classes.popper} id={id} open={!isClosed} transition anchorEl={anchorEl} placement={placement || 'right-end'}>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper>
                {!hideCloseButton && (
                  <div className={classes.close}>
                    <IconButton key="close" aria-label="Close" color="inherit" onClick={this.onClosePopper}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </div>
                )}
                {content}
              </Paper>
            </Fade>
          )}
        </Popper>
      </div>
    );
  }
}

export default withStyles(styles)(MDPopper);
