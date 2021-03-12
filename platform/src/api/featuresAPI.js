import { axiosBoomInstance } from './instances/boomInstance';
import { API_VERSION } from '../config/configurations';

export function fetchFeatures() {
  return axiosBoomInstance.get(`/api/${API_VERSION}/public/features`);
}
