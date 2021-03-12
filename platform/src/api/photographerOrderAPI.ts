import qs from 'query-string';

import { API_VERSION } from 'config/configurations';
import { axiosBoomInstance } from './instances/boomInstance';
import { PhotographerOrdersRequest } from 'types/PhotographerOrderRequest';

export const listCalendarPhOrders = (req: PhotographerOrdersRequest) =>
  axiosBoomInstance.get(`/api/${API_VERSION}/photographers/calendar?${qs.stringify(req)}`);
export const listDashboardPhOrders = (req: PhotographerOrdersRequest) =>
  axiosBoomInstance.get(`/api/${API_VERSION}/photographers/dashboard?${qs.stringify(req)}`);
