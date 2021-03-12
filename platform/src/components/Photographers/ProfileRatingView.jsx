import { Card, CardContent, createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import React from 'react';
import translations from '../../translations/i18next';
import StarRatingView from '../StarRatingView/StarRatingView';

const styles = () => ({
  profileImage: {
    width: '75%',
    borderRadius: '100%',
    display: 'flex',
    margin: '20px auto',
  },
  logoutButton: {
    margin: '10px auto 0px',
    display: 'flex',
    padding: 0,
    '&:hover, &:focus': {
      backgroundColor: 'transparent',
    },
  },
  logoutText: {
    fontWeight: 'bold',
    color: '#80888d',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    margin: 0,
  },
});

const theme = createMuiTheme({
  palette: {
    primary: { 500: '#5AC0B1' },
    secondary: { main: '#CC0033' },
  },
  typography: {
    useNextVariants: true,
  },
});

const ProfileRatingView = ({ user, onShowRatingInfo }) => (
  <MuiThemeProvider theme={theme}>
    {user.score && user.score > 0 && (
      <div style={{ marginTop: 10 }}>
        <Card style={{ position: 'relative' }}>
          <h4 style={{ textAlign: 'center', marginBottom: 0 }}>{translations.t('photographers.ratingTitle')}</h4>
          <CardContent>
            <StarRatingView
              value={user.score}
              totalValues={5}
              starStyle={{ width: 12 }}
              unselectedStarStyle={{ width: 8 }}
              titleStyle={{ fontWeight: 100, color: '#b2bac2', fontSize: 12, margin: 0 }}
              starContainerStyle={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}
            />
          </CardContent>
          <IconButton style={{ position: 'absolute', top: 0, right: 0 }} onClick={() => onShowRatingInfo()}>
            <InfoIcon style={{ fontSize: 20 }} />
          </IconButton>
        </Card>
      </div>
    )}
  </MuiThemeProvider>
);

export default withStyles(styles)(ProfileRatingView);
