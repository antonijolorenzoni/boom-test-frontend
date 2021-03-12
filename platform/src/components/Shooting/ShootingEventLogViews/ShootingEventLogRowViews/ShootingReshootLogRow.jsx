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

const ShootingReshootLogRow = ({ event, isBoom, classes }) => {
  const { user, createdAt } = event;
  const username = user && user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : '';
  const isSubjectBoom = user && user.organization && user.organization === 1;

  let subject = user.deleted ? `User${user.id}(${translations.t('shootingEvents.isDeletedUser')})` : `${username}`;
  if (isSubjectBoom && !isBoom) {
    subject = translations.t('shootingEvents.userBoom');
  }

  return (
    <div key={event.id} style={{ margin: 5 }}>
      <h4 className={classes.eventText}>
        {translations.t('shootingEvents.shootingReshootMessage', {
          subject,
        })}
        <Tooltip placement="right" title={`${moment(createdAt).format('L')} ${moment(createdAt).format('HH:mm')}`}>
          <span className={classes.eventText}>{translations.t('shootingEvents.fromNow', { fromNow: moment(createdAt).fromNow() })}</span>
        </Tooltip>
      </h4>
    </div>
  );
};

export default _.flow([withStyles(styles), connect()])(ShootingReshootLogRow);
