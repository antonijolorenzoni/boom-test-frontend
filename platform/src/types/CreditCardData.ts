import { CreditCardBrand } from 'utils/creditCardIcons';

export interface CreditCardData {
  expMonth: number;
  expYear: number;
  lastFour: string;
  brand: CreditCardBrand;
}
