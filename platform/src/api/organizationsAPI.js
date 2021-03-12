//
// ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: A P I S   F O R   E V E R Y   P E R F O R M A B L E   A C T I O N   O N   O R G A N I Z A T I O N S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import qs from 'query-string';
import { axiosBoomInstance } from './instances/boomInstance';
import { API_VERSION } from '../config/configurations';

export function fetchOrganizations(params) {
  const paramsToSend = {
    params,
  };
  return axiosBoomInstance.get(`/api/${API_VERSION}/organizations`, paramsToSend);
}

export function createOrganization(organizationDTO) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations`, organizationDTO);
}

export function fetchOrganizationDetails(organizationID) {
  return axiosBoomInstance.get(`/api/${API_VERSION}/organizations/${organizationID}`);
}

export function updateOrganization(organizationId, organizationDTO) {
  return axiosBoomInstance.put(`/api/${API_VERSION}/organizations/${organizationId}`, organizationDTO);
}

export function deleteOrganization(organizationID) {
  return axiosBoomInstance.delete(`/api/${API_VERSION}/organizations/${organizationID}`);
}

export function fetchOrganizationRootCompany(organizationID) {
  return axiosBoomInstance.get(`/api/${API_VERSION}/organizations/${organizationID}/rootCompany`);
}

export function getOrganization(organizationID) {
  return axiosBoomInstance.get(`/api/v1/organizations/${organizationID}`);
}

export function getOrganizations(params) {
  return axiosBoomInstance.get(`/api/${API_VERSION}/organizations`, { params });
}

//
// ─── PRICING PACKAGES ───────────────────────────────────────────────────────────
//
export function fetchPricingPackage(organizationId, params) {
  const paramsToSend = {
    params,
  };
  return axiosBoomInstance.get(`/api/${API_VERSION}/organizations/${organizationId}/pricingPackages`, paramsToSend);
}

export function createPricingPackage(organizationId, packageDTO) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/pricingPackages`, packageDTO);
}

export function deletePricingPackage(organizationId, packageId) {
  return axiosBoomInstance.delete(`/api/${API_VERSION}/organizations/${organizationId}/pricingPackages/${packageId}`);
}

export function fetchPricingPackageDetails(organizationId, packageId) {
  return axiosBoomInstance.get(`/api/${API_VERSION}/organizations/${organizationId}/pricingPackages/${packageId}`);
}

export function modifyPricingPackage(organizationId, packageDTO) {
  return axiosBoomInstance.put(`/api/${API_VERSION}/organizations/${organizationId}/pricingPackages/${packageDTO.id}`, packageDTO);
}

//
// ─── CHECKLISTS ─────────────────────────────────────────────────────────────────
//

export function createOrganizationChecklist(organizationId, checklistDTO) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/checklists`, checklistDTO);
}

export function fetchOrganizationChecklist(organizationId, checklistId) {
  return axiosBoomInstance.get(`/api/${API_VERSION}/organizations/${organizationId}/checklists/${checklistId}`);
}

export function createChecklistAuthorizedCompanies(organizationId, checklistId, companyIds) {
  return axiosBoomInstance.post(
    `/api/${API_VERSION}/organizations/${organizationId}/checklists/${checklistId}/authorizedCompanies`,
    companyIds
  );
}

export function deleteChecklistAuthorizedCompanies(organizationId, checklistId, companyIds) {
  const paramsToSend = {
    companyIds,
    paramsSerializer: (par) => qs.stringify(par, { indices: false, encode: false }),
  };
  return axiosBoomInstance.delete(
    `/api/${API_VERSION}/organizations/${organizationId}/checklists/${checklistId}/authorizedCompanies/${companyIds}`,
    paramsToSend
  );
}

export function deleteOrganizationChecklist(organizationId, checklistId) {
  return axiosBoomInstance.delete(`/api/${API_VERSION}/organizations/${organizationId}/checklists/${checklistId}`);
}

export function getOrganizationAuthorizedService(organizationId) {
  return axiosBoomInstance.get(`/api/${API_VERSION}/organizations/${organizationId}/authorizedServices`);
}

export function createOrganizationAuthorizedService(organizationId, serviceDTO) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/authorizedServices`, serviceDTO);
}

export function deleteOrganizationAuthorizedService(organizationId, serviceId) {
  return axiosBoomInstance.delete(`/api/${API_VERSION}/organizations/${organizationId}/authorizedServices/${serviceId}`);
}
