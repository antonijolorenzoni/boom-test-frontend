import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import React from 'react';
import { withRouter } from 'react-router-dom';
import translations from '../../../translations/i18next';

const styles = (theme) => ({
  outerContainer: {
    height: '100%',
    marginBottom: 15,
    position: 'relative',
    borderTop: '3px solid #75bdb1',
  },
  eventContainer: {
    padding: 15,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typography: {
    useNextVariants: true,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    margin: 0,
    textAlign: 'left',
    fontWeight: 800,
    fontSize: 18,
    color: '#3f3f3f',
  },
  dateText: {
    margin: 0,
    color: '#979da1',
    fontSize: 15,
    marginTop: 5,
  },
  disabledText: {
    margin: 0,
    marginTop: 5,
    fontSize: 12,
    color: 'red',
    position: 'absolute',
    right: 10,
    top: 10,
  },
  body: {
    margin: 0,
    marginTop: 10,
    color: '#979da1',
    textAlign: 'left',
    fontSize: 12,
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

const UserRow = ({ user: { firstName, lastName, email, enabled }, onClick, classes, containerstyle }) => (
  <MuiThemeProvider theme={theme}>
    <Card style={{ ...containerstyle, opacity: enabled ? 1 : 0.6 }} className={classes.outerContainer}>
      <CardActionArea className={classes.eventContainer} onClick={() => onClick()}>
        <div>
          <h3 className={classes.title}>{`${firstName} ${lastName}`}</h3>
          <h3 className={classes.title} style={{ margin: 0 }}>
            {`${email}`}
          </h3>
          {!enabled && <h4 className={classes.disabledText}>{translations.t('users.disabled').toUpperCase()}</h4>}
        </div>
      </CardActionArea>
    </Card>
  </MuiThemeProvider>
);

export default withStyles(styles)(withRouter(UserRow));
