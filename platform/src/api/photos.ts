import { API_VERSION } from '../config/configurations';
import { axiosBoomInstance } from './instances/boomInstance';

export const refuseOrder = (orderCode: string, reasonCode: string, reasonText: string) =>
  axiosBoomInstance.post(`/api/${API_VERSION}/orders/${orderCode}/raw/refuse`, { reasonCode, reasonText });

export const reshootOrder = (orderCode: string, reasonCode: string, reasonText: string) =>
  axiosBoomInstance.post(`/api/${API_VERSION}/orders/${orderCode}/raw/reshoot`, { reasonCode, reasonText });
