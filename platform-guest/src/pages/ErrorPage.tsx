import React from 'react';
import { Typography } from 'ui-boom-components';
import { useTranslation, Trans } from 'react-i18next';

import { MainLayout } from 'components/MainLayout';

export const ErrorPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ padding: 20 }}>
          <Typography variantName="title2" style={{ textAlign: 'center' }}>
            {t('errorPage.mainTitle').toUpperCase()}
          </Typography>
          <Typography variantName="title2" style={{ textAlign: 'center', marginTop: 15 }}>
            <Trans
              i18nKey="errorPage.subTitle"
              components={{
                'contact-us': (
                  <a href="mailto:support@boom.co" style={{ color: '#5ac0b1' }}>
                    {''}
                  </a>
                ),
              }}
            />
          </Typography>
        </div>
      </div>
    </MainLayout>
  );
};
