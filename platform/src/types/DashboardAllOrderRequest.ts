import { Ordering } from './Ordering';

export interface DashboardAllOrderRequest {
  address?: string;
  company?: number | null;
  countryCode?: string | null;
  fromDate?: number | null;
  orderCode?: string | null;
  orderStatuses?: string[];
  page?: number | null;
  pageSize?: number | null;
  search?: string;
  subCompany?: number | null;
  toDate?: number | null;
  updateAt?: string | null;
  startDateDirection?: Ordering | null;
  updatedAt?: Ordering | null;
  createdAt?: Ordering | null;
}
