import React from 'react';

import { SubscriptionStatus } from 'types/SubscriptionStatus';
import { NoActiveSubscriptionPanel } from './NoActiveSubscriptionPanel';
import { ActiveSubscriptionPanel } from './ActiveSubscriptionPanel';
import { useTranslation } from 'react-i18next';
import { ErrorMessageBlock } from 'components/MessageBlocks/ErrorMessageBlock';

interface Props {
  onUnsubscribe?: () => void;
  subscriptionStatus?: SubscriptionStatus;
  currency?: string;
  PriceComponent?: React.FC;
  subscriptionEndDate?: string;
}

export const SubscriptionInfoPanel: React.FC<Props> = ({
  onUnsubscribe,
  subscriptionStatus,
  currency,
  PriceComponent,
  subscriptionEndDate,
}) => {
  const { t } = useTranslation();
  const noActiveSubscription = [SubscriptionStatus.SUBSCRIBED, SubscriptionStatus.UNSUBSCRIBED, SubscriptionStatus.UNSUBSCRIBED_GRACE].some(
    (status) => status === subscriptionStatus
  );

  return (
    <div data-testid="subscription-info-panel">
      {SubscriptionStatus.PAYMENT_FAILED === subscriptionStatus && (
        <div style={{ width: 970, marginBottom: 16 }}>
          <ErrorMessageBlock title={t('smb.creditCardHasBeenRefused')} subtitle={t('smb.wasNotPossibleToChargeSubscription')} />
        </div>
      )}
      {noActiveSubscription ? (
        <NoActiveSubscriptionPanel status={subscriptionStatus!} subscriptionEndDate={subscriptionEndDate} />
      ) : (
        <ActiveSubscriptionPanel
          onUnsubscribe={onUnsubscribe}
          subscriptionStatus={subscriptionStatus}
          currency={currency}
          PriceComponent={PriceComponent}
          subscriptionEndDate={subscriptionEndDate}
        />
      )}
    </div>
  );
};
