//
// ──────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: O R G A N I Z A T I O N   A C T I O N S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────
//

import _ from 'lodash';
import OrganizationService from '../../service/OrganizationService';
import {
  SAVE_ORGANIZATIONS,
  DELETE_ORGANIZATION,
  APPEND_ORGANIZATIONS,
  SAVE_ORGANIZATIONS_PAGINATION,
  SET_ORGANIZATIONS_FILTER,
  RESET_ORGANIZATIONS_FILTERS,
  SET_SELECTED_ORGANIZATION,
  SAVE_PRICING_PACKAGES,
  APPEND_PRICING_PACKAGES,
  SAVE_PRICING_PACKAGES_PAGINATION,
  SET_SELECTED_PRICING_PACKAGE,
  RESET_PRICING_PACKAGES_DATA,
  SET_PRICING_PACKAGES_FILTER,
  RESET_PRICING_PACKAGES_FILTERS,
  SAVE_ORGANIZATION_AUTH_SERVICE,
  RESET_ORGANIZATION_AUTH_SERVICE,
  UPDATE_SELECTED_ORGANIZATION,
} from './actionTypes/organization';
import * as OrganizationAPI from '../../api/organizationsAPI';
import * as CompaniesActions from './companies.actions';

export function saveOrganizations(organizations) {
  return {
    type: SAVE_ORGANIZATIONS,
    organizations,
  };
}

export function setSelectedOrganization(organization) {
  return {
    type: SET_SELECTED_ORGANIZATION,
    organization,
  };
}

export function deleteOrganizationInState(organizationID) {
  return {
    type: DELETE_ORGANIZATION,
    organizationID,
  };
}

export function appendOrganizations(organizations) {
  return {
    type: APPEND_ORGANIZATIONS,
    organizations,
  };
}

export function saveOrganizationsPagination(pagination) {
  return {
    type: SAVE_ORGANIZATIONS_PAGINATION,
    pagination,
  };
}

export function setOrganizationFilter(field, value) {
  return {
    type: SET_ORGANIZATIONS_FILTER,
    field,
    value,
  };
}

export function resetOrganizationFilters() {
  return {
    type: RESET_ORGANIZATIONS_FILTERS,
  };
}

export function savePricingPackages(pricingPackages) {
  return {
    type: SAVE_PRICING_PACKAGES,
    pricingPackages,
  };
}

export function appendPricingPackages(pricingPackages) {
  return {
    type: APPEND_PRICING_PACKAGES,
    pricingPackages,
  };
}

export function savePricingPackagesPagination(pagination) {
  return {
    type: SAVE_PRICING_PACKAGES_PAGINATION,
    pagination,
  };
}

export function setSelectePricingPackage(pricingPackage) {
  return {
    type: SET_SELECTED_PRICING_PACKAGE,
    pricingPackage,
  };
}

export function resetPricingPackagesData() {
  return {
    type: RESET_PRICING_PACKAGES_DATA,
  };
}

export function setPricingPackagesFilter(field, value) {
  return {
    type: SET_PRICING_PACKAGES_FILTER,
    field,
    value,
  };
}

export function resetPricingPackagesFilters() {
  return {
    type: RESET_PRICING_PACKAGES_FILTERS,
  };
}

export function saveOrganizationAuthorizedService(authorizedService) {
  return {
    type: SAVE_ORGANIZATION_AUTH_SERVICE,
    authorizedService,
  };
}

export function resetOrganizationAuthService() {
  return { type: RESET_ORGANIZATION_AUTH_SERVICE };
}

export function updateSelectedOrganization(fields) {
  return { type: UPDATE_SELECTED_ORGANIZATION, fields };
}

export function fetchOrganizations(page = 0, pageSize = 10) {
  return async (dispatch, getState) => {
    try {
      const { filters } = getState().organizations.data;
      const params = {
        ...filters,
        page,
        pageSize,
      };
      const response = await OrganizationService.fetchOrganizations(params);
      if (response && response.data && response.data.content) {
        dispatch(saveOrganizations(response.data.content));
        dispatch(saveOrganizationsPagination(_.omit(response.data, 'content')));
        return response.data.content;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function fetchPricingPackages(page = 0, pageSize = 10) {
  return async (dispatch, getState) => {
    try {
      const { filters } = getState().organizations.pricingPackages;
      const params = {
        ...filters,
        page,
        pageSize,
      };
      const {
        organizations: { selectedOrganization: organization },
      } = getState();
      const response = await OrganizationAPI.fetchPricingPackage(organization.id, params);
      if (response && response.data && response.data.content) {
        dispatch(savePricingPackages(response.data.content));
        dispatch(savePricingPackagesPagination(_.omit(response.data, 'content')));
        return response.data.content;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function fetchAndAppendPricingPackages(page = 0, pageSize = 10) {
  return async (dispatch, getState) => {
    try {
      const { filters } = getState().organizations.pricingPackages;
      const params = {
        ...filters,
        page,
        pageSize,
      };
      const {
        organizations: { selectedOrganization: organization },
      } = getState();
      const response = await OrganizationAPI.fetchPricingPackage(organization.id, params);
      if (response && response.data && response.data.content) {
        dispatch(appendPricingPackages(response.data.content));
        dispatch(savePricingPackagesPagination(_.omit(response.data, 'content')));
        return response.data.content;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function createPricingPackage(pricingPackageDTO) {
  return async (dispatch, getState) => {
    try {
      const {
        organizations: { selectedOrganization: organization },
        companies: { selectedRootCompany },
      } = getState();
      const packageToSave = {
        ...pricingPackageDTO,
        authorizedCompanies: [
          selectedRootCompany.id, // Always include the selected company to the list
          ..._.map(pricingPackageDTO.compainesSelected, (company) => parseInt(company.value, 10)),
        ],
      };
      const response = await OrganizationAPI.createPricingPackage(organization.id, packageToSave);
      dispatch(fetchPricingPackages());
      return response;
    } catch (error) {
      throw error;
    }
  };
}

export function editPricingPackage(pricingPackageDTO) {
  return async (dispatch, getState) => {
    try {
      const {
        organizations: { selectedOrganization: organization },
      } = getState();
      const response = await OrganizationAPI.modifyPricingPackage(organization.id, pricingPackageDTO);
      dispatch(fetchPricingPackages());
      return response.data;
    } catch (error) {
      throw error;
    }
  };
}

export function deletePricingPackage(pricingPackageId) {
  return async (dispatch, getState) => {
    try {
      const {
        organizations: { selectedOrganization: organization },
      } = getState();
      const response = await OrganizationAPI.deletePricingPackage(organization.id, pricingPackageId);
      dispatch(fetchPricingPackages());
      return response;
    } catch (error) {
      throw error;
    }
  };
}

export function fetchPricingPackageDetails(pricingPackageId) {
  return async (dispatch, getState) => {
    try {
      const {
        organizations: { selectedOrganization: organization },
      } = getState();
      const response = await OrganizationAPI.fetchPricingPackageDetails(organization.id, pricingPackageId);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
}

export function fetchAppendOrganizations(page = 0, pageSize = 10) {
  return async (dispatch, getState) => {
    try {
      const { filters } = getState().organizations.data;
      const params = {
        ...filters,
        page,
        pageSize,
      };
      const response = await OrganizationService.fetchOrganizations(params);
      if (response && response.data && response.data.content) {
        dispatch(appendOrganizations(response.data.content));
        dispatch(saveOrganizationsPagination(_.omit(response.data, 'content')));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function updateOrganization(organizationDTO) {
  return async (dispatch, getState) => {
    try {
      const response = await OrganizationService.updateOrganization(organizationDTO.id, organizationDTO);
      if (response.data) {
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function deleteOrganization(organizationDTO) {
  return async (dispatch, getState) => {
    try {
      const response = await OrganizationService.deleteOrganization(organizationDTO.id);
      if (response.data) {
        dispatch(deleteOrganizationInState(organizationDTO.id));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function fetchRootCompany(organizationId) {
  return async (dispatch, getState) => {
    try {
      const response = await OrganizationService.fetchOrganizationRootCompany(organizationId);
      if (response.data) {
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function fetchOrganizationDetails(organizationId) {
  return async (dispatch, getState) => {
    try {
      const response = await OrganizationService.fetchOrganizationDetails(organizationId);
      if (response.data) {
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function createOrganizationChecklist(checklistDTO) {
  return async (dispatch, getState) => {
    try {
      const {
        organizations: { selectedOrganization: organization },
      } = getState();
      const response = await OrganizationAPI.createOrganizationChecklist(organization.id, checklistDTO);
      if (response.data) {
        dispatch(CompaniesActions.resetCompanyChecklist());
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function fetchOrganizationChecklist(organizationId) {
  return async (dispatch, getState) => {
    try {
      const response = await OrganizationAPI.fetchOrganizationChecklist(organizationId);
      if (response.data) {
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function createChecklistAuthorizedCompanies(checklistId, compainesSelected) {
  return async (dispatch, getState) => {
    try {
      const {
        organizations: { selectedOrganization: organization },
        companies: { selectedRootCompany },
      } = getState();
      const authorizedCompaniesDTO = [
        selectedRootCompany.id, // Always include the selected company to the list
        ..._.map(compainesSelected, (company) => parseInt(company.value, 10)),
      ];
      const response = await OrganizationAPI.createChecklistAuthorizedCompanies(organization.id, checklistId, authorizedCompaniesDTO);
      if (response && response.data) {
        dispatch(CompaniesActions.resetCompanyChecklist());
        return response;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function deleteOrganizationChecklist(checklistId) {
  return async (dispatch, getState) => {
    try {
      const {
        organizations: { selectedOrganization: organization },
      } = getState();
      const response = await OrganizationAPI.deleteOrganizationChecklist(organization.id, checklistId);
      if (response && response.data) {
        dispatch(CompaniesActions.resetCompanyChecklist());
        return response;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function deleteChecklistAuthorizedCompanies(checklistId, companiesIds) {
  return async (dispatch, getState) => {
    try {
      const {
        organizations: { selectedOrganization: organization },
      } = getState();
      const response = await OrganizationAPI.deleteChecklistAuthorizedCompanies(organization.id, checklistId, companiesIds);
      if (response && response.data) {
        dispatch(CompaniesActions.resetCompanyChecklist());
        return response;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function fetchOrganizationAuthorizedService() {
  return async (dispatch, getState) => {
    try {
      const {
        organizations: { selectedOrganization: organization },
      } = getState();
      const response = await OrganizationAPI.getOrganizationAuthorizedService(organization.id);
      if (response && response.data && response.data.content) {
        // TODO: Save auth service pagination!!
        dispatch(saveOrganizationAuthorizedService(_.first(response.data.content)));
        return response;
      }
    } catch (error) {
      throw error;
    }
  };
}

export function createAuthorizedService(serviceDTO) {
  return async (dispatch, getState) => {
    try {
      const {
        organizations: { selectedOrganization: organization },
      } = getState();
      const response = await OrganizationAPI.createOrganizationAuthorizedService(organization.id, serviceDTO);
      if (response && response.data) {
        dispatch(saveOrganizationAuthorizedService(response.data));
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  };
}

export function deleteOrganizationAuthorizedService(serviceId) {
  return async (dispatch, getState) => {
    try {
      const {
        organizations: { selectedOrganization: organization },
      } = getState();
      const response = await OrganizationAPI.deleteOrganizationAuthorizedService(organization.id, serviceId);
      if (response && response.data) {
        dispatch(resetOrganizationAuthService());
        return response;
      }
    } catch (error) {
      throw error;
    }
  };
}
