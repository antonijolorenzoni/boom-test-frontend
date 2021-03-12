import React from 'react';
import { withStyles, Tooltip } from '@material-ui/core';
import translations from '../../../../translations/i18next';
import moment from 'moment';
import { featureFlag } from 'config/featureFlags';

const styles = (theme) => ({
  eventText: {
    color: '#80888f',
    fontWeight: '100',
    margin: 0,
    fontSize: 12,
  },
});

const ShootingEditingMovedInternallyLogRow = ({ event, classes, isBoom }) => {
  const { createdAt } = event;

  const isEditingEnable = featureFlag.isFeatureEnabled('editing-a1');

  return isBoom && isEditingEnable ? (
    <div key={event.id} style={{ margin: 5 }}>
      <h4 className={classes.eventText}>
        {translations.t('shootingEvents.editingMovedInternally')}
        <Tooltip placement="right" title={`${moment(createdAt).format('L')} ${moment(createdAt).format('HH:mm')}`}>
          <span className={classes.eventText}>{translations.t('shootingEvents.fromNow', { fromNow: moment(createdAt).fromNow() })}</span>
        </Tooltip>
      </h4>
    </div>
  ) : null;
};

export default withStyles(styles)(ShootingEditingMovedInternallyLogRow);
