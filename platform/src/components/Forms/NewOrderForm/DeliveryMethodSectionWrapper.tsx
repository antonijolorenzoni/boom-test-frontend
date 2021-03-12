import React from 'react';
import { useFormikContext } from 'formik';
import { Typography, Accordion } from 'ui-boom-components';
import { useTranslation } from 'react-i18next';
import { FormSectionHeader } from 'components/FormSectionHeader';
import { SpacedWrapper, Background } from '../styles';
import { NewOrderFields } from '.';
import { DeliveryMethodSection } from 'components/FormSection/DeliveryMethodSection';

interface Props {
  isDriveAuthorized: boolean;
}

export const DeliveryMethodSectionWrapper: React.FC<Props> = ({ isDriveAuthorized }) => {
  const { t } = useTranslation();
  const { values } = useFormikContext<NewOrderFields>();

  const getSelectedDeliveryMethods = (emails: string[], isDriveSelected: boolean) =>
    [
      ...(emails.length ? [t('shootings.deliveryMethodsType.email')] : []),
      ...(isDriveSelected ? [t('shootings.deliveryMethodsType.drive')] : []),
    ].join(', ');

  return (
    <SpacedWrapper>
      <Accordion
        titleComponent={
          <>
            <FormSectionHeader iconName="send" label={t('shootings.deliveryMethods')} />
            <div data-testid="selected-delivery-methods" style={{ margin: 0, right: 40, position: 'relative' }}>
              {getSelectedDeliveryMethods(values?.deliveryMethodsEmails ?? [], values.deliveryMethodsIsDriveSelected)}
            </div>
          </>
        }
        color="#696767"
      >
        <Typography variantName="caption" style={{ marginBottom: 8 }}>
          {t('shootings.deliveryMethodsSubtitle')}
        </Typography>
        <Background>
          <DeliveryMethodSection
            isDriveAuthorized={isDriveAuthorized}
            companyId={values?.company?.value}
            organizationId={values?.organization?.value}
          />
        </Background>
      </Accordion>
    </SpacedWrapper>
  );
};
