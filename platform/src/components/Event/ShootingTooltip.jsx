//
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: S H O O T I N G   C A L E N D A R   T O O L T I P   C O M P O N E N T : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import { withStyles } from '@material-ui/core';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { reduxForm, Field } from 'redux-form';

import ClocIcon from '../../assets/icons/clock-gray.svg';
import translations from '../../translations/i18next';
import MDCheckBoxField from '../Forms/FormComponents/MDCheckBox/MDCheckBoxField';
import MDButton from '../MDButton/MDButton';
import { SHOOTING_STATUSES_UI_ELEMENTS } from '../../config/consts';
import { mapOrderStatus } from '../../config/utils';
import { GoogleMapAddress } from '../Shooting/GoogleMapAddress';

const styles = (theme) => ({
  textWithLeftIcon: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
    width: 16,
  },
  clockIcon: {
    marginRight: theme.spacing.unit,
    width: 32,
  },
  hline: {
    backgroundColor: '#dedede',
    height: 1,
    width: '100%',
  },
  map: {
    height: 100,
    width: 300,
    margin: 'auto',
    marginBottom: 10,
  },
  text: {
    margin: 0,
    fontSize: '0.875em',
    color: '#80888d',
  },
});

const ShootingTooltip = ({
  classes,
  event,
  isBoom,
  isPhotographer,
  isLoading,
  onOpenDetails,
  onChangePeriodicity,
  onDeleteUnavailability,
}) => {
  let statusColor =
    event && event.state && SHOOTING_STATUSES_UI_ELEMENTS[event.state].color ? SHOOTING_STATUSES_UI_ELEMENTS[event.state].color : '#66c0b0';

  if (!isBoom) {
    statusColor =
      event && event.state ? SHOOTING_STATUSES_UI_ELEMENTS[mapOrderStatus(isBoom, isPhotographer, event.state)].color : '#66c0b0';
  }

  return (
    <div style={{ padding: 15, paddingTop: 0, minWidth: 320 }}>
      {event && event.code ? (
        <React.Fragment>
          <h4 style={{ margin: 0, fontSize: 17 }}>{event.company.name}</h4>
          <h4 style={{ margin: 0, fontSize: 15 }}>{`Shootings ${event.title}`}</h4>
          <div className={classes.hline} style={{ marginBottom: 6, marginTop: 3 }} />
          <div className={classes.textWithLeftIcon}>
            <CalendarTodayIcon className={classes.leftIcon} />
            <h5 className={classes.text}>{`${moment(event.start).format('dddd D MMMM | H:mm')} - ${moment(event.end).format('H:mm')}`}</h5>
          </div>
          <div className={classes.hline} style={{ marginBottom: 6 }} />
          {event && event.state && (
            <div>
              <h5 className={classes.text} style={{ color: 'black', margin: 0, fontSize: 12 }}>
                {translations.t('shootings.shootingState').toUpperCase()}
              </h5>
              <h3 className={classes.text} style={{ margin: 0, fontSize: 13, color: statusColor }}>
                {translations.t(`shootingStatuses.${mapOrderStatus(isBoom, isPhotographer, event.state)}`).toUpperCase()}
              </h3>
            </div>
          )}
          <div className={classes.hline} style={{ marginBottom: 6, marginTop: 3 }} />
          <GoogleMapAddress
            address={event.place.formattedAddress}
            lat={event.place.location.latitude}
            long={event.place.location.longitude}
            color="#80888D"
          />
          <div className={classes.hline} style={{ marginBottom: 10, marginTop: 3 }} />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <MDButton
              containerstyle={{ width: 105, margin: 0 }}
              title={translations.t('calendar.details')}
              onClick={() => onOpenDetails()}
            />
          </div>
        </React.Fragment>
      ) : (
        <div style={{ width: 300 }}>
          <div className={classes.textWithLeftIcon}>
            <img src={ClocIcon} className={classes.clockIcon} alt="clock" />
            <h5 className={classes.text} style={{ marginBottom: 5 }}>{`${moment(event.start).format('H:mm')} - ${moment(event.end).format(
              'H:mm'
            )}`}</h5>
          </div>
          <h3 style={{ color: '#b0bac1', margin: 0 }}>{translations.t('calendar.youAreNotAvailable')}</h3>
          <Field
            name="periodicity"
            component={MDCheckBoxField}
            checked={event.periodicity !== 'NONE'}
            onChange={!isLoading ? (e, value) => onChangePeriodicity(value) : null}
            label={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <h4
                  style={{
                    fontSize: '1em',
                    margin: 0,
                    marginRight: 10,
                    fontWeight: 100,
                    color: '#80888d',
                  }}
                >
                  {isLoading ? translations.t('general.loading') : translations.t('calendar.repeatUnavailability')}
                </h4>
              </div>
            }
            showErrorLabel
          />
          <h5 style={{ margin: 0, fontSize: '0.875em', color: '#b0bac1' }}>{translations.t('calendar.recurrentUnavailabilityInfo')}</h5>
          <div className={classes.hline} style={{ marginBottom: 20, marginTop: 20 }} />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <MDButton
              containerstyle={{ width: '100%', margin: 0 }}
              title={translations.t('modals.delete')}
              onClick={() => onDeleteUnavailability()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default _.flow([
  withStyles(styles),
  reduxForm({
    form: 'RecurrentUnavailabilityForm',
  }),
])(ShootingTooltip);
