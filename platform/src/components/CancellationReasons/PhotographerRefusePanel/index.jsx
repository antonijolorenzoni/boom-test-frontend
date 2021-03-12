import React, { useState } from 'react';
import { TextArea, Typography, Dropdown, Button } from 'ui-boom-components';

import { useTranslation } from 'react-i18next';
import { PHOTOGRAPHER_SHOOTING_CALENDAR_STATUSES, PHOTOGRAPHER_SHOOTING_STATUSES_TRANSLATION_MAP } from 'config/consts';
import { usePhotographerDiscardReasons } from 'hook/reasons';
import { usePhotographerRevokeAvailabilityReasons } from 'hook/reasons';

const PhotographerRefusePanel = ({ orderStatus, onConfirmCancellation }) => {
  const { t } = useTranslation();
  const [selectedReason, setSelectedReason] = useState(null);
  const [textReason, setTextReason] = useState('');

  const photographerOrderStatus = PHOTOGRAPHER_SHOOTING_STATUSES_TRANSLATION_MAP[orderStatus];

  const reasonHook =
    photographerOrderStatus === PHOTOGRAPHER_SHOOTING_CALENDAR_STATUSES.NEW_INVITE
      ? usePhotographerDiscardReasons
      : usePhotographerRevokeAvailabilityReasons;

  const { reasons, error } = reasonHook(orderStatus);

  const isReasonsLoading = !reasons.length && !error;

  const getReasonLabel = (reasonCode) => t(`cancellationReasons.${reasonCode}_firstPerson`);

  const reasonsOptions = reasons
    .sort((a, b) => (b.requiresText ? -1 : 0))
    .map((reason) => ({
      value: reason.code,
      label: getReasonLabel(reason.code),
      color: reason.requiresText ? '#5AC0B1' : '#000000',
    }));

  const isFreeReasonRequired = reasons.some((cr) => cr.code === selectedReason && cr.requiresText);

  return (
    <div style={{ width: 430 }}>
      <Typography variantName="body1" style={{ marginBottom: 16 }}>
        {t('shootings.titleDiscardInvitation')}
      </Typography>
      <Dropdown
        placeholder={t('shootings.placeholderDiscardInvitation')}
        options={reasonsOptions}
        value={
          selectedReason
            ? {
                label: getReasonLabel(selectedReason),
                value: selectedReason,
              }
            : null
        }
        isDisabled={isReasonsLoading}
        onChange={(selected) => setSelectedReason(selected.value)}
        showError={false}
      />
      {isFreeReasonRequired && <TextArea value={textReason} onChange={(e) => setTextReason(e.target.value)} />}
      <Button
        style={{ margin: 'auto', padding: '6px 10px', marginTop: 15, marginBottom: 7 }}
        onClick={() => onConfirmCancellation(selectedReason, textReason)}
        disabled={!selectedReason || (isFreeReasonRequired && textReason.trim() === '')}
        data-testid="button-confirm"
      >
        {t('cancellation.confirm').toUpperCase()}
      </Button>
    </div>
  );
};

export { PhotographerRefusePanel };
