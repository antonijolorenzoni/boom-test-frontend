import { FormSectionHeader } from 'components/FormSectionHeader';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PricingPackage } from 'types/PricingPackage';
import { PackageRow } from './PackageRow';

interface Props {
  pricingPackages: Array<PricingPackage>;
  onSelectPP: (pricingPackage: PricingPackage) => void;
}

export const PackageSection: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  return (
    <>
      <FormSectionHeader iconName="person_pin" label={t('forms.newOrder.pricingPackage')} />
      <PackageRow {...props} />
    </>
  );
};
