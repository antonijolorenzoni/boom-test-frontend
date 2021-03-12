//
// ────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: A X I O S   I N S T A N C E   F O R   B O O M   A P I : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import _ from 'lodash';
import axios from 'axios';
import qs from 'query-string';

// authenticated axios instance

export const axiosBoomInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  paramsSerializer: (par) => qs.stringify(par, { indices: false, encode: false }),
});

export function getRequestInterceptors() {
  return axiosBoomInstance.interceptors.request ? axiosBoomInstance.interceptors.request.handlers : [];
}

export function interceptorEjectRequest() {
  _.each(_.keys(axiosBoomInstance.interceptors.request.handlers), (key) => {
    axiosBoomInstance.interceptors.request.eject(key);
  });
}

export function setRequestInterceptor(accessToken) {
  return axiosBoomInstance.interceptors.request.use((config) => {
    config['headers']['authorization'] = `Bearer ${accessToken}`;
    return config;
  });
}

export const replayRequest = (params) => {
  axios(params.initialRequest)
    .then((response) => {
      params.resolve(response);
    })
    .catch((reason) => {
      params.reject(reason);
    });
};

export function setBaseUrl(baseURL) {
  axiosBoomInstance.defaults.baseURL = baseURL;
}

export function getBaseUrl() {
  return axiosBoomInstance.defaults.baseURL;
}

// smb axios instance

export const axiosBoomSmbInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  paramsSerializer: (par) => qs.stringify(par, { indices: false, encode: false }),
});

axiosBoomSmbInstance.interceptors.request.use((config) => {
  const smbToken = localStorage.getItem('smb-code');
  config.headers['smb-code'] = smbToken;

  return config;
});

// public axios instance

export const axiosBoomPublicInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  paramsSerializer: (par) => qs.stringify(par, { indices: false, encode: false }),
});
