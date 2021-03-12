//
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: A P I   C A L L   F O R   E V E R Y   A M A Z O N   S 3   A C T I O N : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import axios from 'axios';
import { axiosBoomInstance } from './instances/boomInstance';
import { API_VERSION } from '../config/configurations';

export const s3Instance = axios.create();

export function uploadMediaS3(s3URL, media, callback) {
  const config = {
    responseType: 'blob',
    onUploadProgress: (e) => callback(Math.round((e.loaded / e.total) * 100)),
  };
  return s3Instance.put(s3URL, media, config);
}

export function downloadMediaFromS3(s3URL, callback) {
  const config = {
    responseType: 'arraybuffer',
    onDownloadProgress: (e) => callback(Math.round((e.loaded / e.total) * 100)),
  };
  return s3Instance.get(s3URL, config);
}

export function getRAWMultipartUploadId(organizationId, shootingId, params) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/uploadRaw/start`, params);
}

export function getRAWMultipartUrl(organizationId, shootingId, params) {
  const paramsToSend = {
    params,
  };
  return axiosBoomInstance.get(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/uploadRaw/part`, paramsToSend);
}

export function completeRAWMultipartUpload(organizationId, shootingId, params) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/uploadRaw/complete`, params);
}

export function getPOSTMultipartUploadId(organizationId, shootingId, params) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/upload/start`, params);
}

export function getPOSTMultipartUrl(organizationId, shootingId, params) {
  const paramsToSend = {
    params,
  };
  return axiosBoomInstance.get(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/upload/part`, paramsToSend);
}

export function completePOSTMultipartUpload(organizationId, shootingId, params) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/upload/complete`, params);
}
