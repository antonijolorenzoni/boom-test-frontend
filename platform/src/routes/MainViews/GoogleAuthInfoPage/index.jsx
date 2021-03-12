import React from 'react';

import { Typography } from 'ui-boom-components';
import { Trans, useTranslation } from 'react-i18next';
import { Wrapper, Link, Hr } from './styles';

const boomLogo = require('../../../assets/brand/logo_black.png');

const GoogleAuthInfoPage = () => {
  const { t } = useTranslation();
  const backToCompanyUrl = localStorage.getItem('backToCompanyUrl');

  return (
    <Wrapper>
      <img src={boomLogo} alt="logo" style={{ width: 110, marginBottom: 95 }} />
      <Typography variantName="title2" style={{ textAlign: 'center' }}>
        {t('company.authInfoLanding.title')}
      </Typography>
      <Typography variantName="overline" style={{ marginTop: 20, textTransform: 'uppercase', maxWidth: '70ch', textAlign: 'center' }}>
        <Trans i18nKey="company.authInfoLanding.subtitle">
          Don’t worry, the system won’t edit or access folders other than the one we will create for you inside your Drive. For more
          details, check our{' '}
          <a href="https://boom.co/privacy-policy/" target="_blank" rel="noopener noreferrer" style={{ color: '#5ac0b1' }}>
            privacy policy
          </a>
          .
        </Trans>
      </Typography>
      <Hr />
      <Typography variantName="body1" textColor="#5ac0b1" style={{ textTransform: 'uppercase' }}>
        <Link to={backToCompanyUrl || '/'}>{t('company.authInfoLanding.backToCompanyPage')}</Link>
      </Typography>
    </Wrapper>
  );
};

export { GoogleAuthInfoPage };
