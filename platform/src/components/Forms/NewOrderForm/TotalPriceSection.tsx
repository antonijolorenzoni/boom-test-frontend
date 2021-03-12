import React from 'react';
import { Paper, Direction } from 'components/Paper';
import { Icon, Typography } from 'ui-boom-components/lib';
import { useTranslation } from 'react-i18next';

interface Props {
  price?: number;
  currency?: string;
}

export const TotalPriceSection: React.FC<Props> = ({ price, currency }) => {
  const { t } = useTranslation();

  return (
    <div style={{ margin: '10px 0px' }}>
      <Paper shadowDirection={Direction.DownRight} style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex' }}>
          <Icon name="shopping_cart" color="black" size={24} />
          <Typography textColor={'DarkGray'} variantName="title2" style={{ marginLeft: 25 }}>
            {t('forms.newOrder.totalPrice')}
          </Typography>
          <Typography variantName="title2" style={{ marginLeft: 10 }}>
            {`${price ? price + (currency ?? '') : '--'}`}
          </Typography>
        </div>
        {price && (
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Typography variantName="caption2" textColor="#000">
              {t('forms.newOrder.vatIncluded')}
            </Typography>
          </div>
        )}
      </Paper>
    </div>
  );
};
