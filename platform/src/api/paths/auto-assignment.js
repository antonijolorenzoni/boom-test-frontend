import { API_VERSION } from '../../config/configurations';

export const listMatchedPhotographers = (organizationId, shootingId) =>
  `/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/auto_assignment/matched`;

export const getAutoAssignmentJob = (organizationId, shootingId) =>
  `/api/${API_VERSION}/organizations/${organizationId}/shootings/${shootingId}/auto_assignment`;
