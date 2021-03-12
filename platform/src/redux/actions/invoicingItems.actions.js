//
// ────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: I N V O I C E   I T E M S   A C T I O N S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────
//

import _ from 'lodash';
import * as InvoicingItemsAPI from '../../api/invoicingItemsAPI';
import { INVOICE_ITEMS_TYPES } from '../../config/consts';
import {
  SAVE_INVOICING_ITEMS,
  APPEND_INVOICING_ITEMS,
  SAVE_INVOICING_ITEMS_PAGINATION,
  SET_SELECTED_INVOICING_ITEM,
  RESET_INVOICING_ITEMS_DATA,
  SET_INVOICING_ITEMS_FILTER,
  RESET_INVOICING_ITEMS_FILTERS,
  DELETE_INVOICE_ITEM,
  UPDATE_OR_ADD_INVOICE_ITEM,
} from './actionTypes/invoicingItems';

export function saveInvoicingItems(items) {
  return {
    type: SAVE_INVOICING_ITEMS,
    items,
  };
}

export function appendInvoicingItems(items) {
  return {
    type: APPEND_INVOICING_ITEMS,
    items,
  };
}

export function saveInvoicingItemsPagination(pagination) {
  return {
    type: SAVE_INVOICING_ITEMS_PAGINATION,
    pagination,
  };
}
export function setSelectedInvoicingItems(item) {
  return {
    type: SET_SELECTED_INVOICING_ITEM,
    item,
  };
}

export function setInvoicingItemFilter(field, value) {
  return {
    type: SET_INVOICING_ITEMS_FILTER,
    field,
    value,
  };
}

export function updateOrAddInvoiceItem(item) {
  return {
    type: UPDATE_OR_ADD_INVOICE_ITEM,
    item,
  };
}

export function removeInvoiceItem(itemId) {
  return {
    type: DELETE_INVOICE_ITEM,
    itemId,
  };
}

export function resetInvoicingItemsFilters() {
  return { type: RESET_INVOICING_ITEMS_FILTERS };
}

export function resetInvoicingItemsData() {
  return { type: RESET_INVOICING_ITEMS_DATA };
}

export function fetchInvoicingItems(page = 0, pageSize = 10) {
  return async (dispatch, getState) => {
    try {
      const {
        invoicingItems: {
          data: { filters, entities },
        },
      } = getState();
      const params = {
        page,
        pageSize,
        ...filters,
        ...entities,
      };
      const invoicingItemsResponse = await InvoicingItemsAPI.fetchInvoicingItems(params);
      if (invoicingItemsResponse && invoicingItemsResponse.data && invoicingItemsResponse.data.content) {
        dispatch(saveInvoicingItems(invoicingItemsResponse.data.content));
        dispatch(saveInvoicingItemsPagination(_.omit(invoicingItemsResponse.data, 'content')));
        return invoicingItemsResponse.data.content;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function fetchAndAppendInvoiceItems(page = 0, pageSize = 10) {
  return async (dispatch, getState) => {
    try {
      const {
        invoicingItems: {
          data: { filters, entities },
        },
      } = getState();
      const params = {
        page,
        pageSize,
        ...filters,
        ...entities,
      };
      const invoicingItemsResponse = await InvoicingItemsAPI.fetchInvoicingItems(params);
      if (invoicingItemsResponse && invoicingItemsResponse.data && invoicingItemsResponse.data.content) {
        dispatch(appendInvoicingItems(invoicingItemsResponse.data.content));
        dispatch(saveInvoicingItemsPagination(_.omit(invoicingItemsResponse.data, 'content')));
        return invoicingItemsResponse.data.content;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function deleteInvoiceItem(invoiceItemId) {
  return async (dispatch) => {
    try {
      const invoiceDeleteResponse = await InvoicingItemsAPI.deleteInvoiceItem(invoiceItemId);
      if (invoiceDeleteResponse) {
        dispatch(removeInvoiceItem(invoiceItemId));
        return invoiceDeleteResponse;
      }
      throw new Error();
    } catch (error) {
      throw new Error();
    }
  };
}

export function createInvoiceItem(invoiceItemDTO) {
  return async (dispatch) => {
    try {
      let formattedDTO = invoiceItemDTO;
      if (invoiceItemDTO.type === INVOICE_ITEMS_TYPES.COMPANY_PENALTY || invoiceItemDTO.type === INVOICE_ITEMS_TYPES.COMPANY_REFUND) {
        formattedDTO = _.omit(invoiceItemDTO, 'photographerId');
      } else if (
        invoiceItemDTO.type === INVOICE_ITEMS_TYPES.PHOTOGRAPHER_PENALTY ||
        invoiceItemDTO.type === INVOICE_ITEMS_TYPES.PHOTOGRAPHER_REFUND
      ) {
        formattedDTO = _.omit(invoiceItemDTO, 'companyId');
      }
      const invoiceDeleteResponse = await InvoicingItemsAPI.createInvoiceItem(formattedDTO);
      if (invoiceDeleteResponse && invoiceDeleteResponse.data) {
        dispatch(updateOrAddInvoiceItem(invoiceDeleteResponse.data));
        return invoiceItemDTO;
      }
      throw new Error();
    } catch (error) {
      throw new Error();
    }
  };
}
