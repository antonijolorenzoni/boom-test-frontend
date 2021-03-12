import React from 'react';

import { Wrapper, Instruction, SubInstruction, EmailTemplate, Title, P, Link, Signature } from './styles';
import translations from '../../../translations/i18next';

const DeliveryEmailInfoDialogBody = () => (
  <Wrapper>
    <Instruction>{translations.t('shootings.deliveryMethodEmailInstruction')}</Instruction>
    <SubInstruction>{translations.t('shootings.deliveryMethodEmailSubInstruction')}</SubInstruction>
    <EmailTemplate>
      <div>
        <Title>
          {translations.t('shootings.deliveryEmailTemplate.title')}
          <span role="img" aria-label="tada">
            🎉
          </span>
        </Title>
      </div>
      <div>
        <P withMargin>{translations.t('shootings.deliveryEmailTemplate.hello')}</P>
        <P>
          {translations.t('shootings.deliveryEmailTemplate.photosReady')}
          <Link>{translations.t('shootings.deliveryEmailTemplate.here')}</Link>.
        </P>
        <P>
          {translations.t('shootings.deliveryEmailTemplate.contacts1')} <Link>support@boom.co</Link>
          {translations.t('shootings.deliveryEmailTemplate.contacts2')}
          <span role="img" aria-label="smile">
            🙂
          </span>
        </P>
        <P>
          {translations.t('shootings.deliveryEmailTemplate.enjoy')}
          <span role="img" aria-label="enjoy">
            ✌️
          </span>
        </P>
        <Signature>Team BOOM</Signature>
      </div>
    </EmailTemplate>
  </Wrapper>
);

export { DeliveryEmailInfoDialogBody };
