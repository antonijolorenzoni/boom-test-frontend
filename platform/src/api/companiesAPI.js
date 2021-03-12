//
// ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: A P I S   F O R   E V E R Y   P E R F O R M A B L E   A C T I O N   O N   A   C O M P A N Y   L I F E C Y C L E : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import { axiosBoomInstance } from './instances/boomInstance';
import { API_VERSION } from '../config/configurations';

/* COMPANY CRUD */
export function fetchOrganizationCompanies(organizationId, params) {
  const paramsToSend = {
    params,
  };
  return axiosBoomInstance.get(`/api/${API_VERSION}/organizations/${organizationId}/companies`, paramsToSend);
}

export function createOrganizationCompany(organizationId, companyDTO) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/companies`, companyDTO);
}

export function getOrganizationCompany(organizationId, companyId) {
  return axiosBoomInstance.get(`/api/${API_VERSION}/organizations/${organizationId}/companies/${companyId}`);
}

export function updateOrganizationCompany(organizationId, companyId, companyDTO) {
  return axiosBoomInstance.put(`/api/${API_VERSION}/organizations/${organizationId}/companies/${companyId}`, companyDTO);
}

export function deleteOrganizationCompany(organizationId, companyId) {
  return axiosBoomInstance.delete(`/api/${API_VERSION}/organizations/${organizationId}/companies/${companyId}`);
}

/* COMPANY DETAILS */
export function fetchCompanyDetails(organizationId, companyId) {
  return axiosBoomInstance.get(`/api/${API_VERSION}/organizations/${organizationId}/companies/${companyId}/details`);
}

export function createCompanyDetails(organizationId, companyId, companyDetailsDTO) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/companies/${companyId}/details`, companyDetailsDTO);
}

export function modifyCompanyDetails(organizationId, companyId, companyDetailsDTO) {
  return axiosBoomInstance.put(`/api/${API_VERSION}/organizations/${organizationId}/companies/${companyId}/details`, companyDetailsDTO);
}

/* COMPANY LOGO CRUD */
export function getOrganizationCompanyLogo(organizationId, companyId) {
  const config = {
    responseType: 'blob',
  };
  return axiosBoomInstance.get(`/api/${API_VERSION}/organizations/${organizationId}/companies/${companyId}/logo`, config);
}

export function createOrganizationCompanyLogo(organizationId, companyId, media) {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  const fileData = new FormData();
  fileData.append('logo', media);
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/companies/${companyId}/logo`, fileData, config);
}

export function deleteOrganizationCompanyLogo(organizationId, companyId) {
  return axiosBoomInstance.delete(`/api/${API_VERSION}/organizations/${organizationId}/companies/${companyId}/logo`);
}

export function fetchSubcompanies(organizationId, companyId, params) {
  return axiosBoomInstance.get(`/api/${API_VERSION}/organizations/${organizationId}/companies/${companyId}/subCompanies`, { params });
}

export function fetchCompanyPricingPackage(organizationId, companyId) {
  return axiosBoomInstance.get(`/api/${API_VERSION}/organizations/${organizationId}/companies/${companyId}/pricingPackages`);
}

export function fetchCompanyChecklist(organizationId, companyId) {
  return axiosBoomInstance.get(`/api/${API_VERSION}/organizations/${organizationId}/companies/${companyId}/checklist`);
}

export function fetchCompanyShootingChecklist(organizationId, companyId) {
  return axiosBoomInstance.get(`/api/${API_VERSION}/organizations/${organizationId}/checklists/companyChecklist/${companyId}`);
}

export function getCompanyPenaltiesConfig(organizationId, companyId) {
  return axiosBoomInstance.get(`/api/${API_VERSION}/organizations/${organizationId}/companies/${companyId}/penalties`);
}

export function updateCompanyPenaltiesConfig(organizationId, companyId, companyPenaltiesDTO) {
  return axiosBoomInstance.post(
    `/api/${API_VERSION}/organizations/${organizationId}/companies/${companyId}/penalties`,
    companyPenaltiesDTO
  );
}

export function deleteCompanyPenaltiesConfig(organizationId, companyId) {
  return axiosBoomInstance.delete(`/api/${API_VERSION}/organizations/${organizationId}/companies/${companyId}/penalties`);
}

export function getGoogleToken(organizationId, companyId) {
  return axiosBoomInstance.get(`/api/${API_VERSION}/organizations/${organizationId}/companies/${companyId}/google-token`);
}

export function getCompanies(params) {
  return axiosBoomInstance.get(`/api/${API_VERSION}/companies/`, { params });
}

export function getSubcompanies(companyId, params) {
  return axiosBoomInstance.get(`/api/${API_VERSION}/companies/${companyId}/subcompanies`, { params });
}
