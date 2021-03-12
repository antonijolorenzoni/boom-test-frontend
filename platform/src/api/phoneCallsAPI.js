import { axiosBoomInstance } from './instances/boomInstance';
import { API_VERSION } from 'config/configurations';

export const incrementPhoneCallCounter = (orderCode) =>
  axiosBoomInstance.post(`/api/${API_VERSION}/events/orders/${orderCode}/phone-calls`);
