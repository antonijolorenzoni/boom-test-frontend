import React from 'react';
import { useTranslation } from 'react-i18next';

import { ImportantSpacedWrapper, SpacedRowWrapper } from 'components/Forms/styles';
import { FormSectionHeader } from 'components/FormSectionHeader';
import { TextSummary } from 'components/TextSummary';

interface Props {
  contactName: string;
  contactPhoneNumber: string;
  additionalContactPhoneNumber?: string;
  contactEmail: string;
  fullAddress: string;
  businessName: string;
  businessNameLabelKey?: string;
}

export const SummaryContactAndAddress: React.FC<Props> = ({
  contactName,
  contactPhoneNumber,
  additionalContactPhoneNumber,
  contactEmail,
  fullAddress,
  businessName,
  businessNameLabelKey = 'forms.newOrder.summary.businessName',
}) => {
  const { t } = useTranslation();

  return (
    <>
      <ImportantSpacedWrapper>
        <FormSectionHeader iconName="person_pin" label={t('forms.newOrder.summary.contact')} />
      </ImportantSpacedWrapper>
      <SpacedRowWrapper>
        <TextSummary label={t('forms.newOrder.summary.contactName')} value={contactName} />
        <TextSummary label={t('forms.newOrder.summary.contactPhone')} value={contactPhoneNumber} />
      </SpacedRowWrapper>
      <SpacedRowWrapper>
        <TextSummary label={t('forms.newOrder.summary.contactEmail')} value={contactEmail} />
        { additionalContactPhoneNumber && <TextSummary label={t('forms.newOrder.summary.additionalContactPhone')} value={additionalContactPhoneNumber} />}
      </SpacedRowWrapper>
      <ImportantSpacedWrapper>
        <FormSectionHeader iconName="location_on" label={t('forms.newOrder.summary.address')} />
      </ImportantSpacedWrapper>
      <SpacedRowWrapper>
        <TextSummary label={t('forms.newOrder.summary.fullAddress')} value={fullAddress} fullWidth={true} />
      </SpacedRowWrapper>
      <SpacedRowWrapper>
        <TextSummary label={t(businessNameLabelKey)} value={businessName} />
      </SpacedRowWrapper>
    </>
  );
};
