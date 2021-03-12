import { IntentStatus } from './payments/IntentStatus';

export interface OrderPaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  status: IntentStatus;
}
