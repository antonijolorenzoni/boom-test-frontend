import React from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion } from 'ui-boom-components';
import { FormSectionHeader } from 'components/FormSectionHeader';
import { SpacedWrapper, Background } from '../styles';
import { NotesSection } from 'components/FormSection/NotesSection';

export const NotesSectionWrapper: React.FC = () => {
  const { t } = useTranslation();

  return (
    <SpacedWrapper>
      <Accordion titleComponent={<FormSectionHeader iconName="description" label={t('forms.newOrder.notes')} />} color="#696767">
        <Background>
          <NotesSection />
        </Background>
      </Accordion>
    </SpacedWrapper>
  );
};
