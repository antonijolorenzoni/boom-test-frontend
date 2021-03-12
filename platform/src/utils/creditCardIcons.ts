import alipay from 'payment-icons/min/flat/alipay.svg';
import amex from 'payment-icons/min/flat/amex.svg';
import notFound from 'payment-icons/min/flat/default.svg';
import diners from 'payment-icons/min/flat/diners.svg';
import discover from 'payment-icons/min/flat/discover.svg';
import elo from 'payment-icons/min/flat/elo.svg';
import hipercard from 'payment-icons/min/flat/hipercard.svg';
import jcb from 'payment-icons/min/flat/jcb.svg';
import maestro from 'payment-icons/min/flat/maestro.svg';
import mastercard from 'payment-icons/min/flat/mastercard.svg';
import paypal from 'payment-icons/min/flat/paypal.svg';
import unionpay from 'payment-icons/min/flat/unionpay.svg';
import verve from 'payment-icons/min/flat/verve.svg';
import visa from 'payment-icons/min/flat/visa.svg';

export const creditCardIcon = {
  alipay,
  amex,
  notFound,
  diners,
  discover,
  elo,
  hipercard,
  jcb,
  maestro,
  mastercard,
  paypal,
  unionpay,
  verve,
  visa,
};

export type CreditCardBrand = keyof typeof creditCardIcon;
