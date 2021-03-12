import qs from 'query-string';
import { API_VERSION } from '../../config/configurations';

export const listOrders = (params: any, page: number, pageSize: number) =>
  `/api/${API_VERSION}/orders?${qs.stringify({ ...params, page, pageSize })}`;

export const operationNotes = (orderId: number) => `/api/${API_VERSION}/orders/${orderId}/operation-notes`;

export const orderScores = (organizationId: number, orderId: number) =>
  `/api/${API_VERSION}/organizations/${organizationId}/shootings/${orderId}/scores`;
