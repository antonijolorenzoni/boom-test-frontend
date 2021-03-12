//
// ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: A P I S   F O R   P H O T O G R A P H E R S   A N D   O R G A N I Z A T I O N S   B A L A N C E : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import { axiosBoomInstance } from './instances/boomInstance';
import { API_VERSION } from '../config/configurations';

export function fetchCompanyBalance(organizationId, companyId, params) {
  const paramsToSend = {
    params,
  };
  return axiosBoomInstance.get(`/api/${API_VERSION}/organizations/${organizationId}/companies/${companyId}/balance`, paramsToSend);
}

export function fetchPhotographerBalance(photographerId, params) {
  const paramsToSend = {
    params,
  };
  return axiosBoomInstance.get(`/api/${API_VERSION}/photographers/${photographerId}/balance`, paramsToSend);
}

export function fetchPhotographerPersonalBalance(params) {
  const paramsToSend = {
    params,
  };
  return axiosBoomInstance.get(`/api/${API_VERSION}/photographers/me/balance`, paramsToSend);
}

export function fetchPhotographerAccountingBalance(params) {
  const paramsToSend = {
    params,
  };
  return axiosBoomInstance.get(`/api/${API_VERSION}/photographers/me/accounting_balance`, paramsToSend);
}
