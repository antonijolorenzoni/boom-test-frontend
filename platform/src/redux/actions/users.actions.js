//
// ──────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: P L A T F O R M   U S E R S   A C T I O N S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────────
//

import _ from 'lodash';
import * as UsersAPI from '../../api/usersAPI';
import {
  APPEND_USERS,
  APPEND_USER_ACCESS_RULES,
  SET_ACCESS_RULES_FILTERS,
  RESET_ACCESS_RULES_FILTERS,
  SAVE_USER_ACCESS_RULES_PAGINATION,
  SAVE_USER_ACCESS_RULES,
  RESET_USER_ACCESS_RULES,
  SET_SELECTED_USER,
  UPDATE_USER,
  DELETE_USER,
  RESET_USERS_DATA,
  RESET_USERS_FILTERS,
  SAVE_USERS,
  SAVE_USERS_PAGINATION,
  SET_USERS_FILTER,
} from './actionTypes/users';

export function saveUsers(users) {
  return {
    type: SAVE_USERS,
    users,
  };
}

export function updateUserInState(user) {
  return {
    type: UPDATE_USER,
    user,
  };
}

export function appendUsers(users) {
  return {
    type: APPEND_USERS,
    users,
  };
}

export function saveUsersPagination(pagination) {
  return {
    type: SAVE_USERS_PAGINATION,
    pagination,
  };
}

export function setUsersFilter(field, value) {
  return {
    type: SET_USERS_FILTER,
    field,
    value,
  };
}

export function setAccessRulesFilter(field, value) {
  return {
    type: SET_ACCESS_RULES_FILTERS,
    field,
    value,
  };
}

export function resetAccessRulesFilters() {
  return { type: RESET_ACCESS_RULES_FILTERS };
}

export function resetUsersFilters() {
  return {
    type: RESET_USERS_FILTERS,
  };
}

export function deleteUserInState(userId) {
  return {
    type: DELETE_USER,
    userId,
  };
}

export function setSelectedUser(user) {
  return {
    type: SET_SELECTED_USER,
    user,
  };
}

export function saveUserAccessRules(accessRules) {
  return {
    type: SAVE_USER_ACCESS_RULES,
    accessRules,
  };
}

export function appendAccessRules(accessRules) {
  return {
    type: APPEND_USER_ACCESS_RULES,
    accessRules,
  };
}

export function saveUserAccessRulesPagination(pagination) {
  return {
    type: SAVE_USER_ACCESS_RULES_PAGINATION,
    pagination,
  };
}

export function resetUserAccessRules() {
  return { type: RESET_USER_ACCESS_RULES };
}
export function resetUsersData() {
  return { type: RESET_USERS_DATA };
}

export function fetchUsers(page = 0, pageSize = 50) {
  return async (dispatch, getState) => {
    try {
      const {
        users: {
          data: { filters },
        },
        organizations: { selectedOrganization: organization },
        user: { data: userData },
      } = getState();
      const params = {
        ...filters,
        page,
        pageSize,
      };
      const response = await UsersAPI.fetchOrganizationUsers(organization.id, params);
      if (response && response.data && response.data.content) {
        const personalId = userData && userData.id;
        const filteredUsers = _.filter(response.data.content, (user) => user.id !== personalId);
        dispatch(saveUsers(filteredUsers));
        dispatch(saveUsersPagination(_.omit(response.data, 'content')));
        return response.data.content;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function fetchUsersByOrganizationId(organizationId, page = 0, pageSize = 50) {
  return async (dispatch, getState) => {
    try {
      const {
        users: {
          data: { filters },
        },
      } = getState();
      const params = {
        ...filters,
        page,
        pageSize,
      };
      const response = await UsersAPI.fetchOrganizationUsers(organizationId, params);
      if (response && response.data && response.data.content) {
        dispatch(saveUsers(response.data.content));
        dispatch(saveUsersPagination(_.omit(response.data, 'content')));
        return response.data.content;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function fetchAppendUsers(page = 0, pageSize = 50) {
  return async (dispatch, getState) => {
    try {
      const {
        users: {
          data: { filters },
        },
        organizations: { selectedOrganization: organization },
        user: { data: userData },
      } = getState();
      const params = {
        ...filters,
        page,
        pageSize,
      };
      const response = await UsersAPI.fetchOrganizationUsers(organization.id, params);
      if (response && response.data && response.data.content) {
        const personalId = userData && userData.id;
        const filteredUsers = _.filter(response.data.content, (user) => user.id !== personalId);
        dispatch(appendUsers(filteredUsers));
        dispatch(saveUsersPagination(_.omit(response.data, 'content')));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function createUser(userDTO) {
  return async (dispatch, getState) => {
    try {
      const {
        organizations: { selectedOrganization: organization },
      } = getState();
      const newUser = {
        username: userDTO.email,
        accessRules: [
          {
            company: userDTO.company && userDTO.company.value && _.toInteger(userDTO.company.value),
            role: userDTO.role && userDTO.role.value && _.toInteger(userDTO.role.value),
          },
        ],
        ...userDTO,
      };
      const response = await UsersAPI.createOrganizationUser(organization.id, newUser);
      if (response.data) {
        return response.data;
      }
      throw new Error();
    } catch (error) {
      if (error && error.response && error.response.data && error.response.data.code) throw error.response.data.code;
      throw error;
    }
  };
}

export function modifyUser(userDTO) {
  return async (dispatch, getState) => {
    try {
      const {
        organizations: { selectedOrganization: organization },
      } = getState();
      const roleIds = [..._.map(userDTO.roles, (userRole) => userRole.id)];
      const newUser = {
        roleIds,
        ...userDTO,
      };
      const response = await UsersAPI.updateOrganizationUser(organization.id, userDTO.id, newUser);
      if (response.data) {
        dispatch(updateUserInState(response.data));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function modifyUserRoleFromAccessRule(user, roleDTO) {
  return async (dispatch, getState) => {
    try {
      const {
        organizations: { selectedOrganization: organization },
      } = getState();
      const newUserRole = {
        roleIds: [..._.map(user.roles, (userRole) => userRole.id), _.toInteger(roleDTO.role.value)],
      };
      const response = await UsersAPI.updateOrganizationUser(organization.id, user.id, newUserRole);
      if (response.data) {
        dispatch(updateUserInState(response.data));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function deleteUser(userDTO) {
  return async (dispatch, getState) => {
    try {
      const {
        organizations: { selectedOrganization: organization },
      } = getState();
      const response = await UsersAPI.deleteOrganizationUser(organization.id, userDTO.id);
      if (response.data) {
        dispatch(deleteUserInState(userDTO.id));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function resendUserRegistrationEmail(userId) {
  return async (dispatch, getState) => {
    try {
      const {
        organizations: { selectedOrganization: organization },
      } = getState();
      const response = await UsersAPI.resendUserRegistrationEmail(organization.id, userId);
      if (response.data) {
        dispatch(updateUserInState(response.data));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function createUserAccessRule(userId, companyId, roleId) {
  return async (dispatch, getState) => {
    try {
      const accessRuleDTO = {
        company: companyId,
        role: roleId,
      };
      const {
        organizations: { selectedOrganization: organization },
      } = getState();
      const response = await UsersAPI.createOrganizationUserAccessRule(organization.id, userId, accessRuleDTO);
      if (response.data) {
        dispatch(appendUsers([]));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function deleteUserAccessRule(userId, accessRule) {
  return async (dispatch, getState) => {
    try {
      const accessRuleDTO = {
        companyId: accessRule.company && accessRule.company.id,
        roleId: accessRule.role && accessRule.role.id,
      };
      const {
        organizations: { selectedOrganization: organization },
      } = getState();
      const response = await UsersAPI.deleteUserAccessRule(organization.id, userId, accessRuleDTO);
      if (response.data) {
        dispatch(appendUsers([]));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}
export function fetchUsersAccessRules(page = 0, pageSize = 50) {
  return async (dispatch, getState) => {
    try {
      const {
        users: {
          selectedUser,
          accessRules: { filters },
        },
        organizations: { selectedOrganization: organization },
      } = getState();
      const params = {
        ...filters,
        page,
        pageSize,
      };
      const response = await UsersAPI.getUserAccessRule(organization.id, selectedUser.id, params);
      if (response && response.data && response.data.content) {
        dispatch(saveUserAccessRules(response.data.content));
        dispatch(saveUserAccessRulesPagination(_.omit(response.data, 'content')));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function fetchAndAppendUsersAccessRules(page = 0, pageSize = 50) {
  return async (dispatch, getState) => {
    try {
      const {
        users: {
          selectedUser,
          accessRules: { filters },
        },
        organizations: { selectedOrganization: organization },
      } = getState();
      const params = {
        ...filters,
        page,
        pageSize,
      };
      const response = await UsersAPI.getUserAccessRule(organization.id, selectedUser.id, params);
      if (response && response.data && response.data.content) {
        dispatch(appendAccessRules(response.data.content));
        dispatch(saveUserAccessRulesPagination(_.omit(response.data, 'content')));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}
