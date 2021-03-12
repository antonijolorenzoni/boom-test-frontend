import React, { useState } from 'react';
import useSWR from 'swr';

import { HeaderWrapper, HeaderItemWrapper, HeaderMobileWrapper, MobileMenuWrapper, MenuOverlay, LinkHeader } from './styles';
import LogoBlack from 'assets/images/logo_black.png';
import { Icon, Typography } from 'ui-boom-components/lib';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';
import { MediaQueryBreakpoint } from 'types/MediaQueryBreakpoint';
import { logout } from 'utils/auth';
import { useHistory } from 'react-router-dom';

import { axiosBoomInstance } from 'api/axiosBoomInstance';
import { ApiResponse } from 'types/api-response/ApiResponse';
import { ApiPath } from 'types/ApiPath';
import { Order } from 'types/Order';
import { SelectedLanguageFlag } from 'components/SelectedLanguageFlag';

export const Header: React.FC = () => {
  const { t } = useTranslation();

  const history = useHistory();

  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

  const isMobile: boolean = useMediaQuery({ query: `screen and (max-width: ${MediaQueryBreakpoint.Smartphone}px)` });

  const orderCode = localStorage.getItem('order_code');
  const { data: orderResponse, error } = useSWR<ApiResponse<Order>>(`${ApiPath.Order}/${orderCode}`, axiosBoomInstance.get);

  if (error) {
    return <div>Error...</div>;
  }

  if (!orderResponse) {
    return <div>Loading...</div>;
  }

  const order = orderResponse.data;
  const orderType = order.orderType;

  const logoutCta = () => {
    logout();
    history.replace('');
  };

  const selectedLanguageFlag = (
    <div style={{ height: isMobile ? 26 : 22, marginLeft: isMobile ? 0 : 32, marginRight: isMobile ? 20 : 0 }}>
      <SelectedLanguageFlag />
    </div>
  );

  const menuItems = (
    <>
      <LinkHeader href="https://boom.co/about-us/">
        <HeaderItemWrapper style={{ marginRight: 42 }}>
          <Icon name="camera_alt" className="material-icons-outlined" size={25} style={{ marginRight: 10 }} />
          <Typography variantName="title2" textColor="#ffffff">
            {t('header.aboutUs')}
          </Typography>
        </HeaderItemWrapper>
      </LinkHeader>
      <LinkHeader href={t(`faq.${orderType}`)} data-testid="faq-link">
        <HeaderItemWrapper style={{ marginRight: 42 }}>
          <Icon name="chat_bubble_outline" size={25} style={{ marginRight: 10 }} />
          <Typography variantName="title2" textColor="#ffffff">
            {t('header.faq').toUpperCase()}
          </Typography>
        </HeaderItemWrapper>
      </LinkHeader>
      <HeaderItemWrapper data-testid="wrapper-logout-test-id" onClick={logoutCta}>
        <Icon name="power_settings_new" size={25} style={{ marginRight: 10 }} />
        <Typography variantName="title2" textColor="#ffffff">
          {t('header.logOut')}
        </Typography>
      </HeaderItemWrapper>
    </>
  );

  return isMobile ? (
    <>
      <HeaderMobileWrapper>
        <img height="30" src={LogoBlack} alt="Boom Logo" />
        <div style={{ display: 'flex' }}>
          {selectedLanguageFlag}
          <Icon
            name={showMobileMenu ? 'close' : 'menu'}
            size={26}
            style={{ cursor: 'pointer' }}
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          />
        </div>
      </HeaderMobileWrapper>
      <MobileMenuWrapper isVisible={showMobileMenu}>{menuItems}</MobileMenuWrapper>
      <MenuOverlay isVisible={showMobileMenu} />
    </>
  ) : (
    <HeaderWrapper>
      <img height="47" src={LogoBlack} alt="Boom Logo" />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {menuItems}
        {selectedLanguageFlag}
      </div>
    </HeaderWrapper>
  );
};
