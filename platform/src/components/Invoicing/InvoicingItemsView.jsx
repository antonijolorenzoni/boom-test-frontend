import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { initialize } from 'redux-form';
import _ from 'lodash';
import { PERMISSIONS, PERMISSION_ENTITIES, INVOICE_ITEMS_TYPES } from '../../config/consts';
import { elaborateIsIncomeFromItemType } from '../../config/utils';
import * as ShootingActions from '../../redux/actions/shootings.actions';
import * as InvoicingItemsAPI from '../../api/invoicingItemsAPI';
import * as UtilsActions from '../../redux/actions/utils.actions';
import * as ModalsActions from '../../redux/actions/modals.actions';
import translations from '../../translations/i18next';
import AbilityProvider from '../../utils/AbilityProvider';
import InvoiceItemsForm from '../Forms/ReduxForms/Invoice/InvoiceItemsForm';
import { Accordion, Button } from 'ui-boom-components';
import Permission from '../Permission/Permission';
import InvoicingItemsList from './InvoicingItemsList';

const InvoicingWrapper = styled.div`
  flex-basis: 85%;

  @media (max-width: 768px) {
    flex-basis: 78%;
  }
`;

class InvoicingItemsView extends React.Component {
  onDeleteInvoiceItemRequest(item) {
    const { dispatch } = this.props;
    dispatch(
      ModalsActions.showModal('DELETE_USER_MODAL', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          title: translations.t('forms.warning'),
          bodyText: translations.t('users.deleteUserConfirm'),
          onConfirm: () => this.onDeleteInvoiceItemConfirm(item),
        },
      })
    );
  }

  async onDeleteInvoiceItemConfirm(item) {
    const {
      dispatch,
      shootings: { selectedShooting: shooting },
    } = this.props;

    dispatch(UtilsActions.setSpinnerVisibile(true));

    try {
      await InvoicingItemsAPI.deleteInvoiceItem(item.id);
      dispatch(ShootingActions.setSelectedShooting({ ...shooting, items: shooting.items.filter((i) => i.id !== item.id) }));

      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(ModalsActions.hideModal('DELETE_USER_MODAL'));
      dispatch(
        ModalsActions.showModal('INVOICE_ITEM_DELETE_SUCCESS', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('invoice.deleteInvoiceSuccess'),
          },
        })
      );
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('INVOICE_ITEM_DELETE_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('invoice.deleteInvoiceError'),
          },
        })
      );
    }
  }

  onNewInvoiceItem() {
    const {
      dispatch,
      shootings: { selectedShooting: shooting },
      currencies: { content: currenciesData },
    } = this.props;

    const currency = _.get(
      shooting,
      'pricingPackage.currency',
      _.find(currenciesData, (currencyState) => currencyState.id === 1)
    );

    dispatch(initialize('InvoiceItemsForm', { currencyId: currency.id }));
    dispatch(
      ModalsActions.showModal('NEW_INVOICE_ITEM_OPERATIONAL_VIEW', {
        modalType: 'OPERATIONAL_VIEW',
        modalProps: {
          title: translations.t('invoice.newPenaltiesRefund'),
          content: <InvoiceItemsForm currency={currency} onSubmit={(itemData) => this.onCreateNewItemForShooting(itemData)} />,
          cancelText: translations.t('forms.close'),
        },
      })
    );
  }

  async onCreateNewItemForShooting(itemData) {
    const {
      dispatch,
      shootings: { selectedShooting: shooting },
    } = this.props;

    dispatch(UtilsActions.setSpinnerVisibile(true));

    try {
      const { photographer, id: shootingId, company } = shooting;
      let itemDTO = {
        ...itemData,
        shootingId,
        photographerId: photographer && photographer.id,
        itemDate: moment().valueOf(),
        income: elaborateIsIncomeFromItemType(itemData.type),
        companyId: company && company.id,
      };

      if (itemDTO.type === INVOICE_ITEMS_TYPES.COMPANY_PENALTY || itemDTO.type === INVOICE_ITEMS_TYPES.COMPANY_REFUND) {
        itemDTO = _.omit(itemDTO, 'photographerId');
      } else if (itemDTO.type === INVOICE_ITEMS_TYPES.PHOTOGRAPHER_PENALTY || itemDTO.type === INVOICE_ITEMS_TYPES.PHOTOGRAPHER_REFUND) {
        itemDTO = _.omit(itemDTO, 'companyId');
      }

      const createInvoiceItemResponse = await InvoicingItemsAPI.createInvoiceItem(itemDTO);
      const createdInvoiceItem = createInvoiceItemResponse.data;

      dispatch(ShootingActions.setSelectedShooting({ ...shooting, items: [...shooting.items, createdInvoiceItem] }));

      dispatch(ModalsActions.hideModal('NEW_INVOICE_ITEM_OPERATIONAL_VIEW'));
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('INVOICE_ITEM_DELETE_SUCCESS', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('invoice.createItemSuccess'),
          },
        })
      );
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('INVOICE_ITEM_CREATE_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('invoice.createItemError'),
          },
        })
      );
    }
  }

  render() {
    const {
      shootings: { selectedShooting: shooting },
      statusColor,
    } = this.props;

    const canDelete = AbilityProvider.getOrganizationAbilityHelper().hasPermission([PERMISSIONS.DELETE], PERMISSION_ENTITIES.INVOICEITEM);

    return (
      <>
        <div style={{ fontSize: 17, marginBottom: 18, fontWeight: 500 }}>{translations.t('invoice.manageItemsShootingdDescription')}</div>
        <div style={{ display: 'flex' }}>
          <InvoicingWrapper>
            <Accordion
              title={translations.t('shootings.showInvoices')}
              color={statusColor}
              wrapperStyle={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #a3abb1',
                borderRadius: 6,
                padding: '8px 16px',
              }}
            >
              <InvoicingItemsList
                statusColor={statusColor}
                items={shooting.items}
                onDelete={canDelete ? (item) => this.onDeleteInvoiceItemRequest(item) : null}
              />
            </Accordion>
          </InvoicingWrapper>
          <div style={{ display: 'flex', flexGrow: 1, marginTop: 8, justifyContent: 'flex-end' }}>
            <Permission
              do={[PERMISSIONS.READ]}
              on={PERMISSION_ENTITIES.INVOICEITEM}
              abilityHelper={AbilityProvider.getOrganizationAbilityHelper()}
            >
              <Button backgroundColor={statusColor} onClick={() => this.onNewInvoiceItem()} size="small">
                {translations.t('general.add')}
              </Button>
            </Permission>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  currencies: state.utils.currencies,
  shootings: state.shootings,
});

export default connect(mapStateToProps)(InvoicingItemsView);
