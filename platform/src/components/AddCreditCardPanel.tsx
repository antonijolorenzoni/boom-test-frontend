import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Typography, Icon, Button, TextField } from 'ui-boom-components';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementLocale } from '@stripe/stripe-js';

import constsWithTranslations from 'config/constsWithTranslations';
import { createCardSetupIntent } from 'api/paymentsAPI';
import { showModal } from 'redux/actions/modals.actions';
import translations from 'translations/i18next';

interface Props {
  companyId: number;
  onConfirmAdding: (paymentMethod: string) => void;
}

const AddCreditCardPanel: React.FC<Props> = ({ companyId, onConfirmAdding }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [setupIntentLoading, setSetupIntentLoading] = useState<boolean>();
  const [confirmCardSetupLoading, setConfirmCardSetupLoading] = useState<boolean>();

  const [errorCreditCard, setErrorCreditCard] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [cardholder, setCardHolder] = useState('');

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    setSetupIntentLoading(true);
    createCardSetupIntent(companyId)
      .then((response) => setClientSecret(response.data.clientSecret))
      .catch(() => {
        dispatch(
          showModal('SETUP_INTENT_FAILED', {
            modalType: 'ERROR_ALERT',
            modalProps: {
              message: t('payments.errorSetupCreditCard'),
            },
          })
        );
      })
      .finally(() => setSetupIntentLoading(false));
  }, [companyId, dispatch, t]);

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    if (stripe && elements && clientSecret) {
      const cardElement = elements.getElement(CardElement)!;

      setConfirmCardSetupLoading(true);
      const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (setupIntent?.payment_method && !error) {
        onConfirmAdding(setupIntent.payment_method);
      } else {
        const errorLabel =
          constsWithTranslations.STRIPE_ERROR_MESSAGES[error?.code ?? ''] || constsWithTranslations.STRIPE_ERROR_MESSAGES['unknown_error'];
        setErrorCreditCard(errorLabel);
        setConfirmCardSetupLoading(false);
      }
    }
  };

  const setupIntentLoadingOrError = setupIntentLoading || (!setupIntentLoading && !clientSecret);

  return (
    <div style={{ width: 490 }}>
      <div style={{ display: 'flex', marginBottom: 16 }}>
        <Icon name="credit_card" color="#000000" size={18} style={{ marginRight: 10 }} />
        <Typography variantName="title3" textColor="#000000">
          {t('smb.addCreditCard')}
        </Typography>
      </div>
      <Typography variantName="body1" textColor="#80888D" style={{ marginBottom: 20 }}>
        {t('smb.addCreditCardInfo')}
      </Typography>
      <CardElement
        options={{
          style: {
            base: {
              fontFamily: "'Poppins', Arial, Helvetica, sans-serif",
              fontSize: '13px',
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
        onChange={() => setErrorCreditCard(null)}
      />
      <div style={{ marginTop: 8 }}>
        <TextField
          name="cardHolder"
          label={t('smb.cardHolder')}
          value={cardholder}
          onChange={(e) => setCardHolder(e.target.value)}
          required
        />
      </div>
      <Typography
        variantName="error"
        style={{
          visibility: errorCreditCard ? 'visible' : 'hidden',
          order: 3,
          minHeight: 18,
          marginTop: 2,
        }}
      >
        {errorCreditCard}
      </Typography>
      <Button
        style={{ margin: 'auto', padding: '6px 10px', marginTop: 50, marginBottom: 7 }}
        onClick={handleSubmit}
        disabled={setupIntentLoadingOrError || cardholder.trim() === ''}
        loading={confirmCardSetupLoading}
      >
        {t('smb.save').toUpperCase()}
      </Button>
    </div>
  );
};

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY!, {
  locale: translations.language as StripeElementLocale,
});

export const StripeAddCreditCardPanel: React.FC<Props> = ({ companyId, onConfirmAdding }) => (
  <Elements stripe={stripePromise}>
    <AddCreditCardPanel companyId={companyId} onConfirmAdding={onConfirmAdding} />
  </Elements>
);
