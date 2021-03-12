import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import boomLogo from '../../assets/brand/logo_bianco.png';

const styles: any = {
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
  },
  circularProgress: {
    color: 'white',
  },
};

const Spinner = ({ title, classes, spinnerStyle, titleStyle, hideLogo }: any) => (
  <div className={classes.container}>
    {!hideLogo && <img src={boomLogo} alt="BOOM" className={classes.logo} />}
    <CircularProgress className={classes.circularProgress} style={{ ...spinnerStyle }} />
    {title && (
      <h4 className={classes.title} style={{ ...titleStyle }}>
        {title}
      </h4>
    )}
  </div>
);

export default withStyles(styles)(Spinner);
