import { axiosBoomInstance } from './instances/boomInstance';
import { API_VERSION } from '../config/configurations';

export const assignOperator = (organizationId, shootingId, operatorId) =>
  axiosBoomInstance.post(`/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/assignments/operator`, operatorId);

export const assignContactCenter = (organizationId, shootingId, contactCenterId) =>
  axiosBoomInstance.post(
    `/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/assignments/contact-center`,
    contactCenterId
  );

export const bulkAssignOperator = (entries) => axiosBoomInstance.post(`/api/${API_VERSION}/assignments/bulk`, entries);

export const ccBulkAssign = (entries) => axiosBoomInstance.post(`/api/${API_VERSION}/assignments/bulk/contact-center`, entries);
