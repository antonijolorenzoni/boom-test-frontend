import { withStyles, Tooltip } from '@material-ui/core';
import _ from 'lodash';
import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import translations from '../../../../translations/i18next';
import { HIDDEN_INVOICE_TYPES_EVENTS } from '../../../../config/consts';
import { elaborateInvoiceItemEventMessage, elaborateSeverityLevelPercentage } from '../../../../config/utils';

const styles = (theme) => ({
  eventText: {
    color: '#80888f',
    fontWeight: '100',
    margin: 0,
    fontSize: 12,
  },
});

const InvoiceItemCreatedLogRow = ({ event, classes }) => {
  const { user, invoiceItem, photographer, createdAt } = event;
  const invoiceItemType = invoiceItem && invoiceItem.type ? invoiceItem.type : null;
  const amount = invoiceItem && invoiceItem.amount;
  const username = user && user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : '';
  const translationString = elaborateInvoiceItemEventMessage(`${invoiceItemType}_CREATED`, user);
  // RETURN CONDITION
  const subject = `${username || ''}`;
  if (!translationString || !invoiceItemType || invoiceItemType in HIDDEN_INVOICE_TYPES_EVENTS || amount === 0) {
    return null;
  }

  const percentage = invoiceItem && invoiceItem.level ? elaborateSeverityLevelPercentage(invoiceItem.level) : null;
  const currency = invoiceItem && invoiceItem.currency && invoiceItem.currency.symbol ? invoiceItem.currency.symbol : '€';
  const photographerFull =
    photographer && photographer.user ? `${photographer.user.firstName || ''} ${photographer.user.lastName || ''}` : '';
  const severityLevel = percentage ? `(${translations.t('shootingEvents.percentageOfTotal', { percentage })})` : '';

  return (
    <div key={event.id} style={{ margin: 5 }}>
      <h4 className={classes.eventText}>
        {translations.t(`shootingEvents.${translationString}`, {
          subject,
          photographer: photographerFull,
          amount: `${amount}${currency}`,
          percentage: severityLevel,
        })}
        <Tooltip placement="right" title={`${moment(createdAt).format('L')} ${moment(createdAt).format('HH:mm')}`}>
          <span className={classes.eventText}>{translations.t('shootingEvents.fromNow', { fromNow: moment(createdAt).fromNow() })}</span>
        </Tooltip>
      </h4>
    </div>
  );
};

export default _.flow([withStyles(styles), connect()])(InvoiceItemCreatedLogRow);
