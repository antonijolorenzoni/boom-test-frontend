import useSWR from 'swr';
import { axiosBoomInstance } from 'api/instances/boomInstance';
import { ApiResponse } from 'types/ApiResponse';
import { DashboardAllOrderRequest } from 'types/DashboardAllOrderRequest';
import { listDashboardAllOrders } from 'api/paths/order-dashboard-all';
import { DashboardAllOrdersResponse } from 'types/DashboardAllOrderResponse';

export const useOrdersDashboardAll = (req: DashboardAllOrderRequest, shouldFetch: boolean, key?: number) => {
  const { data, error, mutate } = useSWR<ApiResponse<DashboardAllOrdersResponse>>(
    shouldFetch ? [listDashboardAllOrders(req), key] : null,
    // key is used only to invalidate the swr cache and force the loading state
    (url, key) => axiosBoomInstance.get(url)
  );

  return { dashboardAllOrdersResponse: data?.data, error, mutate };
};
