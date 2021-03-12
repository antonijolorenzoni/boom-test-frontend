//
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: A P I S   F O R   C R U D   A C T I O N S   O N   I N V O I C E   I T E M S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import { axiosBoomInstance } from './instances/boomInstance';
import { API_VERSION } from '../config/configurations';

export function fetchInvoicingItems(params) {
  const paramsToSend = {
    params,
  };
  return axiosBoomInstance.get(`/api/${API_VERSION}/invoicing/items`, paramsToSend);
}

export function createInvoiceItem(invoiceItemDTO) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/invoicing/items`, invoiceItemDTO);
}

export function getInvoiceItemDetails(invoiceId) {
  return axiosBoomInstance.get(`/api/${API_VERSION}/invoicing/items/${invoiceId}`);
}

export function deleteInvoiceItem(invoiceId) {
  return axiosBoomInstance.delete(`/api/${API_VERSION}/invoicing/items/${invoiceId}`);
}
