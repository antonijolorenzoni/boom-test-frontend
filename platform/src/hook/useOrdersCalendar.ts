import useSWR from 'swr';
import { axiosBoomInstance } from 'api/instances/boomInstance';
import { ApiResponse } from 'types/ApiResponse';
import { CalendarOrderResponse } from 'types/CalendarOrderResponse';
import { listCalendarOrders } from 'api/paths/order-calendar';
import { CalendarOrderRequest } from 'types/CalendarOrderRequest';

export const useOrdersCalendar = (req: CalendarOrderRequest, shouldFetch: boolean, key?: number) => {
  const { data: calendarOrdersResponse, error, mutate } = useSWR<ApiResponse<CalendarOrderResponse>>(
    shouldFetch ? [listCalendarOrders(req), key] : null,
    // key is used only to invalidate the swr cache and force the loading state
    (url, key) => axiosBoomInstance.get(url)
  );

  return { calendarOrdersResponse, error, mutate };
};
