import { IntentStatus } from './payments/IntentStatus';
import { IntentType } from './payments/IntentType';

export interface RetrySubscriptionPaymentResponse {
  clientSecret: string;
  status: IntentStatus;
  type: IntentType;
}
