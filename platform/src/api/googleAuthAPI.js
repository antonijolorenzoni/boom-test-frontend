import { API_VERSION } from '../config/configurations';
import { axiosBoomInstance } from './instances/boomInstance';

export const getDriveAuthorizationUrl = (organizationId, companyId) => {
  return axiosBoomInstance.get(
    `/api/${API_VERSION}/organizations/${organizationId}/companies/${companyId}/authorize?returnUrl=${window.location}`
  );
};

export function revokeAuth(organizationId, companyId) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/companies/${companyId}/revoke`);
}
