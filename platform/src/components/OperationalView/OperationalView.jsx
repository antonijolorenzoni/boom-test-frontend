//
// ──────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: O P E R A T I O N A L   V I E W   C O M P O N E N T : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────────────────
//

import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { isMobileBrowser } from '../../config/utils';

/*
 * The operational view it's a drawer component that will popup from right
 * and render an inner content
 */

class OperationalView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.wrapper = React.createRef();
  }

  componentDidMount() {
    setTimeout(() => this.setState({ isOpen: true }), 100);
  }

  onClose = () => {
    const { onCancel, hideModal } = this.props;

    if (onCancel) {
      onCancel();
    } else {
      this.setState({ isOpen: false }, () => setTimeout(() => hideModal(), 500));
    }
  };

  scrollToTop = () => {
    this.wrapper.current.parentElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  render() {
    const { content, ancor, containerstyle, widthByShootingState, closeIconColor } = this.props;
    const { isOpen } = this.state;

    return (
      <Drawer
        PaperProps={isMobileBrowser() ? { style: { width: '100%' } } : {}}
        anchor={ancor || 'right'}
        open={isOpen}
        onClose={() => this.onClose()}
        disableEnforceFocus
      >
        <div ref={this.wrapper}>
          <IconButton style={{ position: 'absolute', right: 3, top: 3, color: 'white' }} onClick={() => this.onClose()}>
            <CloseIcon style={{ color: closeIconColor || '#000000' }} />
          </IconButton>
          <div style={{ width: isMobileBrowser() ? '100%' : widthByShootingState ? widthByShootingState : '50vh', ...containerstyle }}>
            {React.cloneElement(content, { scrollToTop: this.scrollToTop, onClose: this.onClose })}
          </div>
        </div>
      </Drawer>
    );
  }
}

export default OperationalView;
