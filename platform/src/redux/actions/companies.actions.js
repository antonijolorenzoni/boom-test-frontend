//
// ────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: C O M P A N I E S   A C T I O N S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────
//

import { initialize } from 'redux-form';
import _ from 'lodash';
import {
  SAVE_ROOT_COMPANIES,
  SAVE_ROOT_COMPANIES_PAGINATION,
  APPEND_ROOT_COMPANIES,
  RESET_ROOT_COMPANIES,
  SAVE_COMPANIES,
  APPEND_COMPANIES,
  DELETE_COMPANY,
  SAVE_COMPANIES_PAGINATION,
  SET_COMPANIES_FILTER,
  RESET_COMPANIES_FILTERS,
  SET_SELECTED_COMPANY,
  UPDATE_COMPANY,
  RESET_COMPANIES_DATA,
  ADD_NEW_NAVIGATION_LEVEL,
  ADD_NEW_NAVIGATION_LEVELS,
  JUMP_NAVIGATION_LEVEL,
  SET_SELECTED_ROOT_COMPANY,
  UPDATE_SELECTED_ROOT_COMPANY,
  SAVE_SUB_COMPANIES,
  SAVE_SUB_COMPANIES_PAGINATION,
  APPEND_SUB_COMPANIES,
  RESET_SUB_COMPANIES,
  UPDATE_SUB_COMPANY,
  SET_SUB_COMPANY_FILTER,
  RESET_SUB_COMPANIES_FILTER,
  SET_ROOT_COMPANIES_FILTER,
  RESET_ROOT_COMPANIES_FILTERS,
  SAVE_COMPANY_PRICING_PACKAGES,
  RESET_COMPANY_PRICING_PACKAGES,
  REPLACE_NAVIGATION_LEVEL,
  SAVE_COMPANY_CHECKLIST,
  RESET_COMPANY_CHECKLIST,
} from './actionTypes/companies';
import * as CompaniesAPI from '../../api/companiesAPI';
import * as OrganizationsAPI from '../../api/organizationsAPI';

export function saveCompanies(companies) {
  return {
    type: SAVE_COMPANIES,
    companies,
  };
}

export function appendCompanies(companies) {
  return {
    type: APPEND_COMPANIES,
    companies,
  };
}

export function updateCompanyInState(company) {
  return {
    type: UPDATE_COMPANY,
    company,
  };
}

export function saveCompaniesPagination(pagination) {
  return {
    type: SAVE_COMPANIES_PAGINATION,
    pagination,
  };
}

export function setCompaniesFilter(field, value) {
  return {
    type: SET_COMPANIES_FILTER,
    field,
    value,
  };
}

export function saveCompanyPricingPackages(pricingPackages) {
  return {
    type: SAVE_COMPANY_PRICING_PACKAGES,
    pricingPackages,
  };
}

export function resetCompanyPricingPackages() {
  return { type: RESET_COMPANY_PRICING_PACKAGES };
}

export function saveCompanyChecklist(checklist) {
  return {
    type: SAVE_COMPANY_CHECKLIST,
    checklist,
  };
}

export function resetCompanyChecklist() {
  return { type: RESET_COMPANY_CHECKLIST };
}

export function resetCompaniesFilters() {
  return {
    type: RESET_COMPANIES_FILTERS,
  };
}

export function setRootCompaniesFilter(field, value) {
  return {
    type: SET_ROOT_COMPANIES_FILTER,
    field,
    value,
  };
}

export function resetRootCompaniesFilters() {
  return {
    type: RESET_ROOT_COMPANIES_FILTERS,
  };
}

export function setSubCompaniesFilter(field, value) {
  return {
    type: SET_SUB_COMPANY_FILTER,
    field,
    value,
  };
}

export function resetSubCompaniesFilters() {
  return {
    type: RESET_SUB_COMPANIES_FILTER,
  };
}

export function deleteCompanyInState(companyID) {
  return {
    type: DELETE_COMPANY,
    companyID,
  };
}

export function resetCompaniesData() {
  return {
    type: RESET_COMPANIES_DATA,
  };
}

export function setSelectedCompany(company) {
  return {
    type: SET_SELECTED_COMPANY,
    company,
  };
}

export function setSelectedRootCompany(company) {
  return {
    type: SET_SELECTED_ROOT_COMPANY,
    company,
  };
}

export function updateSelectedRootCompany(companyFields) {
  return {
    type: UPDATE_SELECTED_ROOT_COMPANY,
    companyFields,
  };
}

export function addNewNavigationLevel(level) {
  return {
    type: ADD_NEW_NAVIGATION_LEVEL,
    level,
  };
}

export function addNewNavigationLevels(levels) {
  return {
    type: ADD_NEW_NAVIGATION_LEVELS,
    levels,
  };
}

export function replaceNavigationLevel(level) {
  return {
    type: REPLACE_NAVIGATION_LEVEL,
    level,
  };
}

export function jumpToNewNavigationLevel(index) {
  return {
    type: JUMP_NAVIGATION_LEVEL,
    index,
  };
}

export function saveRootCompanies(companies) {
  return {
    type: SAVE_ROOT_COMPANIES,
    companies,
  };
}

export function appendRootCompanies(companies) {
  return {
    type: APPEND_ROOT_COMPANIES,
    companies,
  };
}

export function resetRootCompanies() {
  return { type: RESET_ROOT_COMPANIES };
}

export function saveRootCompaniesPagination(pagination) {
  return {
    type: SAVE_ROOT_COMPANIES_PAGINATION,
    pagination,
  };
}

export function saveSubCompanies(companies) {
  return {
    type: SAVE_SUB_COMPANIES,
    companies,
  };
}

export function appendSubCompanies(companies) {
  return {
    type: APPEND_SUB_COMPANIES,
    companies,
  };
}

export function updateSubCompanyInState(company) {
  return {
    type: UPDATE_SUB_COMPANY,
    company,
  };
}

export function resetSubCompanies() {
  return { type: RESET_SUB_COMPANIES };
}

export function saveSubCompaniesPagination(pagination) {
  return {
    type: SAVE_SUB_COMPANIES_PAGINATION,
    pagination,
  };
}

export function fetchCompanies(page = 0, pageSize = 10) {
  return async (dispatch, getState) => {
    try {
      const {
        companies: {
          data: { filters },
        },
        organizations: { selectedOrganization: organization },
      } = getState();
      const params = {
        ...filters,
        page,
        pageSize,
      };
      const response = await CompaniesAPI.fetchOrganizationCompanies(organization.id, params);
      if (response && response.data && response.data.content) {
        dispatch(saveCompanies(response.data.content));
        dispatch(saveCompaniesPagination(_.omit(response.data, 'content')));
        return response.data.content;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function fetchAppendCompanies(page = 0, pageSize = 10) {
  return async (dispatch, getState) => {
    try {
      const {
        companies: {
          data: { filters },
        },
        organizations: { selectedOrganization: organization },
      } = getState();
      const params = {
        ...filters,
        page,
        pageSize,
      };
      const response = await CompaniesAPI.fetchOrganizationCompanies(organization.id, params);
      if (response && response.data && response.data.content) {
        dispatch(appendCompanies(response.data.content));
        dispatch(saveCompaniesPagination(_.omit(response.data, 'content')));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function fetchRootCompanies(page = 0, pageSize = 10) {
  return async (dispatch, getState) => {
    try {
      const {
        companies: {
          rootCompanies: { filters },
        },
      } = getState();
      const params = {
        page,
        pageSize,
        ...filters,
      };
      const organizationResponse = await OrganizationsAPI.fetchOrganizations(params);
      if (organizationResponse && organizationResponse.data && organizationResponse.data.content) {
        const organizations = organizationResponse.data.content;
        dispatch(saveRootCompanies(organizations));
        dispatch(saveRootCompaniesPagination(_.omit(organizationResponse.data, 'content')));
        return organizationResponse.data.content;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function fetchAndAppendRootCompanies(page = 0, pageSize = 10) {
  return async (dispatch, getState) => {
    try {
      const {
        companies: {
          rootCompanies: { filters },
        },
      } = getState();
      const params = {
        page,
        pageSize,
        ...filters,
      };
      const organizationResponse = await OrganizationsAPI.fetchOrganizations(params);
      if (organizationResponse && organizationResponse.data && organizationResponse.data.content) {
        const organizations = organizationResponse.data.content;
        dispatch(appendRootCompanies(organizations));
        dispatch(saveRootCompaniesPagination(_.omit(organizationResponse.data, 'content')));
        return organizationResponse.data.content;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function getCompanyLogo(company) {
  return async (dispatch, getState) => {
    const {
      organizations: { selectedOrganization: organization },
    } = getState();
    const response = await CompaniesAPI.getOrganizationCompanyLogo(organization.id, company.id);
    if (response.data) {
      const decodedUrl = URL.createObjectURL(response.data);
      return decodedUrl;
    }
  };
}

export function fetchCompaniesAndLogos(page = 0, pageSize = 10) {
  return async (dispatch, getState) => {
    const {
      companies: {
        data: { filters },
      },
      organizations: { selectedOrganization: organization },
    } = getState();
    const params = {
      ...filters,
      page,
      pageSize,
    };
    const response = await CompaniesAPI.fetchOrganizationCompanies(organization.id, params);
    if (response && response.data && response.data.content) {
      const companiesFetched = response.data.content;
      const approvationCalls = _.map(companiesFetched, async (company) => {
        try {
          const companyLogo = await dispatch(getCompanyLogo(company));
          dispatch(updateCompanyInState({ ...company, logo: companyLogo }));
          return { ...company, logo: companyLogo };
        } catch (error) {
          dispatch(updateCompanyInState(company));
          return company;
        }
      });
      await Promise.all(approvationCalls);
      dispatch(saveCompaniesPagination(_.omit(response.data, 'content')));
      return response.data;
    }
  };
}

export function fetchAppendCompaniesWithLogos(page = 0, pageSize = 10) {
  return async (dispatch, getState) => {
    try {
      const {
        companies: {
          data: { filters },
        },
        organizations: { selectedOrganization: organization },
      } = getState();
      const params = {
        ...filters,
        page,
        pageSize,
      };
      const response = await CompaniesAPI.fetchOrganizationCompanies(organization.id, params);
      if (response && response.data && response.data.content) {
        const companiesFetched = response.data.content;
        const approvationCalls = _.map(companiesFetched, async (company) => {
          try {
            const companyLogo = await dispatch(getCompanyLogo(company));
            dispatch(updateCompanyInState({ ...company, logo: companyLogo }));
          } catch (error) {
            dispatch(updateCompanyInState(company));
          }
        });
        await Promise.all(approvationCalls);
        dispatch(saveCompaniesPagination(_.omit(response.data, 'content')));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function createCompany(companyDTO) {
  return async (dispatch, getState) => {
    try {
      const {
        organizations: { selectedOrganization: organization },
        companies: { selectedRootCompany: parentCompany },
      } = getState();

      const formattedCompany = {
        details: companyDTO,
        name: companyDTO.name,
        organization: organization.id,
        parentCompany: parentCompany.id, // FIXMEEE
      };
      const response = await CompaniesAPI.createOrganizationCompany(organization.id, formattedCompany);
      if (response.data) {
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function updateCompany(companyDTO) {
  return async (dispatch, getState) => {
    try {
      const {
        organizations: { selectedOrganization: organization },
      } = getState();
      const response = await CompaniesAPI.updateOrganizationCompany(organization.id, companyDTO.id, companyDTO);
      if (response.data) {
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function createCompanyDetails(companyDTO, companyId) {
  return async (dispatch, getState) => {
    try {
      const {
        organizations: { selectedOrganization: organization },
      } = getState();
      const response = await CompaniesAPI.createCompanyDetails(organization.id, companyId, companyDTO);
      if (response.data) {
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function updateCompanyDetails(companyDTO) {
  return async (dispatch, getState) => {
    try {
      const {
        organizations: { selectedOrganization: organization },
      } = getState();
      const response = await CompaniesAPI.modifyCompanyDetails(organization.id, companyDTO.id, companyDTO);
      if (response.data) {
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function createCompanyLogo(companyId, logo) {
  return async (dispatch, getState) => {
    try {
      const {
        organizations: { selectedOrganization: organization },
      } = getState();
      const response = await CompaniesAPI.createOrganizationCompanyLogo(organization.id, companyId, logo);
      if (response.data) {
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function deleteAndUpdateCompanyLogo(companyId, logo) {
  return async (dispatch, getState) => {
    const {
      organizations: { selectedOrganization: organization },
    } = getState();
    await CompaniesAPI.deleteOrganizationCompanyLogo(organization.id, companyId);
    const response = await CompaniesAPI.createOrganizationCompanyLogo(organization.id, companyId, logo);
    if (response.data) {
      return response.data;
    }
  };
}

export function fetchCompanyDetails(company) {
  return async (dispatch, getState) => {
    try {
      const {
        organizations: { selectedOrganization: organization },
      } = getState();
      const response = await CompaniesAPI.fetchCompanyDetails(organization.id, company.id);
      if (response.data) {
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function deleteCompany(companyDTO) {
  return async (dispatch, getState) => {
    try {
      const {
        organizations: { selectedOrganization: organization },
      } = getState();
      const response = await CompaniesAPI.deleteOrganizationCompany(organization.id, companyDTO.id);
      if (response.data) {
        dispatch(deleteCompanyInState(companyDTO.id));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function fetchCompanyDetailsAndLogo(company) {
  return async (dispatch) => {
    let companyDetailed = company;
    try {
      const details = await dispatch(fetchCompanyDetails(company));
      companyDetailed = { ...company, ..._.omit(details, 'id') };
    } catch (error) {
      companyDetailed = { ...companyDetailed, isNew: true };
    }
    try {
      const logo = await dispatch(getCompanyLogo(companyDetailed));
      companyDetailed.logo = logo;
    } catch (error) {}
    return companyDetailed;
  };
}

export function initializeModifyForm() {
  return async (dispatch, getState) => {
    const state = getState();
    const company = state.companies.selectedRootCompany;
    const companyDetailed = await dispatch(fetchCompanyDetailsAndLogo({ ...company }));
    dispatch(setSelectedRootCompany(companyDetailed));
    const companyPhotoTypes = companyDetailed.photoTypes ? _.map(companyDetailed.photoTypes, (photoType) => photoType.id) : [];
    dispatch(initialize('CompanyForm', { ...companyDetailed, photoTypes: companyPhotoTypes }));
  };
}

export function fetchSubCompanies(page = 0, pageSize = 10) {
  return async (dispatch, getState) => {
    try {
      const {
        companies: {
          subCompanies: { filters },
          selectedRootCompany,
        },
        organizations: { selectedOrganization: organization },
      } = getState();
      const params = {
        ...filters,
        page,
        pageSize,
      };
      const response = await CompaniesAPI.fetchSubcompanies(organization.id, selectedRootCompany.id, params);
      if (response && response.data && response.data.content) {
        dispatch(saveSubCompanies(response.data.content));
        dispatch(saveSubCompaniesPagination(_.omit(response.data, 'content')));
        return response.data.content;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function fetchSubCompaniesAndLogos(page = 0, pageSize = 10) {
  return async (dispatch, getState) => {
    const {
      companies: {
        subCompanies: { filters },
        selectedRootCompany,
      },
      organizations: { selectedOrganization: organization },
    } = getState();
    const params = {
      ...filters,
      page,
      pageSize,
    };
    const response = await CompaniesAPI.fetchSubcompanies(organization.id, selectedRootCompany.id, params);
    if (response && response.data && response.data.content) {
      const companiesFetched = response.data.content;
      const approvationCalls = _.map(companiesFetched, async (company) => {
        try {
          const companyLogo = await dispatch(getCompanyLogo(company));
          dispatch(updateSubCompanyInState({ ...company, logo: companyLogo }));
          return { ...company, logo: companyLogo };
        } catch (error) {
          dispatch(updateSubCompanyInState(company));
          return company;
        }
      });
      await Promise.all(approvationCalls);
      dispatch(saveSubCompaniesPagination(_.omit(response.data, 'content')));
      return response.data.content;
    }
  };
}

export async function fetchSubCompaniesOptions(name, company, organization) {
  const params = {
    name,
    pageSize: 100,
  };
  try {
    const response = await CompaniesAPI.fetchSubcompanies(organization.id, company.id, params);
    if (response && response.data && response.data.content) {
      return response.data.content;
    }
    return [];
  } catch (error) {
    throw error;
  }
}
export function fetchAppendSubCompaniesWithLogos(page = 0, pageSize = 10) {
  return async (dispatch, getState) => {
    try {
      const {
        companies: {
          subCompanies: { filters },
          selectedRootCompany,
        },
        organizations: { selectedOrganization: organization },
      } = getState();
      const params = {
        ...filters,
        page,
        pageSize,
      };
      const response = await CompaniesAPI.fetchSubcompanies(organization.id, selectedRootCompany.id, params);
      if (response && response.data && response.data.content) {
        const companiesFetched = response.data.content;
        const approvationCalls = _.map(companiesFetched, async (company) => {
          try {
            const companyLogo = await dispatch(getCompanyLogo(company));
            dispatch(updateSubCompanyInState({ ...company, logo: companyLogo }));
          } catch (error) {
            dispatch(updateSubCompanyInState(company));
          }
        });
        await Promise.all(approvationCalls);
        dispatch(saveSubCompaniesPagination(_.omit(response.data, 'content')));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function fetchCompanyPricingPackages(companyId) {
  return async (dispatch, getState) => {
    try {
      const {
        organizations: { selectedOrganization: organization },
      } = getState();
      const response = await CompaniesAPI.fetchCompanyPricingPackage(organization.id, companyId);
      if (response && response.data && response.data) {
        dispatch(saveCompanyPricingPackages(response.data));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function fetchCompanyChecklist(companyId) {
  return async (dispatch, getState) => {
    try {
      const {
        organizations: { selectedOrganization: organization },
      } = getState();
      const response = await CompaniesAPI.fetchCompanyChecklist(organization.id, companyId);
      if (response && response.data) {
        dispatch(saveCompanyChecklist(response.data));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function fetchCompanyPenaltiesConfig(companyId) {
  return async (dispatch, getState) => {
    try {
      const {
        organizations: { selectedOrganization: organization },
      } = getState();
      const response = await CompaniesAPI.getCompanyPenaltiesConfig(organization.id, companyId);
      if (response && response.data) {
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function resetCompanyPenaltiesConfig(companyId) {
  return async (dispatch, getState) => {
    try {
      const {
        organizations: { selectedOrganization: organization },
      } = getState();
      const response = await CompaniesAPI.deleteCompanyPenaltiesConfig(organization.id, companyId);
      if (response && response.data) {
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function updateCompanyPenaltiesConfig(companyId, configData) {
  return async (dispatch, getState) => {
    try {
      const {
        organizations: { selectedOrganization: organization },
      } = getState();
      const response = await CompaniesAPI.updateCompanyPenaltiesConfig(organization.id, companyId, configData);
      if (response && response.data) {
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}
