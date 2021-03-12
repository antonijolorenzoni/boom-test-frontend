import { API_VERSION } from '../config/configurations';
import { axiosBoomInstance } from './instances/boomInstance';

export const refuseInvitation = (orderCode: string, reason: { reasonCode: string; reasonText: string }) =>
  axiosBoomInstance.post(`/api/${API_VERSION}/orders/${orderCode}/refuse`, reason);

export const revokeAvailability = (orderCode: string, reason: { reasonCode: string; reasonText: string }) =>
  axiosBoomInstance.post(`/api/${API_VERSION}/orders/${orderCode}/revoke-availability`, reason);
