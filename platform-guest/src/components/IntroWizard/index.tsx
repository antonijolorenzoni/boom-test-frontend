import React, { useState, useCallback } from 'react';
import { useMediaQuery } from 'react-responsive';
import { range } from 'lodash';
import { useHistory } from 'react-router-dom';
import { OutlinedButton, Typography } from 'ui-boom-components';
import { useTranslation, Trans } from 'react-i18next';
import { Wrapper, IndicatorWrapper, Indicator, StepWrapper, LogoWrapper } from './styles';
import { OrderType } from 'types/OrderType';

import LogoBlack from 'assets/images/logo_black.png';
import { Path } from 'types/Path';
import { MediaQueryBreakpoint } from 'types/MediaQueryBreakpoint';
import { SelectedLanguageFlag } from 'components/SelectedLanguageFlag';

const step_counter = 5;

const getContents = (photoType: OrderType, companyName: string, isSmallMobile: boolean, isDesktop: boolean) => {
  let marginBottom = 50;

  if (isSmallMobile) {
    marginBottom = 10;
  } else if (isDesktop) {
    marginBottom = 80;
  }

  return range(step_counter).map((i: number) => (
    <StepWrapper key={i}>
      <Typography textColor="#ffffff" variantName="title1" style={{ marginBottom, textTransform: 'uppercase' }}>
        <Trans i18nKey={`welcomeWizard.${photoType}.${i + 1}.title`} components={{ strong: <strong /> }} values={{ companyName }} />
      </Typography>
      <Typography textColor="#ffffff" variantName="kpi1">
        <Trans i18nKey={`welcomeWizard.${photoType}.${i + 1}.content`} components={{ strong: <strong /> }} values={{ companyName }} />
      </Typography>
    </StepWrapper>
  ));
};

const IntroWizard: React.FC<{ orderType: OrderType; companyName: string }> = ({ orderType: photoType, companyName }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const isDesktop = useMediaQuery({ query: `screen and (min-width: ${MediaQueryBreakpoint.Desktop}px)` });
  const isSmallMobile = useMediaQuery({ query: `screen and (max-height: 750px)` });

  const [activePanel, setActivePanel] = useState<number>(0);
  const memoizedGetContents = useCallback(() => getContents(photoType, companyName, isSmallMobile, isDesktop), [
    photoType,
    companyName,
    isSmallMobile,
    isDesktop,
  ]);
  const contents = memoizedGetContents();

  return (
    <Wrapper>
      <LogoWrapper>
        <img height="47" src={LogoBlack} alt="Boom Logo" />
        <SelectedLanguageFlag />
      </LogoWrapper>
      {contents[activePanel]}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <IndicatorWrapper data-testid="indicator-wrapper">
          {range(contents.length).map((i) => (
            <Indicator key={i} active={i === activePanel} onClick={() => setActivePanel(i)} />
          ))}
        </IndicatorWrapper>
        <OutlinedButton
          color="#ffffff"
          backgroundColor="transparent"
          style={{ width: 93 }}
          onClick={() => {
            if (activePanel < contents.length - 1) {
              setActivePanel(activePanel + 1);
            } else {
              localStorage.setItem('wizard_completed', 'true');
              history.push(Path.HomePage);
            }
          }}
        >
          {t('general.next')}
        </OutlinedButton>
      </div>
    </Wrapper>
  );
};

export { IntroWizard };
