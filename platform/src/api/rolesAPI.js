//
// ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: A P I   F O R   G E T T I N G   U S E R   R O L E S   A N D   P E R M I S S I O N S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import { axiosBoomInstance } from './instances/boomInstance';
import { API_VERSION } from '../config/configurations';

export function fetchRoles(params) {
  return axiosBoomInstance.get(`/api/${API_VERSION}/roles`);
}

export function fetchRoleDetails(roleId) {
  return axiosBoomInstance.get(`/api/${API_VERSION}/roles/${roleId}`);
}

export function fetchRolePermissions(roleId) {
  return axiosBoomInstance.get(`/api/${API_VERSION}/roles/${roleId}/permissions`);
}
