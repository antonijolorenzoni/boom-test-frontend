import React, { useState } from 'react';
import { TextArea, Typography, Dropdown, Button, OutlinedButton } from 'ui-boom-components';

import { useTranslation } from 'react-i18next';
import { ReasonRoles } from 'config/consts';
import { useRefuseReasons, useReshootReason } from 'hook/reasons';
import Spinner from 'components/Spinner/Spinner';
import { getActorsAvailable } from '../utils';
import { OrderStatus } from 'types/OrderStatus';

interface Props {
  orderStatus: OrderStatus;
  subTitle?: string;
  infoMessage?: string;
  onConfirmCancellation: (selectedReason: string, textReason: string) => void;
  onClose?: () => void;
  isRefusing: boolean;
}

const AdminRefuseAndReshootPhotoPanel: React.FC<Props> = ({
  orderStatus,
  subTitle,
  infoMessage,
  onConfirmCancellation,
  onClose,
  isRefusing,
}) => {
  const { t } = useTranslation();
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [textReason, setTextReason] = useState('');

  const reasonHook = isRefusing ? useRefuseReasons : useReshootReason;

  const { reasons, error: reasonsError } = reasonHook([ReasonRoles.ADMINISTRATOR], orderStatus);

  const isDataLoading = !reasons.length && !reasonsError;

  const translationFirstKey = isRefusing ? 'refuse' : 'reshoot';

  if (isDataLoading) {
    return (
      <div style={{ width: 430 }}>
        <Spinner
          title={t('general.loading')}
          hideLogo
          spinnerStyle={{ color: '#5AC0B1', marginTop: 10 }}
          titleStyle={{ color: '#3f3f3f', marginTop: 5 }}
        />
      </div>
    );
  }

  if (reasonsError) {
    return <>Error...</>;
  }

  const getReasonLabel = (reasonCode: string): string => t(`cancellationReasons.${reasonCode}`);

  const reasonsOptions = reasons
    .filter(({ code }) => selectedRoles.some((role) => code.includes(role)))
    .sort((a, b) => (b.requiresText ? -1 : 0))
    .map((reason) => ({
      value: reason.code,
      label: getReasonLabel(reason.code),
      color: reason.requiresText ? '#5AC0B1' : '#000000',
    }));

  const isFreeReasonRequired = reasons.some((cr) => cr.code === selectedReason && cr.requiresText);

  const actorsAvailable = getActorsAvailable(reasons);

  const actorsOptions = actorsAvailable.map((actor) => ({
    value: actor,
    label: t(`cancellationActors.${actor}`),
  }));

  return (
    <div style={{ width: 430 }}>
      <Typography variantName="title2" style={{ marginBottom: 11, textAlign: 'center' }}>
        {t(`${translationFirstKey}.pleaseEnterRoleAndReason`)}
      </Typography>
      {subTitle && (
        <Typography variantName="body3" style={{ marginBottom: 9, textAlign: 'center' }}>
          {subTitle}
        </Typography>
      )}
      {infoMessage && (
        <Typography variantName="body3" textColor="#80888D" style={{ marginBottom: 9, textAlign: 'center' }}>
          {infoMessage}
        </Typography>
      )}
      <div style={{ marginBottom: 6, marginTop: 17 }}>
        <Dropdown
          placeholder={t(`${translationFirstKey}.placeholderActor`)}
          options={actorsOptions}
          onChange={(selected: { value: string; label: string } | null) => {
            setSelectedRoles(selected?.value ? [selected?.value] : []);
            setSelectedReason(null);
            setTextReason('');
          }}
          showError={false}
        />
      </div>
      <Dropdown
        placeholder={t(`${translationFirstKey}.placeholderReason`)}
        options={reasonsOptions}
        value={
          selectedReason
            ? {
                label: getReasonLabel(selectedReason),
                value: selectedReason,
                color: '',
              }
            : null
        }
        isDisabled={!selectedRoles.length || isDataLoading}
        onChange={(selected: { value: string; label: string } | null) => setSelectedReason(selected?.value ?? null)}
        showError={false}
      />
      {isFreeReasonRequired && (
        <TextArea style={{ marginTop: 6, resize: 'none' }} value={textReason} onChange={(e) => setTextReason(e.target.value)} />
      )}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {onClose && (
          <OutlinedButton
            style={{ padding: '6px 30px', marginTop: 15, marginRight: 20, marginBottom: 7, textTransform: 'uppercase' }}
            onClick={onClose}
          >
            {t(`general.cancel`)}
          </OutlinedButton>
        )}
        <Button
          style={{ padding: '6px 30px', marginTop: 15, marginBottom: 7, textTransform: 'uppercase' }}
          onClick={() => selectedReason && onConfirmCancellation(selectedReason, textReason)}
          disabled={!selectedRoles.length || !selectedReason || (isFreeReasonRequired && textReason.trim() === '')}
          data-testid="button-confirm"
        >
          {t(`${translationFirstKey}.confirm`)}
        </Button>
      </div>
    </div>
  );
};

export { AdminRefuseAndReshootPhotoPanel };
