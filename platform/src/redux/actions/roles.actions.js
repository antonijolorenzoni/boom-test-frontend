//
// ────────────────────────────────────────────────────────────────── I ──────────
//   :::::: R O L E S   A C T I O N S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────
//

import _ from 'lodash';
import * as RolesAPI from '../../api/rolesAPI';
import { SAVE_ROLES, SAVE_ROLE_PERMISSIONS } from './actionTypes/roles';

export function saveRoles(roles) {
  return {
    type: SAVE_ROLES,
    roles,
  };
}

export function saveRolePermission(roleId, permissions) {
  return {
    type: SAVE_ROLE_PERMISSIONS,
    roleId,
    permissions,
  };
}

export function fetchRoles() {
  return async (dispatch) => {
    try {
      const response = await RolesAPI.fetchRoles();
      if (response && response.data && response.data) {
        dispatch(saveRoles(response.data));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function fetchRolePermission(roleId) {
  return async (dispatch) => {
    try {
      const response = await RolesAPI.fetchRolePermissions(roleId);
      if (response && response.data) {
        dispatch(saveRolePermission(roleId, response.data));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function fetchRolesAndPermissions() {
  return async (dispatch, getState) => {
    await dispatch(fetchRoles());
    const roles = getState().roles;
    const approvationCalls = _.map(roles, (role) => dispatch(fetchRolePermission(role.id)));
    await Promise.all(approvationCalls);
  };
}
