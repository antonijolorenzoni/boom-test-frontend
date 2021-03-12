import React from 'react';
import moment from 'moment';

import { SubscriptionStatus } from 'types/SubscriptionStatus';
import { Typography } from 'ui-boom-components';
import { useTranslation } from 'react-i18next';

interface Props {
  subscriptionEndDate?: string;
  status: SubscriptionStatus;
}
export const NoActiveSubscriptionPanel: React.FC<Props> = ({ subscriptionEndDate, status }) => {
  const { t } = useTranslation();

  const isUnsubscribedGrace = SubscriptionStatus.UNSUBSCRIBED_GRACE === status;
  const isUnsubscribed = [SubscriptionStatus.UNSUBSCRIBED, SubscriptionStatus.UNSUBSCRIBED_GRACE].includes(status);

  return (
    <div>
      <Typography variantName="overline" style={{ textTransform: 'uppercase' }}>
        {t('smb.noActiveSubscription')}
      </Typography>
      {isUnsubscribed && (
        <Typography variantName="body2" textColor="#A3ABB1">
          {t('smb.unsubscribedAt', { at: moment(subscriptionEndDate).format('MMMM DD YYYY') })}
        </Typography>
      )}
      {isUnsubscribedGrace && (
        <Typography variantName="overline" textColor="#000000" style={{ marginTop: 8, textTransform: 'uppercase' }}>
          {t('smb.clientInGracePeriod')}
        </Typography>
      )}
    </div>
  );
};
