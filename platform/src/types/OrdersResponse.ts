import { EditingOption } from './EditingOption';
import { PaginationResponse } from './PaginationResponse';
import { Photographer } from './Photographer';

export interface Order {
  address: string;
  assignee: string | null;
  businessName: string;
  callAttempts: number;
  companyId: number;
  companyName: string;
  contactEmail: string;
  contactName: string;
  contactPhone: string;
  countryCode: string;
  createdAt: string;
  editingOption: EditingOption;
  notes: string;
  orderCode: string;
  orderTitle: string;
  orderId: number;
  orderStatus: string;
  photographerId: number | null;
  updatedAt: string;
  pricingPackageName: string;
  countryIsoCode: string;
  startDate: string;
  time: string;
  photographer?: Photographer;
}

type Orders = { content: Array<Order> };
export type OrdersResponse = Orders & PaginationResponse;
