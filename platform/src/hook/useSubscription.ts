import useSWR from 'swr';
import { axiosBoomInstance } from 'api/instances/boomInstance';
import { SubscriptionResponse } from 'types/SubscriptionResponse';
import { getSubscription } from 'api/paths/payments';
import { SubscriptionStatus } from 'types/SubscriptionStatus';

export const useSubscription = (condition: boolean, companyId?: number) => {
  const { data, error, mutate } = useSWR<{ data: SubscriptionResponse }>(
    condition && companyId ? getSubscription(companyId) : null,
    axiosBoomInstance.get
  );

  const subscription = data?.data;

  return {
    subscription,
    isSubscribed: SubscriptionStatus.SUBSCRIBED === subscription?.subscriptionStatus,
    isActive: SubscriptionStatus.ACTIVE === subscription?.subscriptionStatus,
    isTrialing: SubscriptionStatus.TRIALING === subscription?.subscriptionStatus,
    isUnsubscribedActive: SubscriptionStatus.UNSUBSCRIBED_ACTIVE === subscription?.subscriptionStatus,
    isUnsubscribed: SubscriptionStatus.UNSUBSCRIBED === subscription?.subscriptionStatus,
    isUnsubscribedGrace: SubscriptionStatus.UNSUBSCRIBED_GRACE === subscription?.subscriptionStatus,
    isPaymentFailed: SubscriptionStatus.PAYMENT_FAILED === subscription?.subscriptionStatus,
    error,
    mutate,
  };
};
