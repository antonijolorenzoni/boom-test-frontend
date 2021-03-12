import React from 'react';
import { useTranslation } from 'react-i18next';

import { ImportantSpacedWrapper, SpacedRowWrapper } from 'components/Forms/styles';
import { FormSectionHeader } from 'components/FormSectionHeader';
import { TextSummary } from 'components/TextSummary';

import { PLACE_HOLDER } from 'config/consts';
import { PricingPackage } from 'types/PricingPackage';
import { packageToOption as pricingPackageToOption } from 'utils/pricing-package-utils';

interface Props {
  organization: string;
  company: string;
  pricingPackage: PricingPackage | null;
}

export const SummaryCompanyAndPackage: React.FC<Props> = ({ organization, company, pricingPackage }) => {
  const { t } = useTranslation();

  const packageToOption = pricingPackageToOption(t('organization.photos'));

  return (
    <>
      <ImportantSpacedWrapper>
        <FormSectionHeader iconName="domain" label={t('forms.newOrder.summary.shootingCompanyData')} />
      </ImportantSpacedWrapper>
      <SpacedRowWrapper>
        <TextSummary label={t('forms.newOrder.summary.organizationName')} value={organization} />
        <TextSummary label={t('forms.newOrder.summary.companyName')} value={company} />
      </SpacedRowWrapper>
      <SpacedRowWrapper>
        <TextSummary
          label={t('forms.newOrder.summary.pricingPackage')}
          value={packageToOption(pricingPackage)?.label ?? PLACE_HOLDER}
          fullWidth={true}
        />
      </SpacedRowWrapper>
    </>
  );
};
