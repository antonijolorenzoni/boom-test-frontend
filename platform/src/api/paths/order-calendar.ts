import qs from 'query-string';

import { API_VERSION } from 'config/configurations';
import { CalendarOrderRequest } from 'types/CalendarOrderRequest';

export const listCalendarOrders = (req: CalendarOrderRequest) => `/api/${API_VERSION}/calendar/orders?${qs.stringify(req)}`;
