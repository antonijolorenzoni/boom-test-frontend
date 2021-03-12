import { SubscriptionStatus } from 'types/SubscriptionStatus';

export interface SubscriptionResponse {
  billingInfoDto: BillingInfoDto;
  createdAt: string;
  currentPeriodEnd: string;
  remainingTrialDays: number;
  subscriptionId: string;
  subscriptionStatus: SubscriptionStatus;
}

export interface BillingInfoDto {
  address: string;
  city: string;
  corporateName: string;
  country: string;
  sdiCode: string;
  vatNumber: string;
  zipCode: string;
  vatRate: string;
}
