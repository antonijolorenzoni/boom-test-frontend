import React from 'react';
import { screen, render } from '@testing-library/react';
import translations from 'translations/i18next';
import '@testing-library/jest-dom/extend-expect';
import { MyCreditCardSection } from './MyCreditCardSection';
import { usePaymentMethod } from 'hook/usePaymentMethod';
import { useSmbProfile } from 'hook/useSmbProfile';

jest.mock('hook/useSmbProfile', () => ({
  useSmbProfile: jest.fn(),
}));

jest.mock('hook/usePaymentMethod', () => ({
  usePaymentMethod: jest.fn(),
}));

const error = jest.fn();
const mutate = jest.fn();
const useSmbProfileMock = useSmbProfile as jest.Mock;
const usePaymentMethodMock = usePaymentMethod as jest.Mock;

const key = (value: string): string => translations.t(`forms.newOrder.${value}`);

beforeEach(jest.clearAllMocks);

describe('MyCreditCardSection', () => {
  test('should render nothing when user credit card not resolved', () => {
    const { queryByText } = screen;

    useSmbProfileMock.mockImplementation((condition: boolean) => {
      return {
        smbProfile: undefined,
        error,
        mutate,
      };
    });

    usePaymentMethodMock.mockImplementation((condition: boolean, companyId: number) => {
      return {
        paymentMethod: undefined,
        error,
        mutate,
      };
    });

    render(<MyCreditCardSection />);

    expect(queryByText(key('paymentMethod'))).toBeNull();
    expect(queryByText(key('paymentMethodDisclaimer'))).toBeNull();
  });

  test('should correctly render card info when user credit card is resolved', () => {
    const { queryByText } = screen;

    useSmbProfileMock.mockImplementation((condition: boolean) => {
      return {
        smbProfile: {
          companyId: 777,
          id: 0,
          languageIsoCode: 'string',
          username: 'string',
          email: 'string',
          firstName: 'string',
          lastName: 'string',
          address: 'string',
          jobTitle: 'string',
          phoneNumber: 'string',
          language: 'ENGLISH',
          activationDate: 0,
          organization: 0,
          roles: [],
          enabled: true,
          deleted: true,
        },
        error,
        mutate,
      };
    });

    usePaymentMethodMock.mockImplementation((condition: boolean, companyId: number) => {
      return {
        paymentMethod: {
          brand: 'string',
          expMonth: 0,
          expYear: 0,
          lastFour: 'string',
        },
        error,
        mutate,
      };
    });

    render(<MyCreditCardSection />);

    expect(queryByText(key('paymentMethod'))).not.toBeNull();
    expect(queryByText(key('paymentMethodDisclaimer'))).not.toBeNull();

    expect(useSmbProfileMock).toHaveBeenCalledWith(true);
    expect(usePaymentMethodMock).toHaveBeenCalledWith(true, 777);
  });
});
