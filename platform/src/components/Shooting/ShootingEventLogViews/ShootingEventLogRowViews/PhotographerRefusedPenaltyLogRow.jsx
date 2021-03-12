import { withStyles, Tooltip } from '@material-ui/core';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import translations from '../../../../translations/i18next';

const styles = (theme) => ({
  eventText: {
    color: '#80888f',
    fontWeight: '100',
    margin: 0,
    fontSize: 12,
  },
});

const PhotographerRefusedPenaltyLogRow = ({ event, classes }) => {
  const { invoiceItem, photographer, createdAt } = event;
  const percentage = invoiceItem && invoiceItem.level ? invoiceItem.level : null;
  const currency = invoiceItem && invoiceItem.currency && invoiceItem.currency.symbol ? invoiceItem.currency.symbol : '€';
  const photographerFull =
    photographer && photographer.user ? `${photographer.user.firstName || ''} ${photographer.user.lastName || ''}` : '';
  const penaltyAmount = invoiceItem && invoiceItem.amount;
  const severityLevel = percentage ? translations.t('shootingEvents.percentageOfTotal', { percentage }) : '';

  if (penaltyAmount === 0) {
    return null;
  }

  return (
    <div key={event.id} style={{ margin: 5 }}>
      <h4 className={classes.eventText}>
        {translations.t('shootingEvents.photographerRefusedPenaltyMessage', {
          photographer: photographerFull,
          amount: `${penaltyAmount} ${currency}`,
          severityLevel,
        })}
        <Tooltip placement="right" title={`${moment(createdAt).format('L')} ${moment(createdAt).format('HH:mm')}`}>
          <span className={classes.eventText}>{translations.t('shootingEvents.fromNow', { fromNow: moment(createdAt).fromNow() })}</span>
        </Tooltip>
      </h4>
    </div>
  );
};

export default _.flow([withStyles(styles), connect()])(PhotographerRefusedPenaltyLogRow);
