import { DeliveryMethodSection } from 'components/FormSection/DeliveryMethodSection';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'ui-boom-components';
import _ from 'lodash';
import { useFormikContext } from 'formik';
import * as ModalsActions from 'redux/actions/modals.actions';
import { resendDeliveries } from 'api/shootingsAPI';
import { useTranslation } from 'react-i18next';
import { SHOOTINGS_STATUSES } from 'config/consts';

interface Props {
  isDriveAuthorized: boolean;
  companyId: number;
  organizationId: number;
  state: string;
  id: number;
  setDeliveryDataChange: (bool: boolean) => void;
  deliveryDataChange: boolean;
}

interface DeliveryFormData {
  deliveryMethodsEmails: Array<string>;
  deliveryMethodsIsDriveSelected: boolean;
  driveFolderId: string;
}

export const DeliveryMethodWrapper: React.FC<Props> = ({
  isDriveAuthorized,
  companyId,
  organizationId,
  state,
  id,
  setDeliveryDataChange,
  deliveryDataChange,
}) => {
  const [loadSendAgain, setLoadSendAgain] = useState<boolean>(false);

  const { values, initialValues } = useFormikContext<any>();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { isBoom } = useSelector((state: any) => ({
    isBoom: state.user.data.isBoom,
  }));

  const initialDeliveryFormData: DeliveryFormData = _.pick(initialValues, [
    'deliveryMethodsEmails',
    'deliveryMethodsIsDriveSelected',
    'driveFolderId',
  ]);

  const currentDeliveryFormData: DeliveryFormData = _.pick(values, [
    'deliveryMethodsEmails',
    'deliveryMethodsIsDriveSelected',
    'driveFolderId',
  ]);

  const isDeliveryDataEmpty =
    initialDeliveryFormData.deliveryMethodsEmails.length === 0 &&
    !initialDeliveryFormData.deliveryMethodsIsDriveSelected &&
    !initialDeliveryFormData.driveFolderId;

  useEffect(() => {
    setDeliveryDataChange(JSON.stringify(initialDeliveryFormData) !== JSON.stringify(currentDeliveryFormData));
  }, [initialDeliveryFormData, currentDeliveryFormData, setDeliveryDataChange]);

  const openResendFeedback = (modalType: string, message: string) => {
    dispatch(
      ModalsActions.showModal('RESEND_FEEDBACK', {
        modalType,
        modalProps: {
          message,
        },
      })
    );
  };

  const sendToAllMethods = async () => {
    setLoadSendAgain(true);

    try {
      await resendDeliveries(organizationId, id);
      openResendFeedback('SUCCESS_ALERT', t('shootings.resendingDeliveriesOk'));
    } catch (e) {
      openResendFeedback('ERROR_ALERT', t('shootings.resendingDeliveriesError'));
    } finally {
      setLoadSendAgain(false);
    }
  };

  const showSendToAllButton = [SHOOTINGS_STATUSES.DONE, SHOOTINGS_STATUSES.DOWNLOADED].includes(state);

  return (
    <>
      <DeliveryMethodSection isDriveAuthorized={isDriveAuthorized} companyId={companyId} organizationId={organizationId} />
      {isBoom && showSendToAllButton && (
        <div>
          <Button
            size="small"
            backgroundColor="#5AC0B1"
            style={{ marginTop: 35 }}
            disabled={deliveryDataChange || loadSendAgain || isDeliveryDataEmpty}
            onClick={sendToAllMethods}
          >
            {t('shootings.deliverySendAgain')}
          </Button>
          <span style={{ fontSize: 12, color: '#80888D', visibility: deliveryDataChange ? 'visible' : 'hidden' }}>
            {t('shootings.deliverySendAgainInfo')}
          </span>
        </div>
      )}
    </>
  );
};
