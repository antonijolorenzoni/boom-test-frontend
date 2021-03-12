import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from 'ui-boom-components/lib';

export const ReasonSection = ({ reason, reasonTextCondition = true, title, reasonText }) => {
  const { t } = useTranslation();

  return (
    <div style={{ marginTop: 20 }}>
      <Typography variantName="overline" style={{ textTransform: 'uppercase' }}>
        {title}
      </Typography>
      <div style={{ lineHeight: '10px' }}>
        <Typography variantName="body1" textColor="#A3ABB1" style={{ display: 'inline' }}>{`${t('shootings.reason')}: `}</Typography>
        <Typography variantName="body1" style={{ display: 'inline' }}>
          {reason}
        </Typography>
        {reasonTextCondition && reasonText && <Typography variantName="caption">{reasonText}</Typography>}
      </div>
    </div>
  );
};
