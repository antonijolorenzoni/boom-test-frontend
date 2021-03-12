//
// ──────────────────────────────────────────────────────────────── I ──────────
//   :::::: B A L A N C E   V I E W : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────
//

import { withStyles } from '@material-ui/core';
import FileIcon from '@material-ui/icons/FileCopy';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { change, initialize } from 'redux-form';
import InvoiceTableFiltersForm from '../../../components/Forms/ReduxForms/Invoice/InvoiceTableFiltersForm';
import InvoiceTable from '../../../components/Invoicing/InvoiceTable/InvoiceTable';
import Spinner from '../../../components/Spinner/Spinner';
import { elaborateInvoiceTotalBalance } from '../../../config/utils';
import * as BalanceActions from '../../../redux/actions/balance.actions';
import * as InvoiceItemsActions from '../../../redux/actions/invoicingItems.actions';
import * as UtilsActions from '../../../redux/actions/utils.actions';
import * as ModalsActions from '../../../redux/actions/modals.actions';
import translations from '../../../translations/i18next';

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
});

class BalanceView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      month: String(moment().month() + 1),
      year: String(moment().year()),
    };
  }

  async componentWillMount() {
    const { dispatch } = this.props;
    const { month, year } = this.state;
    dispatch(initialize('InvoiceTableFiltersForm', { month, year }));
    dispatch(BalanceActions.resetBalanceItemsData());
    this.onFilterInvoices({ month, year });
  }

  async onFilterInvoices(filters) {
    const { dispatch, onFetchBalance } = this.props;
    const { month, year } = filters;
    this.setState({ month, year });
    const fromDate = moment()
      .set('month', month - 1)
      .set('year', year)
      .startOf('month');
    const toDate = moment()
      .set('month', month - 1)
      .set('year', year)
      .endOf('month');
    dispatch(BalanceActions.setBalanceItemsFilter('dateFrom', moment(fromDate).valueOf()));
    dispatch(BalanceActions.setBalanceItemsFilter('dateTo', moment(toDate).valueOf()));
    this.setState({ isLoading: true });
    try {
      await onFetchBalance();
      this.setState({ isLoading: false });
    } catch (error) {
      this.setState({ isLoading: false });
    }
  }

  async onResetInvoiceFilters() {
    const { dispatch } = this.props;
    const month = String(moment().month() + 1);
    const year = String(moment().year());
    dispatch(change('InvoiceTableFiltersForm', 'month', month));
    dispatch(change('InvoiceTableFiltersForm', 'year', year));
    this.onFilterInvoices({ month, year });
  }

  onDeleteInvoiceItemRequest(invoiceItem) {
    const { dispatch } = this.props;
    dispatch(
      ModalsActions.showModal('DELETE_INVOICE_DIALOG', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          title: translations.t('forms.warning'),
          bodyText: translations.t('forms.confirmCancelInvoiceItem'),
          onConfirm: () => this.onDeleteInvoiceItemConfirm(invoiceItem),
          confirmText: translations.t('modals.confirm'),
        },
      })
    );
  }

  async onDeleteInvoiceItemConfirm(invoiceItem) {
    const { dispatch } = this.props;
    dispatch(ModalsActions.hideModal('DELETE_INVOICE_DIALOG'));
    dispatch(UtilsActions.setSpinnerVisibile(true));
    try {
      await dispatch(InvoiceItemsActions.deleteInvoiceItem(invoiceItem.id));
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('DELETE_INVOICE_SUCCESS', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('forms.invoiceItemCancelSuccess'),
          },
        })
      );
      const { month, year } = this.state;
      dispatch(BalanceActions.resetBalanceItemsData());
      this.onFilterInvoices({ month, year });
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('CONFIRM_PHOTOGRAPHER_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('forms.invoiceItemCancelError'),
          },
        })
      );
    }
  }

  render() {
    const {
      balance: {
        data: { content: invoiceData },
      },
      user: {
        data: { isBoom },
      },
    } = this.props;
    const { isLoading, month, year } = this.state;
    const grouped = _.groupBy(invoiceData, (invoice) => invoice.currency.symbol);
    const dateTitle = moment()
      .month(month - 1)
      .year(year)
      .format('MMMM YYYY');
    return (
      <div>
        <InvoiceTableFiltersForm
          onSubmit={(filters) => this.onFilterInvoices(filters)}
          onResetFilters={() => this.onResetInvoiceFilters()}
        />
        {isLoading ? (
          <Spinner
            title={translations.t('general.loading')}
            hideLogo
            spinnerStyle={{ color: '#5AC0B1', marginTop: 10 }}
            titleStyle={{ color: '#80888d', marginTop: 5, fontSize: 12 }}
          />
        ) : (
          <div>
            {_.isEmpty(grouped) ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FileIcon style={{ color: '#80888d' }} />
                <h4 style={{ color: '#80888d', margin: 0, marginLeft: 10 }}>{translations.t('invoice.noInvoiceFound')}</h4>
              </div>
            ) : (
              <div>
                <h2 style={{ fontSize: 25 }}>{dateTitle}</h2>
                {_.map(grouped, (invoices, key) => (
                  <InvoiceTable
                    key={key}
                    isBoom={isBoom}
                    invoiceData={invoices}
                    title={translations.t(`currencies.${_.first(invoices).currency.alphabeticCode}`)}
                    dateTitle={dateTitle}
                    total={elaborateInvoiceTotalBalance(invoices)}
                    currencySymbol={_.first(invoices).currency.symbol || '€'}
                    onDeleteInvoiceItem={(invoice) => this.onDeleteInvoiceItemRequest(invoice)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  balance: state.balance,
});

export default connect(mapStateToProps)(withStyles(styles)(withRouter(BalanceView)));
