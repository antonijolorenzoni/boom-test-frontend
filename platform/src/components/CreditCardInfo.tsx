import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from 'ui-boom-components';
import moment from 'moment';
import { CreditCardBrand, creditCardIcon } from 'utils/creditCardIcons';
import { useEffect } from 'react';

type Props = {
  expMonth: number;
  expYear: number;
  lastFour: string;
  brand: CreditCardBrand;
  isPaymentRefused?: boolean;
  setExpired?: (expired: boolean) => void;
};

export const CreditCardInfo: React.FC<Props> = ({
  expMonth,
  expYear,
  lastFour,
  brand,
  isPaymentRefused = false,
  setExpired = () => {},
}) => {
  const { t, i18n } = useTranslation();

  const expirationDate = moment([expYear, expMonth - 1, 1]);
  const expiration = expirationDate.locale(i18n.languages[0]).format('MMMM YYYY');

  const isExpired = moment().isAfter(expirationDate);
  const hasError = isPaymentRefused || isExpired;

  useEffect(() => {
    setExpired(isExpired);
  }, [isExpired, setExpired]);

  return (
    <div>
      <div style={{ opacity: hasError ? 0.5 : 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
          <img src={`${creditCardIcon[brand] ?? creditCardIcon.notFound}`} alt="cc-icon" width="50" />
          <Typography variantName="body2" style={{ marginLeft: 12 }}>{`${t('smb.endsWith')} ${lastFour}`}</Typography>
        </div>
        <Typography variantName="overline" style={{ marginBottom: 4, textTransform: 'uppercase' }}>
          {t('smb.expirationDate')}
        </Typography>
        <Typography variantName="body2" style={{ marginBottom: 4 }}>
          {expiration}
        </Typography>
      </div>
      {hasError && (
        <Typography
          variantName="error"
          style={{
            minHeight: 18,
            marginTop: 10,
          }}
        >
          {t(isExpired ? 'smb.cardExpired' : 'smb.refusedPayment')}
        </Typography>
      )}
    </div>
  );
};
