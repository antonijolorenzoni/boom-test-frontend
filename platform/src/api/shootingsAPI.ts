//
// ────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: A P I   F O R   S H O O T I N G S   A C T I O N S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────
//

import qs from 'query-string';
import { axiosBoomInstance } from './instances/boomInstance';
import { API_VERSION } from '../config/configurations';
import { ShootingRawUploadRequest } from 'types/shootings/ShootingRawUploadRequest';

export function fetchShootings(organizationId: any, params: any) {
  const paramsToSend = {
    params,
    paramsSerializer: (par: any) => qs.stringify(par, { indices: false, encode: false } as any),
  };
  return axiosBoomInstance.get(`/api/${API_VERSION}/organizations/${organizationId}/shootings`, paramsToSend);
}

export function fetchOrders(params: any) {
  const paramsToSend = {
    params,
  };
  return axiosBoomInstance.get(`/api/${API_VERSION}/orders`, paramsToSend);
}

export function createShooting(organizationId: any, shootingDTO: any) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/shootings`, shootingDTO);
}

export function fetchShootingDetails(organizationId: any, shootingId: any) {
  return axiosBoomInstance.get(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}`);
}

export function fetchShootingCompanyPenalties(organizationId: any, shootingId: any) {
  return axiosBoomInstance.get(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/company_penalties`);
}

export function fetchShootingPhotographerRefunds(organizationId: any, shootingId: any) {
  return axiosBoomInstance.get(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/photographer_refund`);
}

//
// ─── SHOOTING ACTIONS ───────────────────────────────────────────────────────────
//

export function updateShooting(organizationId: any, shootingId: any, shootingDTO: any) {
  return axiosBoomInstance.put(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}`, shootingDTO);
}

export const scheduleShooting = (organizationId: any, shootingId: any, shootingDTO: any) =>
  axiosBoomInstance.put(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/schedule`, shootingDTO);

export function acceptShooting(organizationId: any, shootingId: any) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/accept`);
}

export function acceptShootingPhotos(organizationId: any, shootingId: any) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/acceptPhotos`);
}

export function sendShootingReminder(organizationId: any, shootingId: any) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/remindInvite`);
}

export function archiveShooting(organizationId: any, shootingId: any) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/archive`);
}

export function cancelShooting(organizationId: any, shootingId: any) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/cancel`);
}

export function assignShootingPhotographer(organizationId: any, shootingId: any, photographerId: any, manualAssignPhotographerDTO: any) {
  return axiosBoomInstance.post(
    `/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/manualAssign/${photographerId}`,
    manualAssignPhotographerDTO
  );
}

export function unassignShootingPhotographer(organizationId: any, shootingId: any) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/unassign`);
}

export function refuseShooting(organizationId: any, shootingId: any) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/refuse`);
}

export function refuseShootingPhotos(organizationId: any, shootingId: any, isToReshoot: any, shootingRefuseInDTO: any) {
  return axiosBoomInstance.post(
    `/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/refusePhotos?reshoot=${isToReshoot}`,
    shootingRefuseInDTO
  );
}

//
// ─── FILES LIFECYCLE ────────────────────────────────────────────────────────────
//

export function uploadShootingPhotosRequest(organizationId: any, shootingId: any) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/uploadRaw`);
}

export const confirmShootingPhotosUpload = (organizationId: any, shootingId: any, payload: ShootingRawUploadRequest) =>
  axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/uploadRaw/confirm`, payload);

export function createRAWPartFailedLog(organizationId: any, shootingId: any, payload: any) {
  return axiosBoomInstance.post(
    `/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/uploadRaw/partFailed`,
    payload
  );
}

export function uploadPostProductionPhotosRequest(organizationId: any, shootingId: any) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/upload`);
}

export function confirmShootingPostProducionPhotosUpload(organizationId: any, shootingId: any) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/upload/confirm`);
}

export function createPOSTPartFailedLog(organizationId: any, shootingId: any, payload: any) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/upload/partFailed`, payload);
}

export function fetchShootingPhotosRequest(organizationId: any, shootingId: any) {
  return axiosBoomInstance.get(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/download`);
}

export function fetchShootingPhotosRawRequest(organizationId: any, shootingId: any, callback: any) {
  return axiosBoomInstance.get(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/downloadRaw`);
}

export function confirmShootingPhotosDownload(organizationId: any, shootingId: any) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/download/confirm`);
}

export function rescheduleShooting(organizationId: any, shootingId: any, shootingRescheduleInDTO: any) {
  return axiosBoomInstance.put(
    `/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/reschedule`,
    shootingRescheduleInDTO
  );
}

export function fetchShootingUploadNotes(organizationId: any, shootingId: any) {
  return axiosBoomInstance.get(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/details/uploadNotes`);
}

export function createShootingUploadNotes(organizationId: any, shootingId: any, uploadNotes: any) {
  return axiosBoomInstance.post(
    `/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/details/uploadNotes`,
    uploadNotes
  );
}

//
// ─── SCORES ─────────────────────────────────────────────────────────────────────
//

export function fetchShootingScores(organizationId: any, shootingId: any, params: any) {
  return axiosBoomInstance.get(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/scores`);
}

export function createCompanyShootingScore(organizationId: any, shootingId: any, scoreDTO: any) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/scores`, scoreDTO);
}

export function deleteCompanyShootingScore(organizationId: any, shootingId: any) {
  return axiosBoomInstance.delete(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/scores`);
}

export function updateShootingScore(organizationId: any, shootingId: any, scoreId: any, scoreDTO: any) {
  return axiosBoomInstance.put(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/scores/${scoreId}`, scoreDTO);
}

export function createCompanyShootingScoreBOOM(organizationId: any, shootingId: any, shootingScoreBOOMInDTO: any) {
  return axiosBoomInstance.post(
    `/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/scores/BOOM`,
    shootingScoreBOOMInDTO
  );
}

export function deleteShooting(organizationId: any, shootingId: any, invoiceItems: any) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/delete`, invoiceItems);
}

export function createShootingRefund(organizationId: any, shootingId: any, refundDTO: any) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/refund`, refundDTO);
}

export function fetchShootingEvents(shootingId: any, params: any) {
  const paramsToSend = {
    params,
  };
  return axiosBoomInstance.get(`/api/${API_VERSION}/events/shootings/${shootingId}`, paramsToSend);
}

// Auto assignment

export function fetchShootingMatchedPhotographers(organizationId: any, shootingId: any) {
  return axiosBoomInstance.get(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/auto_assignment/matched`);
}

export function fetchAutoAssignmentPhotographers(organizationId: any, shootingId: any) {
  return axiosBoomInstance.get(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/auto_assignment`);
}

export function createAutoAssignment(organizationId: any, shootingId: any, sendInvitesDTO: any) {
  return axiosBoomInstance.post(
    `/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/auto_assignment`,
    sendInvitesDTO
  );
}

export function pauseAutoAssignment(organizationId: any, shootingId: any) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/auto_assignment/pause`);
}

export function restartAutoAssignment(organizationId: any, shootingId: any) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/auto_assignment/start`);
}

export function stopAutoAssignment(organizationId: any, shootingId: any) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/auto_assignment/stop`);
}

export function bulkInsertShootings(shootings: any) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/bulk/shootings`, shootings);
}

// multi-delivery

export function resendDeliveries(organizationId: any, shootingId: any) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/deliveries/re-send`);
}
