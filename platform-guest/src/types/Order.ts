import { Company } from './Company';
import { MainContact } from './MainContact';
import { OrderDetails } from './OrderDetails';
import { OrderStatus } from './OrderStatus';
import { OrderType } from './OrderType';

export interface Order {
  address: string;
  businessName: string;
  company: Company;
  contact: MainContact;
  details: OrderDetails;
  downloadLink: string | null;
  endDate: string | null;
  orderCode: string;
  orderId: number;
  orderStatus: OrderStatus;
  orderType: OrderType;
  startDate: string | null;
  suggestedDate?: string;
  timezone: string;
}
