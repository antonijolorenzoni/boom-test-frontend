import React from 'react';
import styled from 'styled-components';
import { Trans, useTranslation } from 'react-i18next';
import { Typography } from 'ui-boom-components';
import { useMediaQuery } from 'react-responsive';

const boomLogo = require('assets/brand/logo_black.png');

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  z-index: 1000;
  box-sizing: border-box;

  & > :first-child {
    display: flex;
    height: 100%;
    width: 43%;
    flex-direction: column;
    justify-content: center;

    @media screen and (max-width: 576px) {
      width: 70%;
    }
  }
`;

interface Props {
  onBackToForm: () => void;
}

export const SmbCancelInfoLandingPanel: React.FC<Props> = ({ onBackToForm }) => {
  const { t } = useTranslation();
  const isSmallMobile = useMediaQuery({ query: `screen and (max-height: 750px)` });

  return (
    <Wrapper data-testid="smb-cancel-landing">
      <div>
        <img src={boomLogo} alt="logo" style={{ alignSelf: 'center', width: 110 }} />
        <Typography variantName="title1" style={{ paddingTop: isSmallMobile ? 20 : 100 }}>
          {t('smb.cancelLanding.title')}
        </Typography>
        <div style={{ paddingTop: 15 }}>
          <Typography variantName="title2" textColor="#A3ABB1">
            {t('smb.cancelLanding.subtitle')}
          </Typography>
          <Typography variantName="title2" style={{ paddingTop: 25 }}>
            <Trans
              i18nKey={t('smb.cancelLanding.backToForm')}
              components={[
                <span
                  style={{ color: '#5AC0B1', cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => {
                    onBackToForm();
                    window.scrollTo({ top: 0 });
                  }}
                />,
              ]}
            />
          </Typography>
        </div>
      </div>
    </Wrapper>
  );
};
