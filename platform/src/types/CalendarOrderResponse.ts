import { OrderStatus } from './OrderStatus';

export interface CalendarOrder {
  address: string;
  latitude: number;
  longitude: number;
  companyId: number;
  companyName: string;
  endDate: number;
  orderCode: string;
  orderId: number;
  orderStatus: OrderStatus;
  orderTitle: string;
  startDate: number;
  timezone: string;
}
export interface CalendarOrderResponse {
  orders: Array<CalendarOrder>;
  total: number;
}
