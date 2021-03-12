import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import translations from '../../translations/i18next';

const styles = (theme) => ({
  textWithLeftIcon: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
    color: '#80888d',
  },
  text: {
    color: '#80888d',
  },
  subtitle: {
    color: '#A3ABB1',
    fontWeight: '100',
    margin: 0,
  },
  activityCode: {
    color: '#80888f',
    fontWeight: '100',
    fontSize: '1.8em',
    margin: 0,
  },
  timeContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'center',
    alignItems: 'center',
    padding: '0px !important',
  },
});

const ShootingLogisticDetails = ({ shooting, classes, isBoom, isPhotographer }) => {
  return (
    !isBoom &&
    !isPhotographer &&
    shooting.pricingPackage && (
      <Grid container spacing={32} style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Grid item xs={12} md={12}>
          <h5 className={classes.subtitle}>{translations.t('calendar.package').toUpperCase()}</h5>
          <h3 className={classes.activityCode}>
            {`${shooting.pricingPackage.name} (${shooting.pricingPackage.photosQuantity} ${translations.t('organization.photos')})`}
          </h3>
        </Grid>
      </Grid>
    )
  );
};

export default _.flow([withStyles(styles), connect()])(ShootingLogisticDetails);
