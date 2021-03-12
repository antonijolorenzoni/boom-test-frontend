import { SMB_SUBSCRIPTIONS_PRICE } from 'config/consts';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from 'ui-boom-components';

export const SubscriptionPriceFreeTrail: React.FC<{ currency?: string }> = ({ currency }) => {
  const { t } = useTranslation();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 0.25, padding: '10px 10px 10px 20px' }}>
      <Typography variantName="title2" textColor="#5AC0B1" style={{ marginBottom: 4 }}>
        {t('smb.free30DaysTrial')}
      </Typography>
      <Typography variantName="caption" textColor="#000000" style={{ marginBottom: 2 }}>
        {t('smb.thanYouWillPay')}
      </Typography>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Typography variantName="kpi1" style={{ marginRight: 6 }}>{`${SMB_SUBSCRIPTIONS_PRICE.MONTHLY}${currency}`}</Typography>
        <Typography variantName="overline" textColor="#000000" style={{ textTransform: 'uppercase' }}>
          {t('smb.monthly')}
        </Typography>
      </div>
      <Typography variantName="caption2" textColor="#000000">
        {t('forms.newOrder.vatIncluded')}
      </Typography>
    </div>
  );
};
