//
// ──────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: S H O O T I N G   R E W A R D   S E C T I O N   V I E W : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import _ from 'lodash';
import { withStyles, Grid } from '@material-ui/core';
import React from 'react';
import translations from '../../translations/i18next';
import { calculatePhotographerTotalRefund, filterPhotographerItemsRefund, checkPhotographerItemsRefund } from '../../config/utils';
import { SHOOTINGS_STATUSES } from '../../config/consts';

const styles = (theme) => ({
  titleStyle: {
    marginBottom: 12,
    fontSize: 12,
    color: '#80888D',
    fontWeight: 500,
    '@media(max-width: 768px)': {
      fontSize: 19,
    },
  },
  valueStyle: {
    fontSize: 20,
    fontWeight: 500,
    '@media(max-width: 768px)': {
      fontSize: 35,
    },
  },
  gridItem: {
    marginBottom: 20,
  },
});

const ShootingRewardSection = ({ classes, pricingPackage, refund, photographerItems, shooting }) => {
  const currencySymbol = _.get(pricingPackage, 'currency.symbol', '');
  const filteredPhotographerItemsRefund = filterPhotographerItemsRefund(photographerItems);
  const checkedPhotographerItemsRefund = checkPhotographerItemsRefund(photographerItems);
  const totalRefund = calculatePhotographerTotalRefund(filteredPhotographerItemsRefund);
  const INACTIVE_SHOOTING_STATES = [
    SHOOTINGS_STATUSES.CANCELED,
    SHOOTINGS_STATUSES.RESHOOT,
    SHOOTINGS_STATUSES.DONE,
    SHOOTINGS_STATUSES.DOWNLOADED,
    SHOOTINGS_STATUSES.ARCHIVED,
  ];
  let refundToShow = _.isEmpty(checkedPhotographerItemsRefund) && refund ? totalRefund + refund : totalRefund;
  refundToShow = INACTIVE_SHOOTING_STATES.includes(shooting.state) && refund ? refundToShow - refund : refundToShow;

  return (
    <Grid container justify="center">
      <Grid item container xs={6} md={4} direction="column" justify="center" alignItems="center" className={classes.gridItem}>
        <div className={classes.titleStyle}>{translations.t('shootings.reward').toUpperCase()}</div>
        <div className={classes.valueStyle}>{`${currencySymbol} ${pricingPackage.photographerEarning}`}</div>
      </Grid>
      {refundToShow !== 0 && (
        <Grid item container xs={6} md={4} direction="column" alignItems="center" className={classes.gridItem}>
          <div className={classes.titleStyle}>{translations.t('forms.refund').toUpperCase()}</div>
          <div className={classes.valueStyle}>{`${currencySymbol} ${refundToShow}`}</div>
        </Grid>
      )}
      <Grid item container xs={6} md={4} direction="column" alignItems="center" className={classes.gridItem}>
        <div className={classes.titleStyle}>{translations.t('forms.photosQuantity').toUpperCase()}</div>
        <div className={classes.valueStyle}>{`${pricingPackage.photosQuantity} ${translations.t('organization.photos')}`}</div>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(ShootingRewardSection);
