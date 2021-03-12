import { SMB_SUBSCRIPTIONS_PRICE } from 'config/consts';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from 'ui-boom-components';

export const SubscriptionPriceNoTrail: React.FC<{ currency?: string }> = ({ currency }) => {
  const { t } = useTranslation();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 19, paddingLeft: 35 }}>
      <Typography variantName="kpi" style={{ marginRight: 6 }}>{`${SMB_SUBSCRIPTIONS_PRICE.MONTHLY}${currency}`}</Typography>
      <Typography variantName="overline" textColor="#5AC0B1" style={{ textTransform: 'uppercase' }}>
        {t('smb.monthly')}
      </Typography>
      <Typography variantName="caption2" textColor="#000000">
        {t('forms.newOrder.vatIncluded')}
      </Typography>
    </div>
  );
};
