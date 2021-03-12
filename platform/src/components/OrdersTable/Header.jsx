import React from 'react';
import { useTranslation } from 'react-i18next';
import { EllipsisTypography } from './styles';

export const Header = ({ i18key }) => {
  const { t } = useTranslation();

  return (
    <EllipsisTypography style={{ padding: '7px 10px', textTransform: 'uppercase' }} variantName="overline">
      {t(i18key)}
    </EllipsisTypography>
  );
};
