import React from 'react';
import '@testing-library/jest-dom';
import { screen, render } from '@testing-library/react';
import translations from 'translations/i18next';
import { CreditCardInfo } from './CreditCardInfo';

jest.mock('moment', () => ({
  __esModule: true,
  ...(jest.requireActual('moment') as any),
  default: jest.fn().mockImplementation((date: any) => jest.requireActual('moment')(date || '1990-07-20T10:00:00.000+0000')),
}));

describe('CreditCardInfo', () => {
  test('should show error message when payment is refused', async () => {
    render(<CreditCardInfo expMonth={2} expYear={1995} lastFour={'7777'} brand={'visa'} isPaymentRefused />);

    expect(screen.getByText(translations.t('smb.refusedPayment') as string)).toBeVisible();
  });

  test(`should don't show error message when payment is not refused and not expired`, async () => {
    render(<CreditCardInfo expMonth={2} expYear={2222} lastFour={'7777'} brand={'visa'} />);

    expect(screen.queryByText(translations.t('smb.refusedPayment') as string)).toBeNull();
    expect(screen.queryByText(translations.t('smb.cardExpired') as string)).toBeNull();
  });

  test('should show error message when credit card is expired and payment refused', async () => {
    render(<CreditCardInfo expMonth={1} expYear={1970} lastFour={'7777'} brand={'visa'} isPaymentRefused />);

    expect(screen.getByText(translations.t('smb.cardExpired') as string)).toBeVisible();
  });
});
