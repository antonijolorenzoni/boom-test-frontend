import React from 'react';
import { useTranslation } from 'react-i18next';

import { SpacedRowWrapper } from 'components/Forms/styles';
import { TextSummary } from 'components/TextSummary';

interface Props {
  orderName: string;
}

export const SummaryHeader: React.FC<Props> = ({ orderName }) => {
  const { t } = useTranslation();

  return (
    <SpacedRowWrapper>
      <TextSummary label={t('forms.newOrder.summary.orderName')} value={orderName} />
    </SpacedRowWrapper>
  );
};
