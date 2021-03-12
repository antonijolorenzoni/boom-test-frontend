//
// ──────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: S H O O T I N G   I T E M   V I E W : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────
//

import _ from 'lodash';
import { Button, Grid, withStyles } from '@material-ui/core';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import CalendarGrayIcon from '../../assets/icons/calendar-gray.svg';
import ClockIcon from '../../assets/icons/clock-gray.svg';
import { SHOOTING_STATUSES_UI_ELEMENTS, SHOOTINGS_STATUSES } from '../../config/consts';
import translations from '../../translations/i18next';
import { mapOrderStatus } from '../../config/utils';

const styles = (theme) => ({
  container: {
    padding: '20px 30px',
    marginRight: 0,
    display: 'flex',
    width: '100%',
    borderRadius: 0,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
    width: '20px',
  },
  calendarIcon: {
    marginRight: theme.spacing.unit,
    width: '15px',
  },
  shootingName: {
    fontWeight: 'bold',
    color: '#80888f',
    textAlign: 'left',
    margin: 0,
    fontSize: 15,
  },
  dateText: {
    fontWeight: '100',
    color: '#b2bac2',
    margin: 0,
  },
  rewardText: {
    fontWeight: 'bold',
    color: '#b2bac2',
    margin: 0,
    fontSize: 15,
  },
  codeTitle: {
    color: '#b2bac2',
    fontWeight: 'bold',
    fontSize: 12,
    margin: 0,
    textAlign: 'left',
    marginTop: 10,
  },
  codeText: {
    color: '#80888f',
    fontWeight: 'bold',
    margin: 0,
    textAlign: 'left',
    fontSize: 13,
    marginTop: 5,
  },
  statusText: {
    margin: 0,
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 13,
    marginTop: 5,
    color: '#80888f',
  },
});

const ShootingItem = (props) => {
  const { classes, shooting, onSelectItem, style, isPhotographer, isBoom } = props;
  let statusColor = _.get(SHOOTING_STATUSES_UI_ELEMENTS, [shooting.state, 'color'], '#66c0b0');

  if (!isBoom && !isPhotographer) {
    statusColor = SHOOTING_STATUSES_UI_ELEMENTS[mapOrderStatus(isBoom, isPhotographer, shooting.state)].color;
  }

  const currencySymbol = _.get(shooting, 'pricingPackage.currency.symbol', '');

  return (
    <Button
      className={classes.container}
      onClick={onSelectItem && (() => onSelectItem(shooting))}
      style={{ ...style }}
      disableRipple
      disableFocusRipple
    >
      <Grid container>
        {shooting.title && (
          <Grid item xs={12} md={9} style={{ marginBottom: 7 }}>
            <h4 className={classes.shootingName}>{shooting.title}</h4>
          </Grid>
        )}
        {shooting.pricingPackage && shooting.pricingPackage.photographerEarning && isPhotographer && (
          <Grid item xs={12} md={3}>
            <h5 align="right" className={classes.rewardText}>
              {`${currencySymbol} ${shooting.pricingPackage.photographerEarning}`}
            </h5>
            {shooting.refund > 0 && shooting.state !== SHOOTINGS_STATUSES.ASSIGNED && (
              <h5 align="right" className={classes.rewardText} style={{ fontSize: 12 }}>
                {`${currencySymbol} ${shooting.refund}`}
              </h5>
            )}
          </Grid>
        )}
        <Grid item xs={12} md={12}>
          <div style={{ display: 'flex', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
              <img src={CalendarGrayIcon} alt="upload" className={classes.calendarIcon} />
              <h5 className={classes.dateText}>{moment(shooting.startDate).format('LL')}</h5>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 10 }}>
              <img src={ClockIcon} style={{ width: '30px', marginRight: 0, marginTop: 2 }} alt="upload" className={classes.leftIcon} />
              <h5 className={classes.dateText}>
                {`${moment(shooting.startDate).format('HH:mm')} - ${moment(shooting.endDate).format('HH:mm')}`}
              </h5>
            </div>
          </div>
        </Grid>
        <div style={{ display: 'flex' }}>
          <div>
            <h4 className={classes.codeTitle}>{translations.t('shootings.shootingCode')}</h4>
            <h4 className={classes.codeText}>{shooting.code}</h4>
          </div>
          <div style={{ marginLeft: 20 }}>
            <h4 className={classes.codeTitle}>{translations.t('shootings.shotingStatus')}</h4>
            <h4 className={classes.statusText} style={{ color: statusColor }}>
              {translations.t(`shootingStatuses.${mapOrderStatus(isBoom, isPhotographer, shooting.state)}`).toUpperCase()}
            </h4>
          </div>
        </div>
      </Grid>
    </Button>
  );
};

ShootingItem.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  activity: PropTypes.shape({}).isRequired,
  onSelectItem: PropTypes.func.isRequired,
  style: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(ShootingItem);
