import { DashboardAllOrder } from 'types/DashboardAllOrderResponse';
import { OrderStatus } from 'types/OrderStatus';

export type DashboardAllOrderOriginalStatus = DashboardAllOrder & { originalStatus: OrderStatus };
