import React, { useState } from 'react';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { Accordion } from 'ui-boom-components';

import { FormSectionHeader } from 'components/FormSectionHeader';
import { SpacedWrapper, Background } from '../styles';
import { NewOrderFields } from '.';
import { EditingSection } from 'components/FormSection/EditingSection';

export const EditingSectionWrapper: React.FC = () => {
  const { t } = useTranslation();
  const { values } = useFormikContext<NewOrderFields>();

  const [isClose, setClose] = useState(true);

  const isPricingPackageSelected = !!values?.pricingPackage?.editingOption;
  const canChangeEditingOption = !!values?.pricingPackage?.canChangeEditingOption;

  return (
    <SpacedWrapper>
      <Accordion
        titleComponent={
          <>
            <FormSectionHeader iconName="create" label={t('forms.newOrder.editing')} />
            <div style={{ margin: 0, right: 40, position: 'relative' }}>{isClose && values.editingOption}</div>
          </>
        }
        color="#696767"
        disabled={!isPricingPackageSelected}
        onToggle={() => setClose(!isClose)}
      >
        <Background>
          <EditingSection canChangeEditingOption={canChangeEditingOption} isPricingPackageSelected={isPricingPackageSelected} />
        </Background>
      </Accordion>
    </SpacedWrapper>
  );
};
