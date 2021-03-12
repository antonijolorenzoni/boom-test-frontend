import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, Typography, OutlinedButton } from 'ui-boom-components';
import { neutralDarkGray } from '../colors';

interface Props {
  errorLabel: string;
  onConfirm: () => void;
  color: string;
  errorBodyLabel: string;
}

export const ErrorPanel: React.FC<Props> = ({ errorLabel, onConfirm, color, errorBodyLabel }) => {
  const { t } = useTranslation();

  return (
    <div style={{ textAlign: 'center' }}>
      <Icon name="warning" color={color} size={22} style={{ marginBottom: 8 }} />
      <Typography variantName="body1" textColor={color} style={{ textAlign: 'center' }}>
        {errorLabel}
      </Typography>
      <Typography variantName="body1" textColor={neutralDarkGray} style={{ textAlign: 'center', marginBottom: 9 }}>
        {errorBodyLabel}
      </Typography>
      <OutlinedButton size="small" onClick={onConfirm} style={{ margin: 'auto' }}>
        {t('general.ok')}
      </OutlinedButton>
    </div>
  );
};
