//
// ──────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: A P I   F O R   M A N A G E R   P L A T F O R M   U S E R S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import { axiosBoomInstance } from './instances/boomInstance';
import { API_VERSION } from '../config/configurations';

export function fetchOrganizationUsers(organizationId, params) {
  const paramsToSend = {
    params,
  };
  return axiosBoomInstance.get(`/api/${API_VERSION}/organizations/${organizationId}/users`, paramsToSend);
}

export function createOrganizationUser(organizationId, userDTO) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/users`, userDTO);
}

export function getPersonalUserDetail(organizationID) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationID}/users/me`);
}

export function updateOrganizationUser(organizationId, userId, userDTO) {
  return axiosBoomInstance.put(`/api/${API_VERSION}/organizations/${organizationId}/users/${userId}`, userDTO);
}

export function deleteOrganizationUser(organizationId, userId) {
  return axiosBoomInstance.delete(`/api/${API_VERSION}/organizations/${organizationId}/users/${userId}`);
}

export function createOrganizationUserAccessRule(organizationId, userId, accessRuleDTO) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/users/${userId}/accessRules`, [accessRuleDTO]);
}

export function getUserAccessRule(organizationId, userId, params) {
  const paramsToSend = {
    params,
  };
  return axiosBoomInstance.get(`/api/${API_VERSION}/organizations/${organizationId}/users/${userId}/accessRules`, paramsToSend);
}

export function deleteUserAccessRule(organizationId, userId, params) {
  const paramsToSend = {
    params,
  };
  return axiosBoomInstance.delete(`/api/${API_VERSION}/organizations/${organizationId}/users/${userId}/accessRules`, paramsToSend);
}

export function resendUserRegistrationEmail(organizationId, userId) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/users/${userId}/resendEmail`);
}

export function getUserPersonalAccessRule(organizationId, userId, params) {
  const paramsToSend = {
    params,
  };
  return axiosBoomInstance.get(`/api/${API_VERSION}/organizations/${organizationId}/users/${userId}/accessRules/mine`, paramsToSend);
}
