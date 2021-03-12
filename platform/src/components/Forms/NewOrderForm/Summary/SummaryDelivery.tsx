import React from 'react';
import { useTranslation } from 'react-i18next';

import { ImportantSpacedWrapper, SpacedRowWrapper, SpacedWrapper } from 'components/Forms/styles';
import { FormSectionHeader } from 'components/FormSectionHeader';
import { GoogleDriveSelector } from 'components/GoogleDriveSelector';
import { TextSummary } from 'components/TextSummary';
import { Typography } from 'ui-boom-components/lib';

interface Props {
  deliveryMethodsEmails: string;
  deliveryMethodsIsDriveSelected: boolean;
  driveFolderName?: string | null;
  company: any;
}

export const SummaryDelivery: React.FC<Props> = ({ deliveryMethodsEmails, deliveryMethodsIsDriveSelected, driveFolderName, company }) => {
  const { t } = useTranslation();

  return (
    <>
      <ImportantSpacedWrapper>
        <FormSectionHeader iconName="send" label={t('forms.newOrder.summary.deliveryMethods')} />
      </ImportantSpacedWrapper>
      <Typography variantName="caption" style={{ marginBottom: 10 }}>
        {t('forms.newOrder.summary.deliveryMethodsSubtitle')}
      </Typography>
      <SpacedRowWrapper>
        <TextSummary label={t('forms.newOrder.summary.email')} value={deliveryMethodsEmails} fullWidth={true} />
      </SpacedRowWrapper>
      {deliveryMethodsIsDriveSelected ? (
        <SpacedRowWrapper>
          <SpacedWrapper>
            <Typography variantName="overline" style={{ textTransform: 'uppercase' }}>
              {t('forms.newOrder.summary.driveFolder')}
            </Typography>
            <SpacedWrapper>
              <GoogleDriveSelector customFolderInfo={{ name: driveFolderName }} company={company} />
            </SpacedWrapper>
          </SpacedWrapper>
        </SpacedRowWrapper>
      ) : (
        <SpacedRowWrapper>
          <TextSummary
            label={t('forms.newOrder.summary.driveFolder')}
            value={t('forms.newOrder.summary.notConnected') as string}
            fullWidth={true}
          />
        </SpacedRowWrapper>
      )}
    </>
  );
};
