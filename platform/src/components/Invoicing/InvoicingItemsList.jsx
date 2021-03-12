import CardMembership from '@material-ui/icons/CardMembership';
import _ from 'lodash';
import React from 'react';
import translations from '../../translations/i18next';
import Spinner from '../Spinner/Spinner';
import InvoiceItemRow from './InvoiceItemRow';

const InvoicingItemsList = ({ items, pagination, isLoading, onLoadMore, onDelete, statusColor }) => (
  <>
    {_.map(items, (item) => (
      <InvoiceItemRow
        containerstyle={{ borderTopColor: statusColor }}
        key={item.id}
        horizontal
        item={item}
        onDelete={onDelete ? () => onDelete(item) : null}
      />
    ))}
    {_.isEmpty(items) && !isLoading && (
      <div style={{ padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CardMembership style={{ fontSize: 20, color: '#7F888F', marginRight: 20 }} />
        <h5 style={{ margin: 0, paddingTop: 5, color: '#7F888F' }}>{translations.t('invoice.noInvoiceItemFound')}</h5>
      </div>
    )}
    {isLoading && (
      <Spinner
        title={translations.t('general.loading')}
        hideLogo
        spinnerStyle={{ color: '#5AC0B1', marginTop: 10 }}
        titleStyle={{ color: '#80888d', marginTop: 5, fontSize: 12 }}
      />
    )}
  </>
);

export default InvoicingItemsList;
