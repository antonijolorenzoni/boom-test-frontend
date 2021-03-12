import React from 'react';
import _ from 'lodash';
import { withStyles, Tooltip } from '@material-ui/core';
import { connect } from 'react-redux';
import moment from 'moment';
import translations from '../../../../translations/i18next';

const styles = (theme) => ({
  eventText: {
    color: '#80888f',
    fontWeight: '100',
    margin: 0,
    fontSize: 12,
  },
});

const ShootingRescheduledLogRow = ({ event, shooting, isBoom, classes }) => {
  const { user, createdAt, payload, source } = event;

  const firstName = _.get(user, 'firstName', '');
  const lastName = _.get(user, 'lastName', '');

  const username = `${firstName} ${lastName}`;
  let subject = user.deleted ? `User${user.id}(${translations.t('shootingEvents.isDeletedUser')})` : username;
  const isSubjectBoom = user && user.organization && user.organization === 1;
  if (isSubjectBoom && !isBoom) {
    subject = translations.t('shootingEvents.userBoom');
  }

  let parsedPayload;
  let translationComponent = translations.t('shootingEvents.shootingRescheduledMessage', { subject });
  try {
    parsedPayload = JSON.parse(payload);
    if (parsedPayload) {
      const { origPlace, origDate, curPlace, curDate } = parsedPayload;
      const newAddress = curPlace && curPlace.formattedAddress;
      const newDate = curDate && moment(curDate).format('LLL');
      const originAddress = origPlace && origPlace.formattedAddress ? origPlace.formattedAddress : newAddress;
      const originDate = origDate ? moment(origDate).format('LLL') : newDate;
      if (newAddress && newDate && originAddress && originDate) {
        translationComponent = translations.t('shootingEvents.shootingRescheduledCompleteMessage', {
          subject,
          originDate,
          originAddress,
          newDate,
          newAddress,
          actor: translations.t(`scheduleActors.${source}`),
        });
      }
    }
  } catch (error) {
    parsedPayload = null;
  }

  return (
    <div key={event.id} style={{ margin: 5 }}>
      <h4 className={classes.eventText}>
        {translationComponent}
        <Tooltip placement="right" title={`${moment(createdAt).format('L')} ${moment(createdAt).format('HH:mm')}`}>
          <span className={classes.eventText}>{translations.t('shootingEvents.fromNow', { fromNow: moment(createdAt).fromNow() })}</span>
        </Tooltip>
      </h4>
    </div>
  );
};

export default _.flow([withStyles(styles), connect()])(ShootingRescheduledLogRow);
