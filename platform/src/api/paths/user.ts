import qs from 'query-string';
import { API_VERSION } from 'config/configurations';

export const listUsers = (params: { organizationId: number; photographer: boolean }) => `/api/${API_VERSION}/user?${qs.stringify(params)}`;

export const listOrganizationUsers = (organizationId: number, params: any) =>
  `/api/${API_VERSION}/organizations/${organizationId}/users?${qs.stringify(params)}`;

export const getMySmbProfile = () => `/api/${API_VERSION}/user/smb/me`;
