import qs from 'query-string';

import { API_VERSION } from 'config/configurations';
import { DashboardAllOrderRequest } from 'types/DashboardAllOrderRequest';

export const listDashboardAllOrders = (req: DashboardAllOrderRequest) => `/api/${API_VERSION}/dashboard-all/orders?${qs.stringify(req)}`;
