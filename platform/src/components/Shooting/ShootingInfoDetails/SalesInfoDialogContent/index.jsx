import React from 'react';
import { useTranslation } from 'react-i18next';
import get from 'lodash/get';

import { Typography, Chip } from 'ui-boom-components';
import { getDurationInfoString } from '../../../../utils/timeHelpers';
import { Column } from './styles';

export const SalesInfoDialogContent = ({ clientName, checklistUrl, pricingPackage }) => {
  const { t } = useTranslation();

  const { name, photosQuantity, shootingDuration, photoType, companyPrice, photographerEarning, currency } = pricingPackage;
  const currencySymbol = get(currency, 'symbol', '');

  return (
    <div>
      <Typography variantName="body1">{clientName}</Typography>
      {checklistUrl && (
        <Typography
          style={{
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
          textColor="#5AC0B1"
          onClick={() => window.open(checklistUrl)}
        >
          {t('shootings.readGuidelines')}
        </Typography>
      )}
      <div style={{ display: 'flex', marginTop: 20 }}>
        <Column>
          <Typography variantName="title3" style={{ marginBottom: 5 }}>
            {t('shootings.shootType')}
          </Typography>
          <div style={{ display: 'flex' }}>
            <Chip name={t(`photoTypes.${photoType.type}`)} />
          </div>
        </Column>
        <Column withMarginLeft>
          <Typography variantName="title3" style={{ marginBottom: 5 }}>
            {t('shootings.packageType')}
          </Typography>
          <Typography variantName="body1">{name}</Typography>
          <Typography variantName="body1">
            {`${photosQuantity} ${t('shootings.photosLabel')} - ${getDurationInfoString(shootingDuration)}`}
          </Typography>
        </Column>
      </div>
      <div style={{ display: 'flex', marginTop: 20 }}>
        <Column>
          <Typography variantName="title3" style={{ marginBottom: 5 }}>
            {t('shootings.priceExposed')}
          </Typography>
          <Typography variantName="title2">{`${companyPrice} ${currencySymbol}`}</Typography>
        </Column>
        <Column withMarginLeft>
          <Typography variantName="title3" style={{ marginBottom: 5 }}>
            {t('shootings.photographerEarningShort')}
          </Typography>
          <Typography variantName="title2">{`${photographerEarning} ${currencySymbol}`}</Typography>
        </Column>
      </div>
    </div>
  );
};
