import React from 'react';
import { Company } from 'types/Company';
import { useTranslation } from 'react-i18next';
import { RowWrapper } from 'components/Forms/styles';
import { TextSummary } from 'components/TextSummary';
import { Chip, Typography } from 'ui-boom-components';
import { ChipWrapper } from './styles';
import { Badge } from 'components/Badge';
import { Tier } from 'types/Tier';
import { NOT_AVAILABLE } from 'config/consts';
import { useSelector } from 'react-redux';
import { featureFlag } from 'config/featureFlags';
import { Segment } from 'types/Segment';

interface Props {
  company: Company;
  deliverToMainContact: boolean;
}

export const Details: React.FC<Props> = ({ company, deliverToMainContact }) => {
  const { t } = useTranslation();
  const { selectedOrganization } = useSelector((state: any) => ({
    selectedOrganization: state.organizations.selectedOrganization,
  }));

  const isB1Enabled = featureFlag.isFeatureEnabled('b1-new-company-structure');

  const { name, photoTypes, language, phoneNumber, logo, tier } = company;

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        {logo && <img src={logo} style={{ height: 50, borderRadius: 10, marginRight: 20 }} alt="company_logo" />}
        <Typography variantName="title2" style={{ marginRight: 45 }}>
          {name}
        </Typography>
        {(isB1Enabled ? tier === Tier.SMB : Segment.SMB === selectedOrganization.segment) && <Badge color="#A3ABB1" text="SMB" />}
      </div>
      {(phoneNumber || language) && (
        <RowWrapper>
          {phoneNumber && <TextSummary fullWidth={false} label={t('company.phoneNumber')} value={phoneNumber} />}
          {language && <TextSummary fullWidth={false} label={t('company.language')} value={language} />}
        </RowWrapper>
      )}
      {photoTypes && photoTypes.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variantName="overline" style={{ textTransform: 'uppercase' }}>
            {t(`company.photoTypes`)}
          </Typography>
          <ChipWrapper style={{ display: 'flex', margin: '8px 0' }}>
            {photoTypes.map((photoType) => (
              <Chip key={photoType.type} name={t(`photoTypes.${photoType.type}`)} />
            ))}
          </ChipWrapper>
        </div>
      )}
      {Tier.ENTERPRISE === company.tier && (
        <RowWrapper style={{ marginTop: 24 }}>
          <TextSummary
            fullWidth={false}
            label={t('forms.deliveryPreferences.title')}
            value={deliverToMainContact ? (t(`forms.deliveryPreferences.checkboxLabel`) as string) : NOT_AVAILABLE}
          />
        </RowWrapper>
      )}
    </>
  );
};
