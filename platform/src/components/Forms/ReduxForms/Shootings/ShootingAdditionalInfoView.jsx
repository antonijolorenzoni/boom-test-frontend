//
// ──────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: S H O O T I N G   A D D I T I O N A L   I N F O   V I E W : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import { Grid, withStyles } from '@material-ui/core';
import PlaceIcon from '@material-ui/icons/Place';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import translations from 'translations/i18next';
import { calculateIsDifferentTimezone, getDiffDaysWhenDifferentTimezone } from 'config/utils';
import { Typography } from 'ui-boom-components';

const styles = (theme) => ({
  title: {
    color: '#80888D',
    fontSize: 12,
    marginBottom: 0,
    fontWeight: 500,
    '@media(max-width: 768px)': {
      fontSize: 19,
    },
    marginTop: 25,
  },
  subTitle: {
    fontSize: 13,
    color: '#000000',
    marginTop: 3,
    marginBottom: 0,
    fontWeight: 500,
    '@media(max-width: 768px)': {
      fontSize: 20,
    },
  },
  gridItem: {
    display: 'flex',
    flexDirection: 'column',
    wordBreak: 'break-word',
  },
  textWithLeftIcon: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  leftIcon: {
    color: '#80888D',
    height: '0.7em',
    marginRight: 5,
    marginTop: 3,
  },
});

const ShootingAdditionalInfoView = ({ classes, shooting }) => {
  const shootingTimezone = shooting.timezone;
  const isDifferentTimezone = calculateIsDifferentTimezone(shooting);
  const businessName = _.get(shooting, 'mainContact.businessName');

  const diffDays = getDiffDaysWhenDifferentTimezone(shooting.startDate, shootingTimezone);

  return (
    <div>
      <Grid container>
        <Grid item className={classes.gridItem}>
          <span className={classes.title}>{translations.t('shootings.shootingDateAndTime')}</span>
          <div className={classes.textWithLeftIcon}>
            <CalendarTodayIcon className={classes.leftIcon} />
            <span className={classes.subTitle}>{moment(shooting.startDate).format('LL')}</span>
          </div>
          <div className={classes.textWithLeftIcon}>
            <AccessTimeIcon className={classes.leftIcon} />
            <div>
              <span className={classes.subTitle}>
                {`${moment(shooting.startDate).format('LT')} - ${moment(shooting.endDate).format('LT')}`}
              </span>
              {isDifferentTimezone && (
                <span className={classes.subTitle} style={{ marginLeft: 16 }}>
                  {`${moment.tz(shootingTimezone).zoneAbbr()} ${moment(shooting.startDate).tz(shootingTimezone).format('LT')} - ${moment(
                    shooting.endDate
                  )
                    .tz(shootingTimezone)
                    .format('LT')}`}
                </span>
              )}
              {diffDays !== 0 && (
                <Typography variantName="overline" style={{ minWidth: 40 }}>{`(${diffDays} ${translations.t(
                  'shootings.shortDays'
                )})`}</Typography>
              )}
            </div>
          </div>
          <span className={classes.title}>{translations.t('shootings.shootingAddress')}</span>
          {shooting.place && shooting.place.formattedAddress && (
            <div className={classes.textWithLeftIcon}>
              <PlaceIcon className={classes.leftIcon} />
              <span
                className={classes.subTitle}
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${shooting.place.location.latitude},${shooting.place.location.longitude}`
                  )
                }
              >
                {shooting.place.formattedAddress}
              </span>
            </div>
          )}
          {businessName && (
            <Typography style={{ marginLeft: 28, color: '#000000' }} variantName="title3">
              {businessName}
            </Typography>
          )}
          <span className={classes.title}>{translations.t('shootings.shootingDetails')}</span>
          {shooting.description && <span className={classes.subTitle}>{shooting.description}</span>}
          <span className={classes.title}>{translations.t('shootings.shootingLogisticInfo')}</span>
          {shooting.logisticInformation && <span className={classes.subTitle}>{shooting.logisticInformation}</span>}
        </Grid>
      </Grid>
    </div>
  );
};

export default _.flow([withStyles(styles), connect()])(ShootingAdditionalInfoView);
