//
// ──────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: O R G A N I Z A T I O N   R E D U C E R : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────
//

import Immutable from 'seamless-immutable';
import _ from 'lodash';
import {
  SAVE_ORGANIZATIONS,
  APPEND_ORGANIZATIONS,
  DELETE_ORGANIZATION,
  SAVE_ORGANIZATIONS_PAGINATION,
  SET_ORGANIZATIONS_FILTER,
  RESET_ORGANIZATIONS_FILTERS,
  SET_SELECTED_ORGANIZATION,
  SAVE_PRICING_PACKAGES,
  SAVE_PRICING_PACKAGES_PAGINATION,
  SET_SELECTED_PRICING_PACKAGE,
  RESET_PRICING_PACKAGES_DATA,
  APPEND_PRICING_PACKAGES,
  SET_PRICING_PACKAGES_FILTER,
  RESET_PRICING_PACKAGES_FILTERS,
  SAVE_ORGANIZATION_AUTH_SERVICE,
  RESET_ORGANIZATION_AUTH_SERVICE,
  UPDATE_SELECTED_ORGANIZATION,
} from '../actions/actionTypes/organization';

const initialState = Immutable({
  data: {
    content: [],
    pagination: {},
    filters: {},
  },
  pricingPackages: {
    content: [],
    pagination: {},
    selectedPackage: {},
    filters: {},
  },
  authorizedService: null,
  selectedOrganization: {},
});

export default function (state = initialState, action) {
  switch (action.type) {
    case SAVE_ORGANIZATIONS:
      return state.setIn(['data', 'content'], action.organizations);
    case APPEND_ORGANIZATIONS:
      return state.setIn(['data', 'content'], [...state.data.content, ...action.organizations]);
    case DELETE_ORGANIZATION: {
      const organizations = _.filter(state.data.content, (organizationState) => organizationState.id !== action.organizationID);
      return state.setIn(['data', 'content'], organizations);
    }
    case SAVE_PRICING_PACKAGES:
      return state.setIn(['pricingPackages', 'content'], action.pricingPackages);
    case APPEND_PRICING_PACKAGES:
      return state.setIn(['pricingPackages', 'content'], [...state.pricingPackages.content, ...action.pricingPackages]);
    case SAVE_PRICING_PACKAGES_PAGINATION:
      return state.setIn(['pricingPackages', 'pagination'], action.pagination);
    case SET_SELECTED_PRICING_PACKAGE:
      return state.setIn(['pricingPackages', 'selectedPackage'], action.pricingPackage);
    case RESET_PRICING_PACKAGES_DATA:
      return state.setIn(['pricingPackages', 'content'], []).setIn(['pricingPackages', 'pagination'], {});
    case SET_SELECTED_ORGANIZATION:
      return state.set('selectedOrganization', action.organization);
    case SAVE_ORGANIZATIONS_PAGINATION:
      return state.setIn(['data', 'pagination'], action.pagination);
    case SET_ORGANIZATIONS_FILTER:
      return state.setIn(['data', 'filters', action.field], action.value);
    case RESET_ORGANIZATIONS_FILTERS:
      return state.setIn(['data', 'filters'], {});
    case SET_PRICING_PACKAGES_FILTER:
      return state.setIn(['pricingPackages', 'filters', action.field], action.value);
    case RESET_PRICING_PACKAGES_FILTERS:
      return state.setIn(['pricingPackages', 'filters'], {});
    case SAVE_ORGANIZATION_AUTH_SERVICE:
      return state.set('authorizedService', action.authorizedService);
    case RESET_ORGANIZATION_AUTH_SERVICE:
      return state.set('authorizedService', initialState.authorizedService);
    case UPDATE_SELECTED_ORGANIZATION:
      return state.set('selectedOrganization', Immutable.merge(state.selectedOrganization, action.fields));
    default:
      return state;
  }
}
