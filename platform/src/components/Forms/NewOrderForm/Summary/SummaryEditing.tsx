import React from 'react';
import { useTranslation } from 'react-i18next';

import { ImportantSpacedWrapper, SpacedRowWrapper } from 'components/Forms/styles';
import { FormSectionHeader } from 'components/FormSectionHeader';
import { TextSummary } from 'components/TextSummary';

interface Props {
  editingOption: string;
}

export const SummaryEditing: React.FC<Props> = ({ editingOption }) => {
  const { t } = useTranslation();

  return (
    <>
      <ImportantSpacedWrapper>
        <FormSectionHeader iconName="create" label={t('forms.newOrder.summary.editing')} />
      </ImportantSpacedWrapper>
      <SpacedRowWrapper>
        <TextSummary label={t('forms.newOrder.summary.editing')} value={editingOption} />
      </SpacedRowWrapper>
    </>
  );
};
