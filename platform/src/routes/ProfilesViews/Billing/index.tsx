import React from 'react';
import { FormSectionHeader } from 'components/FormSectionHeader';
import { useTranslation } from 'react-i18next';
import { ImportantSpacedWrapper, SpacedRowWrapper } from 'components/Forms/styles';
import i18Countries from 'i18n-iso-countries';
import { TextSummary } from 'components/TextSummary';
import { Nullable } from '../utils';
import { useWhoAmI } from 'hook/useWhoAmI';

interface Props {
  address: string;
  city: string;
  corporateName: string;
  country: string;
  sdiCode: string;
  vatNumber: string;
  zipCode: string;
  vatRate: string;
}

const Billing = ({ address, city, corporateName, country, sdiCode, vatNumber, zipCode, vatRate }: Props) => {
  const { t, i18n } = useTranslation();
  const { isBoom } = useWhoAmI();
  return (
    <>
      <ImportantSpacedWrapper>
        <FormSectionHeader iconName="location_on" label={t('profile.billingInfo')} />
      </ImportantSpacedWrapper>
      <SpacedRowWrapper>
        <TextSummary label={t('profile.corporateName')} value={corporateName} />
        <TextSummary label={t('profile.vat')} value={vatNumber} />
      </SpacedRowWrapper>
      <SpacedRowWrapper>
        <TextSummary label={t('profile.country')} value={i18Countries.getName(country!, i18n.language)} />
        {isBoom && <TextSummary label={t('profile.vatRate')} value={vatRate} />}
      </SpacedRowWrapper>
      <SpacedRowWrapper>
        <TextSummary label={t('profile.address')} value={address} />
        <div style={{ display: 'flex', width: '48%' }}>
          <TextSummary label={t('profile.city')} value={city} />
          <TextSummary label={t('profile.zipCode')} value={zipCode} />
        </div>
      </SpacedRowWrapper>
      {!!sdiCode && (
        <SpacedRowWrapper>
          <TextSummary label={t('profile.sdi')} value={sdiCode} />
        </SpacedRowWrapper>
      )}
    </>
  );
};

export default Nullable(Billing);
