import React, { useState, useEffect } from 'react';
import { TextArea, Typography, Dropdown, Button } from 'ui-boom-components';

import { useTranslation } from 'react-i18next';
import { CancellationActors, ReasonRoles } from 'config/consts';
import { useCancellationReasons } from 'hook/reasons';

import Spinner from 'components/Spinner/Spinner';
import { getActorsAvailable } from '../utils';
import { OrderStatus } from 'types/OrderStatus';
import { useWhoAmI } from 'hook/useWhoAmI';

const DeleteReasonPanel: React.FC<{
  orderStatus: OrderStatus;
  warningMessage?: string;
  onConfirmCancellation: (selectedReason: string, textReason: string) => void;
  loading?: boolean;
  isPhActorVisible?: boolean;
}> = ({ orderStatus, warningMessage, onConfirmCancellation, loading, isPhActorVisible = false }) => {
  const { t } = useTranslation();
  const [selectedActors, setSelectedActors] = useState<Array<string>>([]);
  const [selectedRoles, setSelectedRoles] = useState<Array<string>>([]);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [textReason, setTextReason] = useState('');

  const { isBoom, isPhotographer, isCcUser, isClient, isSMB } = useWhoAmI();

  useEffect(() => {
    if (isBoom) {
      setSelectedActors([ReasonRoles.ADMINISTRATOR]);
    } else if (isClient || isSMB) {
      setSelectedActors([ReasonRoles.CLIENT]);
      setSelectedRoles(Object.values(CancellationActors));
    } else if (isCcUser) {
      setSelectedActors([ReasonRoles.CONTACT_CENTER]);
    }
  }, [isBoom, isPhotographer, isClient, isCcUser, isSMB]);

  const { reasons: cancellationReasons, error: reasonsError } = useCancellationReasons(selectedActors, orderStatus);

  const isDataLoading = !cancellationReasons && !reasonsError;

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
    return <>'Error...'</>;
  }

  const actorsAvailable = getActorsAvailable(cancellationReasons || []);

  const actorsOptions = actorsAvailable
    .filter((actor) => isPhActorVisible || actor !== CancellationActors.PHOTOGRAPHER)
    .map((actor) => ({
      value: actor,
      label: t(`cancellationActors.${actor}`),
    }));

  const getReasonLabel = (reasonCode: string) =>
    t(`cancellationReasons.${reasonCode}${!isBoom && reasonCode.includes(CancellationActors.CLIENT) ? '_firstPerson' : ''}`);

  const reasonsOptions = cancellationReasons
    ?.filter(({ code }) => selectedRoles.some((role) => code.includes(role)))
    .sort((a, b) => (b.requiresText ? -1 : 0))
    .map((reason) => ({
      value: reason.code,
      label: getReasonLabel(reason.code),
      color: reason.requiresText ? '#5AC0B1' : '#000000',
    }));

  const isFreeReasonRequired = cancellationReasons?.some((cr) => cr.code === selectedReason && cr.requiresText);

  return (
    <div style={{ width: 430 }} data-testid="cancellation-reasons">
      {warningMessage && (
        <Typography variantName="body2" style={{ marginBottom: 16 }}>
          {warningMessage}
        </Typography>
      )}
      <Typography variantName="body1" style={{ marginBottom: 16 }}>
        {isBoom || isCcUser ? t('cancellation.pleaseEnterRoleAndReason') : t('cancellation.weNeedYourFeedback')}
      </Typography>
      {(isBoom || isCcUser) && (
        <div style={{ marginBottom: 15 }}>
          <Dropdown
            placeholder={t('cancellation.placeholderActor')}
            options={actorsOptions}
            onChange={(selected) => {
              setSelectedRoles(selected ? [selected.value] : []);
              setSelectedReason(null);
              setTextReason('');
            }}
            showError={false}
          />
        </div>
      )}
      <Dropdown
        placeholder={t('cancellation.placeholderReason')}
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
        onChange={(selected) => setSelectedReason(selected ? selected.value : null)}
        showError={false}
      />
      {isFreeReasonRequired && (
        <div style={{ marginTop: 8 }}>
          <TextArea value={textReason} onChange={(e: any) => setTextReason(e.target.value)} showError={false} />
        </div>
      )}
      <Button
        style={{ margin: 'auto', padding: '6px 10px', marginTop: 15, marginBottom: 7 }}
        onClick={() => onConfirmCancellation(selectedReason!, textReason)}
        disabled={!selectedRoles.length || !selectedReason || (isFreeReasonRequired && textReason.trim() === '')}
        loading={loading}
        data-testid="button-confirm"
      >
        {t('cancellation.confirm').toUpperCase()}
      </Button>
    </div>
  );
};

export { DeleteReasonPanel };
