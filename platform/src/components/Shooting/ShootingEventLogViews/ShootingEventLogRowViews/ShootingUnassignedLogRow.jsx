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

const ShootingUnassignedLogRow = ({ event, classes }) => {
  const { user, photographer, createdAt } = event;
  const username = user && user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : '';
  const photographerFull =
    photographer && photographer.user ? `${photographer.user.firstName || ''} ${photographer.user.lastName || ''}` : '';
  const translationString = user ? 'shootingUnassignedMessageWithUser' : 'shootingUnassignedMessage';
  return (
    <div key={event.id} style={{ margin: 5 }}>
      <h4 className={classes.eventText}>
        {translations.t(`shootingEvents.${translationString}`, {
          fromUser: username,
          photographer: photographerFull,
        })}
        <Tooltip placement="right" title={`${moment(createdAt).format('L')} ${moment(createdAt).format('HH:mm')}`}>
          <span className={classes.eventText}>{translations.t('shootingEvents.fromNow', { fromNow: moment(createdAt).fromNow() })}</span>
        </Tooltip>
      </h4>
    </div>
  );
};

export default _.flow([withStyles(styles), connect()])(ShootingUnassignedLogRow);
