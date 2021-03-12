//
// ──────────────────────────────────────────────────────────────── I ──────────
//   :::::: U S E R   A C T I O N S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────
//

import jwt from 'jsonwebtoken';
import _ from 'lodash';
import * as BoomInstance from '../../api/instances/boomInstance';
/* APIS */
import * as UserAPI from '../../api/userAPI';
import * as UsersAPI from '../../api/usersAPI';
import { JWT_ENCRIPTION_KEY } from '../../config/configurations';
import translations from 'translations/i18next';
import { ACCESS_RULES_TYPES, LANGUAGE_LOCAL_MAP, USER_ROLES, DEFAULT_LANGUAGE } from '../../config/consts';
import { saveDataToLocalStorage } from '../../config/utils';
import AbilityProvider from '../../utils/AbilityProvider';
import {
  LOGOUT,
  SAVE_PERSONAL_ACCESS_RULES,
  SAVE_PHOTO_TYPES,
  SAVE_USER_DATA,
  SET_USER_AUTHENTICATION,
  SET_SMB_SUBSCRIPTION_STATUS,
} from './actionTypes/user';
import * as UtilsActions from './utils.actions';
import * as ModalsActions from './modals.actions';

export function saveUserData(userData, saveToLocalStorage = false) {
  return (dispatch) => {
    if (saveToLocalStorage) {
      saveDataToLocalStorage('user', jwt.sign(userData, JWT_ENCRIPTION_KEY));
    }
    dispatch({
      type: SAVE_USER_DATA,
      userData,
    });
  };
}

export function setUserAuthenticated(value, saveToLocalStorage = true) {
  if (saveToLocalStorage) saveDataToLocalStorage('isAuthenticated', value);
  return {
    type: SET_USER_AUTHENTICATION,
    authenticated: value,
  };
}

export function savePhotoTypes(types) {
  return {
    type: SAVE_PHOTO_TYPES,
    types,
  };
}

export function saveUserAccessRules(companyId, accessRules) {
  return {
    type: SAVE_PERSONAL_ACCESS_RULES,
    companyId,
    accessRules,
  };
}

export function resetUserData() {
  return { type: LOGOUT };
}

export function setSmbSubscriptionStatus(subscriptionStatus) {
  return { type: SET_SMB_SUBSCRIPTION_STATUS, subscriptionStatus };
}

export function userLogout() {
  return (dispatch) => {
    BoomInstance.interceptorEjectRequest();
    dispatch(resetUserData());
    localStorage.clear();
  };
}

export function fetchUser() {
  return async (dispatch, getState) => {
    try {
      if (localStorage.token) {
        const decodedJWT = jwt.decode(localStorage.token);
        const { authorities } = decodedJWT;
        const response = await UserAPI.fetchUser();
        if (response && response.data) {
          const { data: userData } = response;
          const isBoom = userData.organization === 1;
          dispatch(saveUserData({ ...userData, isBoom, isPhotographer: false, authorities }), true);
          const userLanguage = userData && userData.language;
          if (userLanguage) {
            const languageToSet = LANGUAGE_LOCAL_MAP[userLanguage];
            dispatch(UtilsActions.setLanguage(languageToSet ? languageToSet.translation : DEFAULT_LANGUAGE));
          }
          return userData;
        }
        throw new Error();
      }
    } catch (error) {
      throw error;
    }
  };
}

export function updateUserInfo(userDTO) {
  return async (dispatch, getState) => {
    try {
      if (localStorage.token) {
        const decodedJWT = jwt.decode(localStorage.token);
        const { authorities } = decodedJWT;
        const response = await UserAPI.updateUser(userDTO);
        if (response && response.data) {
          const { data: userData } = response;
          const isBoom = userData.organization === 1;
          dispatch(saveUserData({ ...userData, isBoom, isPhotographer: false, authorities }), true);
          const userLanguage = userData && userData.language;
          if (userLanguage) {
            dispatch(UtilsActions.setLanguage(userLanguage ?? DEFAULT_LANGUAGE));
          }
          return userData;
        }
      }
    } catch (error) {
      throw error;
    }
  };
}
export function fetchPhotoTypes() {
  return async (dispatch) => {
    try {
      const response = await UserAPI.fetchPhotoTypes();
      if (response && response.data) {
        dispatch(savePhotoTypes(response.data));
      }
    } catch (error) {
      throw error;
    }
  };
}

export function confirmUserRegistration(token, password, history) {
  return async (dispatch) => {
    dispatch(UtilsActions.setSpinnerVisibile(true, translations.t('login.creatingYourAccount')));
    try {
      const parameters = {
        password,
        token,
      };

      await UserAPI.confirmUserRegistration(parameters);

      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('ACCOUNT_SUCCESS', {
          modalType: 'MODAL_DIALOG',
          modalProps: {
            title: translations.t('modals.compliment'),
            bodyText: translations.t('login.createAccountSuccess'),
            onConfirm: () => {
              dispatch(ModalsActions.hideModal('ACCOUNT_SUCCESS'));
              history.push('/login');
            },
            confirmText: 'Login',
            hideCancel: true,
          },
        })
      );
    } catch (error) {
      const errorCode = _.get(error, 'response.data.code');

      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('CONFIRM_REGISTRATION_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: errorCode === 13007 ? translations.t('login.tokenNotFound') : translations.t('login.confirmRegistrationError'),
          },
        })
      );
    }
  };
}

export function recoverUserPassword(username) {
  return async (dispatch, getState) => {
    try {
      const response = await UserAPI.recoverUserPassword({ username });
      if (response && response.data) return response.data;
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function saveUserPassword(token, password) {
  return async (dispatch, getState) => {
    try {
      const parameters = {
        password,
        token,
      };
      const response = await UserAPI.confirmPassword(parameters);
      if (response && response.data) return response.data;
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function fetchPersonalOrganizationAccessRule(organizationId) {
  return async (dispatch, getState) => {
    try {
      const {
        user: { data: userData },
      } = getState();
      const params = {
        pageSize: 50,
        type: ACCESS_RULES_TYPES.USER,
      };

      const isContactCenterUser = userData?.roles?.find((role) => role.name === USER_ROLES.ROLE_CONTACT_CENTER);

      if (!isContactCenterUser) {
        const response = await UsersAPI.getUserPersonalAccessRule(organizationId, userData.id, params);
        if (response && response.data && response.data.content) {
          _.map(response.data.content, (accessRule) => {
            const rule = {
              role: accessRule.role.name,
              roleId: accessRule.role.id,
              company: accessRule.company.name,
              companyId: accessRule.company.id,
              organizationId,
            };
            dispatch(saveUserAccessRules(accessRule.company.id, rule));
          });
        }
      }
    } catch (error) {
      throw error;
    }
  };
}

export function fetchCompanyAccessRules(companyId) {
  return async (dispatch, getState) => {
    try {
      const {
        user: { data: userData },
      } = getState();
      const params = {
        pageSize: 50,
        companyId,
        type: ACCESS_RULES_TYPES.USER,
      };
      const isContactCenterUser = userData.roles.find((role) => role.name === USER_ROLES.ROLE_CONTACT_CENTER);

      if (!isContactCenterUser) {
        const response = await UsersAPI.getUserPersonalAccessRule(userData.organization, userData.id, params);
        if (response && response.data && response.data.content) {
          _.map(response.data.content, (accessRule) => {
            const rule = {
              role: accessRule.role.name,
              roleId: accessRule.role.id,
              company: accessRule.company.name,
              companyId: accessRule.company.id,
              organizationId: userData.organization,
            };
            dispatch(saveUserAccessRules(accessRule.company.id, rule));
          });
        }
      }
    } catch (error) {
      throw error;
    }
  };
}

export function setUserCompanyAbilityProvider(companyId) {
  return (dispatch) => {
    const rolePermissions = dispatch(UtilsActions.getUserRoleAndPermissionsWithinCompany(companyId));
    const abilityProviderHelper = AbilityProvider.getCompanyAbilityHelper();
    abilityProviderHelper.setUserRole(null); // reset before write
    abilityProviderHelper.updateAbilities(rolePermissions.permissions);
    abilityProviderHelper.setUserRole(rolePermissions.role);
  };
}
