import { CreditCardInfo } from 'components/CreditCardInfo';
import { ImportantSpacedWrapper } from 'components/Forms/styles';
import React from 'react';
import { FormSectionHeader } from 'components/FormSectionHeader';
import { CreditCardBrand } from 'utils/creditCardIcons';
import { Nullable } from '../utils';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Button } from 'ui-boom-components/lib';
import { retrySubscriptionPayment } from 'api/paymentsAPI';
import { IntentStatus } from 'types/payments/IntentStatus';
import { useStripe } from '@stripe/react-stripe-js';
import { useSmbProfile } from 'hook/useSmbProfile';
import { InfoModal } from 'components/Modals/InfoModal';
import { useModal } from 'hook/useModal';

interface Props {
  expMonth: number;
  expYear: number;
  lastFour: string;
  brand: CreditCardBrand;
  onPaymentSuccess: () => void;
  isPaymentRefused?: boolean;
}

const CreditCard = (props: Props) => {
  const { t } = useTranslation();
  const stripe = useStripe();
  const [isCreditCardExpired, setCreditCardExpired] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { smbProfile } = useSmbProfile(true);
  const { openModal } = useModal();

  const handleRetryPaymentClick = async () => {
    if (smbProfile && stripe) {
      setLoading(true);
      try {
        const {
          data: { status, clientSecret },
        } = await retrySubscriptionPayment(smbProfile?.companyId);

        switch (status) {
          case IntentStatus.Succeeded:
            props.onPaymentSuccess();
            break;
          case IntentStatus.RequiresAction:
            const { error } = await stripe.confirmCardPayment(clientSecret);
            error ? openModal('checkCreditCard') : props.onPaymentSuccess();
            break;
          default:
            openModal('checkCreditCard');
            break;
        }
      } catch {
        openModal('checkCreditCard');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <ImportantSpacedWrapper>
        <FormSectionHeader iconName="credit_card" label={t('profile.paymentMethod')} />
      </ImportantSpacedWrapper>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <CreditCardInfo {...props} setExpired={setCreditCardExpired} />
        {props.isPaymentRefused && !isCreditCardExpired && (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 15 }}>
            <Button
              loading={isLoading}
              size={'small'}
              onClick={handleRetryPaymentClick}
              style={{ paddingLeft: 14, paddingRight: 14, marginBottom: 4 }}
            >
              {t('profile.retryPayment')}
            </Button>
          </div>
        )}
      </div>
      <InfoModal id="checkCreditCard" title={t('smb.weCouldNotSubscribed')} body={t('smb.checkCreditCard')} error />
    </>
  );
};

export default Nullable(CreditCard);
