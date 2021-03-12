import React from 'react';
import boomLogo from 'assets/brand/logo_black.png';
import { Typography } from 'ui-boom-components';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useScreen } from 'hook/useScreen';

interface Props {
  path: string;
}

export const SubscriptionInvitation: React.FC<Props> = ({ path }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { isMobile } = useScreen();

  return (
    <div style={{ display: 'flex', alignItems: 'center', flexFlow: 'column', width: '100%' }}>
      <img alt="boom" src={boomLogo} style={{ width: 70, marginTop: isMobile ? 10 : 145 }} />
      <Typography variantName="title2" style={{ marginTop: 30 }}>
        {t('subscription.expiredTitle')}
      </Typography>
      <Typography variantName="title1" style={{ margin: '5px 0px 0px' }}>
        {t('subscription.subscribeAction')}
      </Typography>
      <Typography
        variantName="title1"
        textColor="#5AC0B1"
        style={{ cursor: 'pointer', textDecoration: 'underline' }}
        onClick={() => {
          history.push(path);
          window.scrollTo({ top: 0 });
        }}
      >
        {t('subscription.subscribeLink')}
      </Typography>
    </div>
  );
};
