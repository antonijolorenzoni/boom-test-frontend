import React from 'react';
import { Typography, Chip } from 'ui-boom-components';
import { useTranslation } from 'react-i18next';

import { getDurationInfoString } from 'utils/timeHelpers';
import { Wrapper, GridTwoCol, Column } from './styles';
import { PricingPackage } from 'types/PricingPackage';
import { Badge } from 'components/Badge';
import { Segment } from 'types/Segment';

interface Props {
  isBoom: boolean;
  isPhotographer: boolean;
  companyName: string;

  segment: Segment;
  pricingPackage?: PricingPackage;
  canReadChecklist: boolean;
  checklistUrl: string;
  statusColor: string;
  onShowSalesInfo: () => void;
}

const SalesInfo: React.FC<Props> = ({
  isBoom,
  isPhotographer,
  companyName,
  segment,
  pricingPackage,
  canReadChecklist,
  checklistUrl,
  statusColor,
  onShowSalesInfo,
}) => {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, width: '100%' }} data-testid="sales-info-title">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variantName="title2">{companyName}</Typography>
          {isPhotographer && canReadChecklist && checklistUrl && (
            <div style={{ marginBottom: 20, marginTop: '-5px' }}>
              <button style={{ all: 'unset' }} onClick={() => window.open(checklistUrl)}>
                <Typography
                  textColor={statusColor}
                  style={{
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  {t('shootings.readGuidelines')}
                </Typography>
              </button>
            </div>
          )}
        </div>
        {isBoom && Segment.SMB === segment && <Badge color={statusColor} text="SMB" />}
      </div>
      {!isPhotographer && pricingPackage && (
        <>
          <GridTwoCol>
            {pricingPackage.photoType && (
              <Column>
                <Typography variantName="title3" style={{ marginBottom: 5 }}>
                  {t('shootings.shootType')}
                </Typography>
                <div style={{ display: 'flex' }}>
                  <Chip name={t(`photoTypes.${pricingPackage.photoType.type}`)} />
                </div>
              </Column>
            )}
            <Column>
              <Typography variantName="title3" style={{ marginBottom: 5 }}>
                {t('shootings.packageType')}
              </Typography>
              <Typography variantName="body1">{pricingPackage.name}</Typography>
              <Typography variantName="body1">
                {`${pricingPackage.photosQuantity} ${t('shootings.photosLabel')} - ${getDurationInfoString(
                  pricingPackage.shootingDuration
                )}`}
              </Typography>
            </Column>
          </GridTwoCol>
          <div style={{ position: 'absolute', right: 9, bottom: 5 }}>
            <Typography variantName="textButton" textColor={statusColor} onClick={onShowSalesInfo}>
              {t('shootings.shootingViewAll')}
            </Typography>
          </div>
        </>
      )}
    </Wrapper>
  );
};
export { SalesInfo };
