import { flatten, uniq } from 'lodash';

import { Roles } from 'types/Roles';
import { Permission } from 'types/Permission';
import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

type RoleWithPermissions = Roles & { permission: Array<{ name: string }> };

export const userPermissionSelector = createSelector(
  [(state: any) => state.roles || [], (state: any) => state.user?.data.roles || []],
  (roles: Array<RoleWithPermissions>, userRoles: Array<Roles>) => {
    const permissionSet = new Set<Permission>();
    const userRoleNames = userRoles.map((role) => role.name);
    const onlyUserRoles = roles.filter((role) => userRoleNames.includes(role.name));

    uniq(
      flatten(onlyUserRoles.map((role: Roles & { permission: Array<{ name: string }> }) => role.permission?.map(({ name }) => name)))
    ).forEach((permission) => {
      permissionSet.add(permission as Permission);
    });

    return permissionSet;
  }
);

export const useUserPermission = () => useSelector(userPermissionSelector);
