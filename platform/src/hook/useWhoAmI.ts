import { USER_ROLES } from 'config/consts';
import { useSelector } from 'react-redux';

export const useWhoAmI = () =>
  useSelector((state: any) => {
    const authorities: Array<string> = state.user?.data?.authorities || [];
    const organization = state.user?.data?.organization;

    const isCcUser = authorities.includes(USER_ROLES.ROLE_CONTACT_CENTER);
    const isSMB = authorities.includes(USER_ROLES.ROLE_SMB);
    const isBoom = organization === 1 && !authorities.includes(USER_ROLES.ROLE_PHOTOGRAPHER);
    const isPhotographer = authorities.includes(USER_ROLES.ROLE_PHOTOGRAPHER);

    return {
      isPhotographer,
      isCcUser,
      isSMB,
      isBoom,
      isClient: !isBoom && !isPhotographer && !isCcUser && !isSMB,
    };
  });
