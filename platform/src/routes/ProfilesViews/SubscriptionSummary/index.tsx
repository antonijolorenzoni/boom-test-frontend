import React from 'react';
import { useTranslation } from 'react-i18next';

import { SpacedRowWrapper } from 'components/Forms/styles';
import SmbSubscriptionCard from 'components/SmbSubscriptionCard';
import { TextSummary } from 'components/TextSummary';
import { useScreen } from 'hook/useScreen';
import { Typography } from 'ui-boom-components/lib';
import { ColumnBreak } from '../ColumnBreak';
import { MAIL } from 'config/consts';
import { Nullable } from '../utils';
import { Currency } from 'types/Currency';
import { SubscriptionResponse } from 'types/SubscriptionResponse';
import { SubscriptionStatus } from 'types/SubscriptionStatus';
import { primary, secondary } from 'utils/colors';

interface Props {
  organizationName: string;
  currency: Currency;
  subscription: SubscriptionResponse;
  onSubscribe?: () => void;
}

const SubscriptionSummary: React.FC<Props> = ({ organizationName, currency, subscription, onSubscribe }) => {
  const { isMobile } = useScreen();
  const { t } = useTranslation();

  const isSubscribed = [SubscriptionStatus.TRIALING, SubscriptionStatus.ACTIVE, SubscriptionStatus.PAYMENT_FAILED].some(
    (s) => s === subscription?.subscriptionStatus
  );

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', flexBasis: 0 }}>
        <SpacedRowWrapper>
          <TextSummary fullWidth={true} label={t('profile.organizationName')} value={organizationName} />
        </SpacedRowWrapper>
        <div style={{ padding: '30px 0px', alignSelf: 'center' }}>
          <SmbSubscriptionCard
            currency={currency}
            status={subscription?.subscriptionStatus}
            subscriptionEndDate={subscription?.currentPeriodEnd}
            freeTrailRemainingDays={subscription?.remainingTrialDays}
            onSubscribe={onSubscribe}
          />
        </div>
        {isSubscribed && (
          <div style={{ wordBreak: 'break-word' }}>
            <Typography variantName="caption2" style={{ color: 'black' }}>
              {t('subscription.unsubscribeInvoice')}
            </Typography>
            <a href={`mailto:${MAIL.SALES}`} style={{ color: primary }}>
              <Typography variantName="caption2" style={{ color: primary, marginBottom: 8 }}>
                {t('subscription.unsubscribeContact')}
              </Typography>
            </a>
            <Typography variantName="caption2" style={{ color: secondary }}>
              {t('subscription.unsubscribeDisclaimer')}
            </Typography>
          </div>
        )}
      </div>
      {!isMobile && (
        <div style={{ padding: '0px 30px' }}>
          <ColumnBreak />
        </div>
      )}
    </>
  );
};

export default Nullable(SubscriptionSummary);
