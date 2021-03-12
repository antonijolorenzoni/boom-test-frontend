import { ConfirmCardPaymentData, ConfirmCardPaymentOptions, SetupIntentResult, PaymentIntentResult, Stripe } from '@stripe/stripe-js';
import { IntentType } from 'types/payments/IntentType';

type Confirmation = (
  clientSecret: string,
  data?: ConfirmCardPaymentData,
  options?: ConfirmCardPaymentOptions
) => Promise<PaymentIntentResult | SetupIntentResult>;

export const handleStripeConfirmation = (stripe: Stripe, type: IntentType, clientSecret: string) => {
  const typeToAction = new Map<IntentType, Confirmation>([
    [IntentType.PaymentIntent, stripe.confirmCardPayment],
    [IntentType.SetupIntent, stripe.confirmCardSetup],
  ]).get(type);

  return typeToAction ? typeToAction(clientSecret) : Promise.reject(new Error(`Unexpected intent type ${type}`));
};
