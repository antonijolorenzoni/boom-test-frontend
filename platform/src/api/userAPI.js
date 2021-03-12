//
// ──────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: A P I   F O R   U S E R   A C T I O N S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────
//

import { axiosBoomInstance } from './instances/boomInstance';
import { API_VERSION } from '../config/configurations';

export function fetchUser() {
  return axiosBoomInstance.get(`/api/${API_VERSION}/user/me`);
}

export function updateUser(userDTO) {
  return axiosBoomInstance.put(`/api/${API_VERSION}/user/me`, userDTO);
}

export function createUser(organizationId, userDTO) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/user`, userDTO);
}

export function recoverUserPassword(params) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/user/resetPassword`, params);
}

export function confirmPassword(params) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/user/savePassword`, params);
}

export function confirmUserRegistration(params) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/user/confirm`, params);
}

export function fetchPhotoTypes() {
  return axiosBoomInstance.get(`/api/${API_VERSION}/photoTypes`);
}

export function fetchCurrencies(params) {
  const paramsToSend = {
    params,
  };
  return axiosBoomInstance.get(`/api/${API_VERSION}/currencies`, paramsToSend);
}

export const fetchUsers = (params) => {
  const paramsToSend = {
    params,
  };
  return axiosBoomInstance.get(`/api/${API_VERSION}/user`, paramsToSend);
};

export const verifyChangeEmail = (params) => {
  return axiosBoomInstance.post(`/api/${API_VERSION}/user/verify-change-mail`, params);
};
