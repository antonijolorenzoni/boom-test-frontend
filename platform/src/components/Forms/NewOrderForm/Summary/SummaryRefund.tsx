import React from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from 'ui-boom-components/lib';
import { ImportantSpacedWrapper } from 'components/Forms/styles';
import { FormSectionHeader } from 'components/FormSectionHeader';
import { TextSummary } from 'components/TextSummary';

interface Props {
  currency: string;
  orderRefund: number;
}

export const SummaryRefund: React.FC<Props> = ({ currency, orderRefund }) => {
  const { t } = useTranslation();

  return (
    <>
      <ImportantSpacedWrapper>
        <FormSectionHeader iconName="monetization_on" label={t('forms.newOrder.summary.refundNote')} />
      </ImportantSpacedWrapper>
      <Typography variantName="caption" style={{ marginBottom: 10 }}>
        {t('forms.newOrder.summary.refundNote')}
      </Typography>
      <TextSummary label={`${t('forms.newOrder.summary.refundValue')} ${currency}`} value={orderRefund} />
    </>
  );
};
