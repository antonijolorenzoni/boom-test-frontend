import { Button, Card, CardContent, createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import PropTypes from 'prop-types';
import React from 'react';
import translations from '../../../../translations/i18next';
import ProfilePictureForm from './ProfilePictureForm';

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

const ProfilePictureCard = ({ classes, user, onLogout, onSubmit }) => (
  <MuiThemeProvider theme={theme}>
    <div>
      <Card>
        <CardContent>
          <ProfilePictureForm user={user} onSubmit={(data) => onSubmit(data)} />
          <Button onClick={() => onLogout()} className={classes.logoutButton}>
            <h5 className={classes.logoutText}>
              {translations.t('profile.logout')}
              <PowerSettingsNewIcon style={{ marginLeft: 5 }} />
            </h5>
          </Button>
        </CardContent>
      </Card>
    </div>
  </MuiThemeProvider>
);

ProfilePictureCard.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({}).isRequired,
  onLogout: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default withStyles(styles)(ProfilePictureCard);
