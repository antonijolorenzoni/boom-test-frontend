import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Typography } from 'ui-boom-components';
import SmbSubscriptionCard from 'components/SmbSubscriptionCard';
import { Currency } from 'types/Currency';
import * as ModalsActions from 'redux/actions/modals.actions';
import { FormButtons } from 'components/Forms/FormComponents/FormButtons';
import { confirmAndSubscribe } from 'api/paymentsAPI';
import { useSmbProfile } from 'hook/useSmbProfile';
import { useSubscription } from 'hook/useSubscription';
import { BillingInfoDto } from 'types/SubscriptionResponse';
import { IntentStatus } from 'types/payments/IntentStatus';
import { useStripe } from '@stripe/react-stripe-js';
import { handleStripeConfirmation } from 'utils/payments/stripe-payment';
import { InfoModal } from 'components/Modals/InfoModal';
import { useModal } from 'hook/useModal';

interface Props {
  currency: Currency;
  remainingDays: number;
  isUnsubscribedActive: boolean;
}

export const ConfirmSubscribeModal: React.FC<Props> = ({ currency, remainingDays, isUnsubscribedActive }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const stripe = useStripe();

  const { smbProfile } = useSmbProfile(true);
  const { subscription, mutate: mutateSubscription } = useSubscription(true, smbProfile?.companyId);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { openModal } = useModal();

  const handleSubscribeSuccess = () => {
    mutateSubscription();
    setIsLoading(false);
    dispatch(ModalsActions.hideModal('CONFIRM_SUBSCRIBE'));
    dispatch(
      ModalsActions.showModal('CONFIRM_SUBSCRIBE_SUCCESS', {
        modalType: 'SUCCESS_ALERT',
        modalProps: {
          message: t('smb.successOnSubscribe'),
        },
      })
    );
  };

  const handleSubscribeFail = () => {
    setIsLoading(false);
    dispatch(ModalsActions.hideModal('CONFIRM_SUBSCRIBE'));
    openModal('checkCreditCard');
  };

  const onConfirm = async (companyId: number, billingInfo: BillingInfoDto) => {
    try {
      setIsLoading(true);

      const {
        data: { clientSecret, status, type },
      } = await confirmAndSubscribe(companyId, billingInfo);

      switch (status) {
        case IntentStatus.Succeeded:
          handleSubscribeSuccess();
          break;
        case IntentStatus.RequiresAction:
          if (stripe) {
            const { error } = await handleStripeConfirmation(stripe, type, clientSecret);
            error ? handleSubscribeFail() : handleSubscribeSuccess();
          } else {
            handleSubscribeFail();
          }
          break;
        default:
          handleSubscribeFail();
          break;
      }
    } catch {
      handleSubscribeFail();
    }
  };

  const onCancel = () => dispatch(ModalsActions.hideModal('CONFIRM_SUBSCRIBE'));

  return (
    <div style={{ width: 490 }}>
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 32, alignItems: 'center' }}>
        <Typography
          variantName="title3"
          textColor="#000000"
          style={{ marginBottom: 26, paddingLeft: 55, paddingRight: 55, textAlign: 'center' }}
        >
          {t('smb.subscribeAgain')}
        </Typography>
        <SmbSubscriptionCard currency={currency} />
        <Typography
          variantName="body1"
          textColor="#80888D"
          style={{ marginTop: 32, paddingLeft: 55, paddingRight: 55, textAlign: 'center' }}
        >
          {isUnsubscribedActive ? t('smb.confirmSubscribeAgainOnUnsubscribeActive', { remainingDays }) : t('smb.confirmSubscribeAgain')}
        </Typography>
      </div>
      <div style={{ marginBottom: 52 }}>
        <FormButtons
          onCancel={onCancel}
          onSubmit={() => smbProfile && subscription && onConfirm(smbProfile?.companyId, subscription.billingInfoDto)}
          loading={isLoading}
        />
      </div>
      <InfoModal id="checkCreditCard" title={t('smb.weCouldNotSubscribed')} body={t('smb.checkCreditCard')} error />
    </div>
  );
};
