import { MuiThemeProvider, withStyles } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import EmailIcon from '@material-ui/icons/Email';
import LanguageIcon from '@material-ui/icons/Language';
import PhoneIcon from '@material-ui/icons/Phone';
import WorkIcon from '@material-ui/icons/Work';
import React from 'react';
import translations from '../../translations/i18next';

const styles = (theme) => ({
  outerContainer: {
    padding: 20,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  innerContainer: {
    marginTop: 20,
  },
  detailContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    margin: 0,
    textAlign: 'left',
    fontWeight: 800,
    fontSize: 22,
    color: '#3f3f3f',
    marginTop: 5,
  },
  normalText: {
    margin: 0,
    textAlign: 'left',
    fontWeight: 100,
    fontSize: 18,
    color: '#3f3f3f',
  },
  image: {
    objectFit: 'contain',
    height: 50,
    borderRadius: 10,
    marginRight: 20,
  },
  photoTypeTag: {
    marginRight: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  detailIcon: {
    color: '#7F888F',
    marginRight: 10,
  },
});

const theme = createMuiTheme({
  palette: {
    primary: { 500: '#cc0033' },
    seconday: '#cc0033',
  },
  typography: {
    useNextVariants: true,
  },
});

const UserDetailsCard = ({ user: { firstName, lastName, email, jobTitle, language, phoneNumber }, classes }) => (
  <MuiThemeProvider theme={theme}>
    <div className={classes.outerContainer}>
      <h4 className={classes.title}>{`${firstName} ${lastName}`}</h4>
      <div className={classes.innerContainer}>
        {email && (
          <div className={classes.detailContainer}>
            <EmailIcon className={classes.detailIcon} />
            <h4 className={classes.normalText}>{email}</h4>
          </div>
        )}
        {language && (
          <div className={classes.detailContainer}>
            <LanguageIcon className={classes.detailIcon} />
            <h4 className={classes.normalText}>{translations.t(`languages.${language}`)}</h4>
          </div>
        )}
        {jobTitle && (
          <div className={classes.detailContainer}>
            <WorkIcon className={classes.detailIcon} />
            <h4 className={classes.normalText}>{jobTitle}</h4>
          </div>
        )}
        {phoneNumber && (
          <div className={classes.detailContainer}>
            <PhoneIcon className={classes.detailIcon} />
            <h4 className={classes.normalText}>{phoneNumber}</h4>
          </div>
        )}
      </div>
    </div>
  </MuiThemeProvider>
);
export default withStyles(styles)(UserDetailsCard);
