import React from 'react';
import { SubscriptionStatus } from 'types/SubscriptionStatus';
import { getNumOfDaysFromToday } from 'utils/date-utils';
import { SubscriptionPriceFreeTrail } from './SubscriptionPriceFreeTrial';

import { Li, Box, PointedList } from '../styles';
import { OutlinedButton, Typography } from 'ui-boom-components';
import { useTranslation } from 'react-i18next';
import { SubscriptionPriceNoTrail } from './SubscriptionPriceNoTrail';

interface Props {
  onUnsubscribe?: () => void;
  subscriptionStatus?: SubscriptionStatus;
  currency?: string;
  PriceComponent?: React.FC<{ currency?: string }>;
  subscriptionEndDate?: string;
}

export const ActiveSubscriptionPanel: React.FC<Props> = ({
  onUnsubscribe,
  subscriptionStatus,
  currency,
  PriceComponent,
  subscriptionEndDate,
}) => {
  const { t } = useTranslation();

  const subscriptionRemainingDays = getNumOfDaysFromToday(subscriptionEndDate || '');

  const isUnsubscribeActive = SubscriptionStatus.UNSUBSCRIBED_ACTIVE === subscriptionStatus;
  const isTrailing = SubscriptionStatus.TRIALING === subscriptionStatus;

  const showPriceSection =
    !subscriptionStatus ||
    [
      SubscriptionStatus.ACTIVE,
      SubscriptionStatus.TRIALING,
      SubscriptionStatus.UNSUBSCRIBED_ACTIVE,
      SubscriptionStatus.PAYMENT_FAILED,
    ].includes(subscriptionStatus);

  const showUnsubscribeButton = [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING, SubscriptionStatus.PAYMENT_FAILED].some(
    (subStatus) => subStatus === subscriptionStatus
  );

  if (!PriceComponent) {
    PriceComponent = isTrailing ? SubscriptionPriceFreeTrail : SubscriptionPriceNoTrail;
  }

  return (
    <Box>
      {showPriceSection && <PriceComponent currency={currency} />}
      <PointedList>
        <ul style={{ margin: 0 }}>
          {[
            t('smb.customerSupportResponse'),
            t('smb.editingAndGuidelines'),
            t('smb.orderTracking'),
            t('smb.photoDelivery'),
            t('smb.oneUserOnly'),
          ].map((value, i) => (
            <Li key={i}>
              <Typography variantName="caption" textColor="#000000">
                {value}
              </Typography>
            </Li>
          ))}
        </ul>
      </PointedList>
      <div style={{ flex: 0.25, padding: '10px 20px 10px 10px', marginTop: 5 }}>
        <Typography variantName="caption2">{t('smb.freeCancellationRescheduling')}</Typography>
      </div>
      {showUnsubscribeButton && onUnsubscribe && (
        <div style={{ display: 'flex', alignItems: 'center', padding: 40 }}>
          <OutlinedButton size="small" onClick={onUnsubscribe} style={{ textTransform: 'uppercase' }}>
            {t('smb.unsubscribe')}
          </OutlinedButton>
        </div>
      )}
      {isUnsubscribeActive && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 0.25, padding: '10px 20px 10px 10px', marginTop: 5 }}>
          <Typography variantName="caption" textColor="#D84315">
            {t('smb.subscriptionHasBeenCancelled')}
          </Typography>
          <Typography variantName="caption" textColor="#D84315">
            {t('smb.subscriptionWillExpireIn', { remainingDays: subscriptionRemainingDays })}
          </Typography>
        </div>
      )}
    </Box>
  );
};
