import { API_VERSION } from '../../config/configurations';
import qs from 'query-string';

export const listContactCenters = `/api/${API_VERSION}/contact-centers`;

export const getContactCenter = (id) => `/api/${API_VERSION}/contact-centers/${id}`;

export const getContactCenterUsers = (id, params) =>
  `/api/${API_VERSION}/contact-centers/${id}/users?pageSize=10000&${qs.stringify(params)}`;
