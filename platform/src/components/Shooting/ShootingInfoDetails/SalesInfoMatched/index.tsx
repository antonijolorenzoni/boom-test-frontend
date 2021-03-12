import React from 'react';
import get from 'lodash/get';

import { Typography, Chip } from 'ui-boom-components';
import { useTranslation } from 'react-i18next';
import { getDurationInfoString } from 'utils/timeHelpers';

import { GridTwoCol, Column, Wrapper } from './styles';
import { PricingPackage } from 'types/PricingPackage';
import { Badge } from 'components/Badge';
import { Segment } from 'types/Segment';

interface Props {
  isBoom: boolean;
  companyName: string;
  segment: Segment;
  pricingPackage: PricingPackage;
  statusColor: string;
  canReadChecklist: boolean;
  checklistUrl: string;
}

const SalesInfoMatched: React.FC<Props> = ({
  isBoom,
  companyName,
  segment,
  pricingPackage,
  statusColor,
  canReadChecklist,
  checklistUrl,
}) => {
  const { t } = useTranslation();
  const { name, photosQuantity, shootingDuration, photoType, companyPrice, photographerEarning, currency } = pricingPackage;
  const typeOfShooting = photoType.type;
  const currencySymbol = get(currency, 'symbol', '');

  return (
    <Wrapper>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, width: '100%' }} data-testid="sales-info-title">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variantName="title2">{companyName}</Typography>
          {canReadChecklist && checklistUrl && (
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
        {isBoom && segment === Segment.SMB && <Badge color={statusColor} text="SMB" />}
      </div>
      <div style={{ marginBottom: 15, width: '100%' }}>
        <GridTwoCol>
          {typeOfShooting && (
            <Column>
              <>
                <Typography variantName="title3" style={{ marginBottom: 5 }}>
                  {t('shootings.shootType')}
                </Typography>
                <div style={{ display: 'flex' }}>
                  <Chip name={t(`photoTypes.${photoType.type}`)} />
                </div>
              </>
            </Column>
          )}
          <Column>
            <Typography variantName="title3" style={{ marginBottom: 5 }}>
              {t('shootings.packageType')}
            </Typography>
            <Typography variantName="body1">{name}</Typography>
            <Typography variantName="body1">
              {`${photosQuantity} ${t('shootings.photosLabel')} - ${getDurationInfoString(shootingDuration)}`}
            </Typography>
          </Column>
        </GridTwoCol>
      </div>
      {isBoom && (
        <GridTwoCol>
          <Column>
            <Typography variantName="title3" style={{ marginBottom: 5 }}>
              {t('shootings.priceExposed')}
            </Typography>
            <Typography variantName="title2">{`${companyPrice} ${currencySymbol}`}</Typography>
          </Column>
          <Column>
            <Typography variantName="title3" style={{ marginBottom: 5 }}>
              {t('shootings.photographerEarningShort')}
            </Typography>
            <Typography variantName="title2">{`${photographerEarning} ${currencySymbol}`}</Typography>
          </Column>
        </GridTwoCol>
      )}
    </Wrapper>
  );
};

export { SalesInfoMatched };
