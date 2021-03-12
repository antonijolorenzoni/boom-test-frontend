//
// ────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: C O M P A N I E S   R E D U C E R : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────
//

import Immutable from 'seamless-immutable';
import _ from 'lodash';
import {
  SAVE_COMPANIES,
  APPEND_COMPANIES,
  DELETE_COMPANY,
  SAVE_COMPANIES_PAGINATION,
  SET_COMPANIES_FILTER,
  RESET_COMPANIES_FILTERS,
  SET_SELECTED_COMPANY,
  UPDATE_COMPANY,
  RESET_COMPANIES_DATA,
  SAVE_ROOT_COMPANIES,
  SAVE_ROOT_COMPANIES_PAGINATION,
  APPEND_ROOT_COMPANIES,
  RESET_ROOT_COMPANIES,
  ADD_NEW_NAVIGATION_LEVEL,
  ADD_NEW_NAVIGATION_LEVELS,
  REPLACE_NAVIGATION_LEVEL,
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
  SAVE_COMPANY_CHECKLIST,
  RESET_COMPANY_CHECKLIST,
} from '../actions/actionTypes/companies';

const initialState = Immutable({
  data: {
    content: [],
    pagination: {},
    filters: {},
  },
  rootCompanies: {
    content: [],
    pagination: {},
    filters: {},
  },
  subCompanies: {
    content: [],
    pagination: {},
    filters: {},
  },
  pricingPackages: [],
  navigation: {
    levels: [],
  },
  checklist: null,
  selectedRootCompany: {},
  selectedSubCompany: {},
});

export default function (state = initialState, action) {
  switch (action.type) {
    case SAVE_COMPANIES:
      return state.setIn(['data', 'content'], action.companies);
    case APPEND_COMPANIES:
      return state.setIn(['data', 'content'], [...state.data.content, ...action.companies]);
    case DELETE_COMPANY: {
      const companies = _.filter(state.data.content, (companyState) => companyState.id !== action.companyID);
      return state.setIn(['data', 'content'], companies);
    }
    case SAVE_ROOT_COMPANIES:
      return state.setIn(['rootCompanies', 'content'], action.companies);
    case APPEND_ROOT_COMPANIES:
      return state.setIn(['rootCompanies', 'content'], [...state.rootCompanies.content, ...action.companies]);
    case SAVE_ROOT_COMPANIES_PAGINATION:
      return state.setIn(['rootCompanies', 'pagination'], action.pagination);
    case RESET_ROOT_COMPANIES:
      return state.set('rootCompanies', initialState.rootCompanies);
    case SAVE_SUB_COMPANIES:
      return state.setIn(['subCompanies', 'content'], action.companies);
    case APPEND_SUB_COMPANIES:
      return state.setIn(['subCompanies', 'content'], [...state.subCompanies.content, ...action.companies]);
    case SAVE_SUB_COMPANIES_PAGINATION:
      return state.setIn(['subCompanies', 'pagination'], action.pagination);
    case RESET_SUB_COMPANIES:
      return state.setIn(['subCompanies', 'content'], []);
    case UPDATE_SUB_COMPANY: {
      const index = _.findIndex(state.subCompanies.content, (data) => data.id === action.company.id);
      if (index !== -1) {
        return state.setIn(['subCompanies', 'content', index], action.company);
      }
      return state.setIn(['subCompanies', 'content'], [...state.subCompanies.content, action.company]);
    }
    case UPDATE_COMPANY: {
      const index = _.findIndex(state.data.content, (data) => data.id === action.company.id);
      if (index !== -1) {
        return state.setIn(['data', 'content', index], action.company);
      }
      return state.setIn(['data', 'content'], [...state.data.content, action.company]);
    }
    case SAVE_COMPANIES_PAGINATION:
      return state.setIn(['data', 'pagination'], action.pagination);
    case SET_COMPANIES_FILTER:
      return state.setIn(['data', 'filters', action.field], action.value);
    case RESET_COMPANIES_FILTERS:
      return state.setIn(['data', 'filters'], {});
    case SET_SUB_COMPANY_FILTER:
      return state.setIn(['subCompanies', 'filters', action.field], action.value);
    case RESET_SUB_COMPANIES_FILTER:
      return state.setIn(['subCompanies', 'filters'], {});
    case SET_SELECTED_COMPANY:
      return state.set('selectedCompany', action.company);
    case RESET_COMPANIES_DATA:
      return state.setIn(['data', 'content'], []).setIn(['data', 'pagination'], {});
    case SET_SELECTED_ROOT_COMPANY:
      return state.set('selectedRootCompany', action.company);
    case UPDATE_SELECTED_ROOT_COMPANY: {
      return state.set('selectedRootCompany', Immutable.merge(state.selectedRootCompany, action.companyFields));
    }
    case ADD_NEW_NAVIGATION_LEVEL: {
      return state.setIn(['navigation', 'levels'], [...state.navigation.levels, action.level]);
    }
    case ADD_NEW_NAVIGATION_LEVELS: {
      return state.setIn(['navigation', 'levels'], [...state.navigation.levels, ...action.levels]);
    }
    case REPLACE_NAVIGATION_LEVEL: {
      const index = _.findIndex(state.navigation.levels, (data) => data.id === action.level.id);
      if (index !== -1) {
        return state.setIn(['navigation', 'levels', index], action.level);
      }
      return state;
    }
    case JUMP_NAVIGATION_LEVEL:
      return state.setIn(['navigation', 'levels'], _.slice(state.navigation.levels, 0, action.index));
    case SET_ROOT_COMPANIES_FILTER:
      return state.setIn(['rootCompanies', 'filters', action.field], action.value);
    case RESET_ROOT_COMPANIES_FILTERS:
      return state.setIn(['rootCompanies', 'filters'], {});
    case SAVE_COMPANY_PRICING_PACKAGES:
      return state.set('pricingPackages', action.pricingPackages);
    case RESET_COMPANY_PRICING_PACKAGES:
      return state.set('pricingPackages', []);
    case SAVE_COMPANY_CHECKLIST:
      return state.set('checklist', action.checklist);
    case RESET_COMPANY_CHECKLIST:
      return state.set('checklist', null);
    default:
      return state;
  }
}
