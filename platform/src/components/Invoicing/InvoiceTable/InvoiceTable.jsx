import { withStyles, IconButton } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import SaveIcon from '@material-ui/icons/SaveAlt';
import { PDFDownloadLink } from '@react-pdf/renderer';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { withRouter } from 'react-router-dom';
import translations from '../../../translations/i18next';
import InvoicePDF from '../InvoicePDF';
import DeleteIcon from '@material-ui/icons/Delete';
import Permission from '../../Permission/Permission';
import { PERMISSIONS, PERMISSION_ENTITIES, INVOICE_ITEMS_TYPES } from '../../../config/consts';
import AbilityProvider from '../../../utils/AbilityProvider';

const styles = (theme) => ({
  container: {
    paddingLeft: 20,
    height: '100vh',
  },
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  tableTitle: {
    marginTop: 0,
    marginBottom: 0,
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  downloadLink: {
    color: '#80888d',
  },
  downloadIcon: {
    color: '#80888d',
    marginLeft: 10,
  },
});

class InvoiceTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      document: null,
    };
  }

  componentWillMount() {
    const { invoiceData, dateTitle, total, currencySymbol } = this.props;
    const document = (
      <InvoicePDF
        title={`${translations.t('invoice.invoice')} ${dateTitle} (${currencySymbol})`}
        data={invoiceData}
        total={total}
        currencySymbol={currencySymbol}
      />
    );
    this.setState({ document });
  }

  render() {
    const { invoiceData, isBoom, title, dateTitle, total, classes, currencySymbol, onDeleteInvoiceItem } = this.props;
    const { document } = this.state;
    return (
      <div style={{ marginTop: 30 }}>
        <div className={classes.tableHeader}>
          <h4 className={classes.tableTitle}>{title}</h4>
          <div style={{ display: 'flex' }}>
            <PDFDownloadLink
              document={document}
              fileName={`${translations.t('invoice.invoice')}_${dateTitle}_${title}`}
              className={classes.downloadLink}
            >
              {({ blob, url, loading, error }) =>
                loading ? translations.t('invoice.loadingDocument') : translations.t('invoice.download')
              }
            </PDFDownloadLink>
            <SaveIcon className={classes.downloadIcon} />
          </div>
        </div>

        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>{translations.t('forms.invoiceItemDescription')}</TableCell>
                <TableCell align="right">{translations.t('organization.creationDate')}</TableCell>
                <TableCell align="right">{translations.t('forms.invoiceItemValue')}</TableCell>
                {isBoom && (
                  <Permission
                    do={[PERMISSIONS.DELETE]}
                    on={PERMISSION_ENTITIES.INVOICEITEM}
                    abilityHelper={AbilityProvider.getOrganizationAbilityHelper()}
                  >
                    <TableCell align="right">{translations.t('shootings.shootingActions')}</TableCell>
                  </Permission>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {_.map(invoiceData, (invoice) => {
                const canDeleteInvoiceItem =
                  isBoom &&
                  !invoice.deleted &&
                  (invoice.type === INVOICE_ITEMS_TYPES.COMPANY_REFUND ||
                    invoice.type === INVOICE_ITEMS_TYPES.COMPANY_PENALTY ||
                    invoice.type === INVOICE_ITEMS_TYPES.PHOTOGRAPHER_REFUND ||
                    invoice.type === INVOICE_ITEMS_TYPES.PHOTOGRAPHER_TRAVEL_EXPENSES ||
                    invoice.type === INVOICE_ITEMS_TYPES.PHOTOGRAPHER_PENALTY);
                return (
                  <TableRow key={invoice.id}>
                    <TableCell style={{ width: '50%', textDecoration: invoice.deleted ? 'line-through' : null }} component="th" scope="row">
                      {invoice.description}
                    </TableCell>
                    <TableCell align="right" style={{ textDecoration: invoice.deleted ? 'line-through' : null }}>
                      {moment(invoice.itemDate).format('L')}
                    </TableCell>
                    <TableCell align="right" style={{ textDecoration: invoice.deleted ? 'line-through' : null }}>
                      {`${invoice.income ? '' : '-'} ${invoice.amount} ${
                        invoice.currency && invoice.currency.symbol ? invoice.currency.symbol : ''
                      }`}
                    </TableCell>
                    {isBoom && (
                      <Permission
                        do={[PERMISSIONS.DELETE]}
                        on={PERMISSION_ENTITIES.INVOICEITEM}
                        abilityHelper={AbilityProvider.getOrganizationAbilityHelper()}
                      >
                        <TableCell align="right">
                          <IconButton disabled={!canDeleteInvoiceItem} onClick={() => onDeleteInvoiceItem(invoice)}>
                            {canDeleteInvoiceItem ? <DeleteIcon /> : null}
                          </IconButton>
                        </TableCell>
                      </Permission>
                    )}
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell colSpan={1} />
                <TableCell align="right" style={{ fontWeight: 'bold' }}>{`${translations.t('invoice.total')}`}</TableCell>
                <TableCell align="right" style={{ fontWeight: 'bold' }}>{`${total} ${currencySymbol}`}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(InvoiceTable));
