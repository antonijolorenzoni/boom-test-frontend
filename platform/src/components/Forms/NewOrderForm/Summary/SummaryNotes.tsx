import React from 'react';
import { useTranslation } from 'react-i18next';

import { ImportantSpacedWrapper, SpacedRowWrapper } from 'components/Forms/styles';
import { FormSectionHeader } from 'components/FormSectionHeader';
import { TextSummary } from 'components/TextSummary';

interface Props {
  description: string;
  logisticInformation: string;
}

export const SummaryNotes: React.FC<Props> = ({ description, logisticInformation }) => {
  const { t } = useTranslation();

  return (
    <>
      <ImportantSpacedWrapper>
        <FormSectionHeader iconName="description" label={t('forms.newOrder.summary.notes')} />
      </ImportantSpacedWrapper>
      <SpacedRowWrapper>
        <TextSummary label={t('forms.newOrder.summary.info')} value={description} fullWidth={true} />
      </SpacedRowWrapper>
      <SpacedRowWrapper>
        <TextSummary label={t('forms.newOrder.summary.logistics')} value={logisticInformation} fullWidth={true} />
      </SpacedRowWrapper>
    </>
  );
};
