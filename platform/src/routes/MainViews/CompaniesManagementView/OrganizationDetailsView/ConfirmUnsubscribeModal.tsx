import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, OutlinedButton, Typography } from 'ui-boom-components';
import { debounce } from 'lodash';

export const ConfirmUnsubscribeModal: React.FC<{ onConfirm: () => void; onCancel: () => void }> = ({ onConfirm, onCancel }) => {
  const { t } = useTranslation();

  return (
    <div style={{ width: 490 }}>
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 40 }}>
        <Typography
          variantName="title3"
          textColor="#000000"
          style={{ marginBottom: 26, paddingLeft: 55, paddingRight: 55, textAlign: 'center' }}
        >
          {t('smb.unsubscribeMonthlyPlan')}
        </Typography>
        <Typography variantName="body1" textColor="#80888D" style={{ paddingLeft: 55, paddingRight: 55, textAlign: 'center' }}>
          {t('smb.confirmUnsubscribeMonthlyPlan')}
        </Typography>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <OutlinedButton onClick={onCancel} style={{ marginRight: 20, padding: 18 }}>
          {t('modals.cancel').toUpperCase()}
        </OutlinedButton>
        <Button style={{ border: '2px solid', borderColor: '#5AC0B1', padding: 18 }} onClick={debounce(onConfirm, 500)}>
          {t('modals.confirm').toUpperCase()}
        </Button>
      </div>
    </div>
  );
};
