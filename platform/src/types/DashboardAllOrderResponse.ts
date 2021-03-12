import { OrderStatus } from './OrderStatus';
import { PaginationResponse } from './PaginationResponse';
import { Photographer } from './Photographer';

export interface DashboardAllOrder {
  address: string;
  companyId: number;
  companyName: string;
  companyScore?: number | null;
  countryIsoCode: string;
  createdAt: string;
  downloadLink?: string | null;
  endDate?: string;
  orderCode: string;
  orderId: number;
  orderStatus: OrderStatus;
  orderTitle: string;
  photographer?: Photographer;
  packet?: {
    currency: string;
    duration: number;
    name: string;
    photos: number;
    price: number;
  };
  startDate?: string;
  timezone: string;

  updatedAt: string;
}

type Orders = { content: Array<DashboardAllOrder> };
export type DashboardAllOrdersResponse = Orders & PaginationResponse;
