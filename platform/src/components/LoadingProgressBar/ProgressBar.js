import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import React from 'react';
import boomLogo from '../../assets/brand/logo_black.png';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    margin: 5,
    marginBottom: 15,
    alignSelf: 'center',
    height: 40,
  },
  title: {
    color: 'white',
    margin: 0,
    marginTop: 10,
  },
  progressBarContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressBar: {
    color: 'white',
    width: 200,
  },
  progressText: {
    marginLeft: 10,
    color: 'white',
    margin: 0,
    width: 50,
  },
};

const theme = createMuiTheme({
  palette: {
    primary: { 500: '#5AC0B1' },
  },
  typography: {
    useNextVariants: true,
  },
});

const ProgressBar = ({ title, classes, progress }) => (
  <MuiThemeProvider theme={theme}>
    <div className={classes.container}>
      <img src={boomLogo} alt="BOOM" className={classes.logo} />
      <div className={classes.progressBarContainer}>
        <LinearProgress color="primary" className={classes.progressBar} variant="determinate" value={progress} />
        <h4 className={classes.progressText}>{`${progress || '0'} %`}</h4>
        <CircularProgress style={{ color: 'white', marginLeft: 5 }} />
      </div>
      {title && <h4 className={classes.title}>{title}</h4>}
    </div>
  </MuiThemeProvider>
);

export default withStyles(styles)(ProgressBar);
