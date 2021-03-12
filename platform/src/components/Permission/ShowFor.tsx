import React from 'react';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { useUserPermission } from 'hook/useUserPermissions';
import { Permission } from 'types/Permission';
import { featureFlag } from 'config/featureFlags';

export const ShowForRoles: React.FC<{ roles?: Array<string> }> = ({ children, roles }) => {
  const currentRoles = useSelector((state: any) => state?.user?.data?.authorities);
  return roles?.length && currentRoles?.length && _.intersection(roles, currentRoles).length ? <>{children}</> : null;
};

export const ShowForPermissions: React.FC<{ permissions: Array<Permission> }> = ({ children, permissions }) => {
  const userPermissions = useUserPermission();

  if (featureFlag.isFeatureEnabled('c1-compliance')) {
    return permissions.every((p) => userPermissions.has(p)) ? <>{children}</> : null;
  }

  return <>{children}</>;
};

export const useIsUserEnabled = (permissions: Array<Permission>, how: 'some' | 'every' = 'every') => {
  const userPermissions = useUserPermission();
  return permissions[how]((p) => userPermissions.has(p));
};
