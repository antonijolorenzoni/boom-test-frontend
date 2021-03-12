import { CreditCardInfo } from 'components/CreditCardInfo';
import { FormSectionHeader } from 'components/FormSectionHeader';
import { usePaymentMethod } from 'hook/usePaymentMethod';
import { useSmbProfile } from 'hook/useSmbProfile';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from 'ui-boom-components/lib';
import { ImportantSpacedWrapper } from '../styles';

export const MyCreditCardSection: React.FC = () => {
  const { t } = useTranslation();
  const { smbProfile } = useSmbProfile(true);
  const { paymentMethod } = usePaymentMethod(true, smbProfile?.companyId);

  return paymentMethod ? (
    <>
      <ImportantSpacedWrapper>
        <FormSectionHeader iconName="credit_card" label={t('forms.newOrder.paymentMethod')} />
        <Typography variantName="caption" style={{ marginBottom: 8 }}>
          {t('forms.newOrder.paymentMethodDisclaimer')}
        </Typography>
      </ImportantSpacedWrapper>
      <CreditCardInfo {...paymentMethod} />
    </>
  ) : null;
};
