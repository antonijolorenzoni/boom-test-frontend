import React from 'react';
import _ from 'lodash';
import { withStyles, Tooltip } from '@material-ui/core';
import { connect } from 'react-redux';
import moment from 'moment';
import translations from 'translations/i18next';
import { get } from 'lodash';

const styles = () => ({
  eventText: {
    color: '#80888f',
    fontWeight: '100',
    margin: 0,
    fontSize: 12,
  },
});

const ShootingPhotoAcceptedAutoLogRow = ({ event, classes }) => {
  const { user, createdAt } = event;

  const getUserName = () => {
    if (user.deleted) {
      return `User${user.id}(${translations.t('shootingEvents.isDeletedUser')})`;
    }
    return `${get(user, 'firstName', '')} ${get(user, 'lastName', '')}`;
  };

  return (
    <div key={event.id} style={{ margin: 5 }}>
      <h4 className={classes.eventText}>
        {translations.t('shootingEvents.shootingPhotoAcceptedAutoFirstRow', {
          userName: getUserName(),
        })}
        <Tooltip placement="right" title={`${moment(createdAt).format('L')} ${moment(createdAt).format('HH:mm')}`}>
          <span className={classes.eventText}>{translations.t('shootingEvents.fromNow', { fromNow: moment(createdAt).fromNow() })}</span>
        </Tooltip>
      </h4>
      <h4 className={classes.eventText}>
        {translations.t('shootingEvents.shootingPhotoAcceptedAutoSecondRow', {
          editorName: 'external editor',
        })}
      </h4>
    </div>
  );
};

export default _.flow([withStyles(styles), connect()])(ShootingPhotoAcceptedAutoLogRow);
