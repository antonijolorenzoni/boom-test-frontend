//
// ──────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: A P P L I C A T I O N   H E A D E R   C O M P O N E N T : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import UserIcon from '@material-ui/icons/Person';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';
import boomLogo from '../../assets/brand/logo_black.png';
import CloseIcon from '../../assets/header/closeHeader.svg';
import MenuIcon from '../../assets/header/menuMobile.svg';
import NotificationContainer from '../MainViews/NotificationContainer';
import HeaderMenu from './HeaderMenu';

export const styles = {
  root: {
    position: 'fixed',
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  bigAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerRight: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  userName: {
    margin: 0,
    marginBottom: 5,
    marginRight: 10,
    marginLeft: 10,
    fontSize: 15,
  },
  bellIcon: {
    width: 20,
    marginBottom: 5,
    marginRight: 10,
  },
  iconHeaderMobile: {
    width: 20,
  },
};

const theme = createMuiTheme({
  palette: {
    primary: { 500: '#f5f6f7' },
  },
  typography: {
    useNextVariants: true,
  },
});

const AppHeader = ({
  classes,
  utils: {
    app: { isMobile },
  },
  user: { data: userData },
}) => {
  const [showHeader, setShowHeader] = useState(false);

  const toggleHeaderMenu = () => setShowHeader(!showHeader);
  const closeHeaderMenu = () => setShowHeader(false);

  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.root}>
        <AppBar elevation={0} position="sticky" color="primary">
          <Toolbar>
            <img alt="boom" src={boomLogo} style={{ width: 70 }} />
            {!isMobile && <HeaderMenu isMobile={isMobile} />}
            <div className={classes.headerRight}>
              <NotificationContainer onClick={isMobile ? () => closeHeaderMenu() : null} />
              <NavLink
                exact
                to={userData.isPhotographer ? '/myProfile' : '/profile'}
                style={{
                  color: '#1D1D1D',
                }}
                activeStyle={{
                  color: '#5AC0B1',
                }}
              >
                <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                  {userData.profilePicture ? <img alt="boom" className={classes.bigAvatar} src={userData.profilePicture} /> : <UserIcon />}
                </IconButton>
              </NavLink>
              {!isMobile ? (
                <h4 className={classes.userName}>
                  {`${userData.user ? userData.user.firstName : userData.firstName} ${
                    userData.user ? userData.user.lastName : userData.lastName
                  }`}
                </h4>
              ) : (
                <IconButton onClick={toggleHeaderMenu} className={classes.menuButton} color="inherit" aria-label="Menu">
                  <img alt="boom" src={showHeader ? CloseIcon : MenuIcon} className={classes.iconHeaderMobile} />
                </IconButton>
              )}
            </div>
          </Toolbar>
        </AppBar>
      </div>
      {showHeader && <HeaderMenu onClick={toggleHeaderMenu} isMobile={isMobile} />}
    </MuiThemeProvider>
  );
};

const mapStateToProps = (state) => ({
  utils: state.utils,
  user: state.user,
});

export default connect(mapStateToProps)(withRouter(withStyles(styles)(AppHeader)));
