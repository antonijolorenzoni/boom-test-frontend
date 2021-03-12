//
// ────────────────────────────────────────────────────────────────── I ──────────
//   :::::: U T I L S   A C T I O N S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────
//

import i18next from 'i18next';
import _ from 'lodash';
import moment from 'moment';
import * as UserAPI from '../../api/userAPI';
import { USER_ROLES } from '../../config/consts';
import PermissionsParserV0 from '../../utils/PermissionsParserV0';
import {
  SET_CALENDAR_TIMEZONE,
  RESET_PLATFORM_CURRENCIES_FILTERS,
  SAVE_PLATFORM_CURRENCIES,
  SAVE_PLATFORM_CURRENCIES_PAGINATION,
  SET_IS_APP_MOBILE,
  SET_LOADING_PROGRESS_VALUE,
  SET_LOADING_PROGRESS_VISIBLE,
  SET_PLATFORM_CURRENCIES_FILTER,
  SET_SELECTED_LANGUAGE,
  SET_SPINNER_VISIBILITY,
} from './actionTypes/utils';

export function saveCurrencies(currencies) {
  return {
    type: SAVE_PLATFORM_CURRENCIES,
    currencies,
  };
}

export function saveCurrenciesPagination(pagination) {
  return {
    type: SAVE_PLATFORM_CURRENCIES_PAGINATION,
    pagination,
  };
}

export function resetCurrenciesFilters() {
  return { type: RESET_PLATFORM_CURRENCIES_FILTERS };
}

export function setCurrenciesFilter(field, value) {
  return {
    type: SET_PLATFORM_CURRENCIES_FILTER,
    field,
    value,
  };
}

export function setSpinnerVisibile(spinnerVisible, title = null) {
  return {
    type: SET_SPINNER_VISIBILITY,
    spinnerVisible,
    title,
  };
}

export function setSelectedLanguage(language) {
  return {
    type: SET_SELECTED_LANGUAGE,
    language,
  };
}

export function setIsAppMobile(isMobile) {
  return {
    type: SET_IS_APP_MOBILE,
    isMobile,
  };
}

export function setTimezoneSelected(timezone) {
  return {
    type: SET_CALENDAR_TIMEZONE,
    timezone,
  };
}

export function setMomentLocaleRule(language) {
  switch (language) {
    case 'en': {
      moment.locale('en-GB', {
        week: {
          dow: 1, // Monday is the first day of the week.
        },
      });
      break;
    }
    case 'it': {
      moment.locale('it', {
        week: {
          dow: 1, // Monday is the first day of the week.
        },
      });
      break;
    }
    default: {
      moment.locale('en-GB', {
        week: {
          dow: 1, // Monday is the first day of the week.
        },
      });
      break;
    }
  }
}

export function setLanguage(language) {
  return (dispatch, getState) => {
    moment.locale(language);
    setMomentLocaleRule(language);
    i18next.changeLanguage(language);
    dispatch(setSelectedLanguage(language));
  };
}

export function setLoadingProgress(progress) {
  return {
    type: SET_LOADING_PROGRESS_VALUE,
    progress,
  };
}

export function setLoadingProgressVisible(isVisible, title = null) {
  return {
    type: SET_LOADING_PROGRESS_VISIBLE,
    isVisible,
    title,
  };
}

export function getUserPermissionsWithinOrganization() {
  return (dispatch, getState) => {
    const {
      data: { authorities },
    } = getState().user;
    const roles = getState().roles;
    const permissionsMap = _.flatMap(authorities, (auth) => {
      const organizationPermissions = _.find(roles, { name: auth });
      if (!organizationPermissions) {
        return {};
      }
      const permissions = _.map(organizationPermissions.permission, (p) => p.name);

      return PermissionsParserV0.parseArray(permissions);
    });

    const uniquePermissionMap = _.uniqWith(
      permissionsMap,
      (permission1, permission2) => permission1.subject === permission2.subject && permission1.action === permission2.action
    );
    return uniquePermissionMap;
  };
}

export function getUserRoleAndPermissionsWithinCompany(companyId) {
  return (dispatch, getState) => {
    const {
      accessRules,
      data: { roles: userRoles },
    } = getState().user;
    const roles = getState().roles;
    let role;
    const photographerRole = _.find(userRoles, { name: USER_ROLES.ROLE_PHOTOGRAPHER });
    if (photographerRole) {
      role = {
        roleId: photographerRole.id,
        role: photographerRole.name,
      };
    } else {
      const companyRole = _.find(accessRules, { companyId });
      if (!companyRole) {
        return [];
      }
      role = companyRole;
    }

    const companyPermissions = _.find(roles, { name: role.role });
    if (!companyPermissions) {
      return [];
    }
    const permissions = _.map(companyPermissions.permission, (p) => p.name);

    return {
      role,
      permissions: PermissionsParserV0.parseArray(permissions),
    };
  };
}

export function getPlatformCurrencies(page = 0, pageSize = 50) {
  return async (dispatch, getState) => {
    try {
      const {
        utils: {
          currencies: { filters },
        },
      } = getState();
      const params = {
        ...filters,
        page,
        pageSize,
      };
      const response = await UserAPI.fetchCurrencies(params);
      if (response && response.data && response.data.content) {
        dispatch(saveCurrencies(response.data.content));
        dispatch(saveCurrenciesPagination(_.omit(response.data, 'content')));
        return response.data.content;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}
