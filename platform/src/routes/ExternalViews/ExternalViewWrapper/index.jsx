//
// ──────────────────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: W R A P P E R   C O N T A I N E R   F O R   E X T E R N A L   V I E W S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import { useMediaQuery } from 'react-responsive';
import i18next from 'i18next';
import React from 'react';
import boomLogo from 'assets/brand/logo_bianco.png';
import loginBackground from 'assets/brand/loginBackground_2.jpg';
import { LanguageSelector } from 'components/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { Wrapper, HeaderWrapper, Logo, Image, ContentWrapper, CardContent, CardInnerContent } from './styles';
import { Typography } from 'ui-boom-components';

const ExternalViewWrapper = ({ children, containerStyle }) => {
  const onChangeLanguage = (language) => {
    i18next.changeLanguage(language);
  };

  const isTabletOrMobile = useMediaQuery({ query: 'screen and (max-width: 1080px)' });

  const { t } = useTranslation();

  return (
    <Wrapper>
      <HeaderWrapper>
        <Logo src={boomLogo} alt="boom-logo" />
        <div style={{ display: 'flex', marginRight: 50, alignItems: 'center' }}>
          <LanguageSelector onSelectLanguage={onChangeLanguage} />
          <Typography
            variantName="title3"
            className="circular-black-label"
            style={{ marginLeft: 9, cursor: 'pointer', color: '#ffffff' }}
            onClick={() => window.open('https://boom.co/', '_self')}
          >
            {t('forms.back').toUpperCase()}
          </Typography>
        </div>
      </HeaderWrapper>
      <ContentWrapper style={{ ...containerStyle }}>
        <CardContent>
          <CardInnerContent>{children}</CardInnerContent>
        </CardContent>
        {!isTabletOrMobile && <Image alt="login" src={loginBackground} />}
      </ContentWrapper>
    </Wrapper>
  );
};

export default ExternalViewWrapper;
