import { API_VERSION } from 'config/configurations';

export const getOrganization = (id: number) => `/api/${API_VERSION}/organizations/${id}`;
