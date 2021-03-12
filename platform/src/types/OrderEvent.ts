import { OrderStatus } from './OrderStatus';

// Calendar component custom event typedef
export type OrderEvent = {
  orderId: number;
  orderCode: string;
  orderTitle: string;
  companyId: number;
  companyName: string;
  startDate: Date;
  endDate: Date;
  address: string;
  latitude: number;
  longitude: number;
  orderStatus: OrderStatus;
};
