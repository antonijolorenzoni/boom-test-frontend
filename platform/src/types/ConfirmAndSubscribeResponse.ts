import { IntentStatus } from './payments/IntentStatus';
import { IntentType } from './payments/IntentType';

export interface ConfirmAndSubscribeResponse {
  clientSecret: string;
  status: IntentStatus;
  type: IntentType;
}
