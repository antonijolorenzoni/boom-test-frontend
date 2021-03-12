//
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: A P I S   F O R   C R U D   O N   P H O R O G R A P H E R S   E N T I T I E S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import { API_VERSION } from '../config/configurations';
import { axiosBoomInstance } from './instances/boomInstance';

export function fetchPhotographers(params) {
  const paramsToSend = {
    params,
  };
  return axiosBoomInstance.get(`/api/${API_VERSION}/photographers`, paramsToSend);
}

export function createPhotographer(userDTO) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/photographers`, userDTO);
}

export function getPhotographerDetail(userId) {
  return axiosBoomInstance.get(`/api/${API_VERSION}/photographers/${userId}`);
}

export function updatePhotographer(userId, userDTO) {
  return axiosBoomInstance.put(`/api/${API_VERSION}/photographers/${userId}`, userDTO);
}

export function deletePhotographer(userId) {
  return axiosBoomInstance.delete(`/api/${API_VERSION}/photographers/${userId}`);
}

export function fetchMePhotographer() {
  return axiosBoomInstance.get(`/api/${API_VERSION}/photographers/me`);
}

export function updateMePhotographer(userDTO) {
  return axiosBoomInstance.put(`/api/${API_VERSION}/photographers/me`, userDTO);
}

export function fetchShootingInfo(shootingId) {
  return axiosBoomInstance.get(`/api/${API_VERSION}/photographers/me/shootings/${shootingId}`);
}

export function updateCameras(camerasDTO) {
  return axiosBoomInstance.put(`/api/${API_VERSION}/photographers/me/cameras`, camerasDTO);
}

export function updateLenses(lensesDTO) {
  return axiosBoomInstance.put(`/api/${API_VERSION}/photographers/me/lenses`, lensesDTO);
}

export function deleteCamera(cameraId) {
  return axiosBoomInstance.delete(`/api/${API_VERSION}/photographers/me/cameras/${cameraId}`);
}

export function deleteLens(lenseId) {
  return axiosBoomInstance.delete(`/api/${API_VERSION}/photographers/me/lenses/${lenseId}`);
}

export function resendPhotographerRegistrationEmail(userId) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/photographers/${userId}/resendEmail`);
}

export function deletePhotographerProfilePicture() {
  return axiosBoomInstance.delete(`/api/${API_VERSION}/photographers/me/profilePicture`);
}

export function fetchPhotographerProfilePicture() {
  const config = {
    responseType: 'blob',
  };
  return axiosBoomInstance.get(`/api/${API_VERSION}/photographers/me/profilePicture`, config);
}

export function createPhotographerProfilePicture(media) {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  const fileData = new FormData();
  fileData.append('profilePicture', media);
  return axiosBoomInstance.post(`/api/${API_VERSION}/photographers/me/profilePicture`, fileData, config);
}

export function getPhotographerUnavailabilities(params) {
  const paramsToSend = {
    params,
  };
  return axiosBoomInstance.get(`/api/${API_VERSION}/photographers/me/unavailabilities`, paramsToSend);
}

export function setPhotographerUnavailabilities(userDTO) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/photographers/me/unavailabilities`, userDTO);
}

export function deletePhotographerUnavailabilities(unavailabilityId) {
  return axiosBoomInstance.delete(`/api/${API_VERSION}/photographers/me/unavailabilities/${unavailabilityId}`);
}

export function modifyUserUnavailability(userDTO, unavailabilityId) {
  return axiosBoomInstance.put(`/api/${API_VERSION}/photographers/me/unavailabilities/${unavailabilityId}`, userDTO);
}

export function fetchPhotographerPicture(photographerId) {
  const config = {
    responseType: 'blob',
  };
  return axiosBoomInstance.get(`/api/${API_VERSION}/photographers/${photographerId}/profilePicture`, config);
}
