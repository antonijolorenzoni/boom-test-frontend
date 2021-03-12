import React from 'react';
import { cleanup, screen, fireEvent, waitFor } from '@testing-library/react';
import translations from 'translations/i18next';
import { withStoreRender } from 'utils/test-utils';
import '@testing-library/jest-dom/extend-expect';
import { useSmbProfile } from 'hook/useSmbProfile';
import i18next from 'translations/i18next';
import { useStripe } from '@stripe/react-stripe-js';
import CreditCard from '.';
import { retrySubscriptionPayment } from 'api/paymentsAPI';
import { IntentStatus } from 'types/payments/IntentStatus';
import { IntentType } from 'types/payments/IntentType';
import { ModalProvider } from 'hook/useModal';

afterEach(cleanup);

i18next.init({
  lng: 'en',
  fallbackLng: ['en', 'it'],
});

jest.mock('moment', () => ({
  __esModule: true,
  ...(jest.requireActual('moment') as any),
  default: jest.fn().mockImplementation((date) => jest.requireActual('moment')('2020-12-10', 'YYYY-MM-DD')),
}));

// Stripe mock
jest.mock('@stripe/react-stripe-js', () => ({
  useStripe: jest.fn(),
}));
const useStripeMock = useStripe as jest.Mock;

// Smb profile
jest.mock('hook/useSmbProfile', () => ({
  useSmbProfile: jest.fn(),
}));
const useSmbProfileMock = useSmbProfile as jest.Mock;
const error = jest.fn();
const mutate = jest.fn();

// API
jest.mock('api/paymentsAPI', () => ({
  retrySubscriptionPayment: jest.fn(),
}));

const retrySubscriptionPaymentMock = retrySubscriptionPayment as jest.Mock;

const onSuccess = jest.fn();
onSuccess.mockImplementation(() => {});

describe('CreditCard', () => {
  test('should DO NOT show retry payment button when card is expired', async () => {
    const { queryByText } = screen;

    const confirmCardPaymentStripeMock = jest.fn();
    useStripeMock.mockImplementation(() => {
      return {
        confirmCardPayment: confirmCardPaymentStripeMock,
      };
    });

    useSmbProfileMock.mockImplementation((condition: boolean) => {
      expect(condition).toBeTruthy();
      return {
        smbProfile: {
          companyId: 777,
          id: 0,
          languageIsoCode: 'NotUsed',
          username: 'NotUsed',
          email: 'NotUsed',
          firstName: 'NotUsed',
          lastName: 'NotUsed',
          address: 'NotUsed',
          jobTitle: 'NotUsed',
          phoneNumber: 'NotUsed',
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

    withStoreRender(
      <ModalProvider>
        <CreditCard expMonth={0} expYear={1970} lastFour={'4444'} brand={'visa'} onPaymentSuccess={onSuccess} />
      </ModalProvider>,
      {
        initialState: {},
      }
    );

    await waitFor(() => {
      expect(useSmbProfileMock).toBeCalled();
      expect(retrySubscriptionPaymentMock).not.toBeCalled();
      expect(onSuccess).not.toBeCalled();

      expect(queryByText(translations.t('profile.retryPayment') as string)).toBeNull();
    });
  });

  test('should DO NOT show retry payment button when card is expired ', async () => {
    const { queryByText } = screen;

    const confirmCardPaymentStripeMock = jest.fn();
    useStripeMock.mockImplementation(() => {
      return {
        confirmCardPayment: confirmCardPaymentStripeMock,
      };
    });

    useSmbProfileMock.mockImplementation((condition: boolean) => {
      expect(condition).toBeTruthy();
      return {
        smbProfile: {
          companyId: 777,
          id: 0,
          languageIsoCode: 'NotUsed',
          username: 'NotUsed',
          email: 'NotUsed',
          firstName: 'NotUsed',
          lastName: 'NotUsed',
          address: 'NotUsed',
          jobTitle: 'NotUsed',
          phoneNumber: 'NotUsed',
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

    withStoreRender(
      <ModalProvider>
        <CreditCard expMonth={0} expYear={1970} lastFour={'4444'} brand={'visa'} onPaymentSuccess={onSuccess} />
      </ModalProvider>,
      {
        initialState: {},
      }
    );

    await waitFor(() => {
      expect(useSmbProfileMock).toBeCalled();
      expect(retrySubscriptionPaymentMock).not.toBeCalled();
      expect(onSuccess).not.toBeCalled();

      expect(queryByText(translations.t('profile.retryPayment') as string)).toBeNull();
    });
  });

  test('should DO NOT show retry payment button when card is expired and is refused', async () => {
    const { queryByText } = screen;

    const confirmCardPaymentStripeMock = jest.fn();
    useStripeMock.mockImplementation(() => {
      return {
        confirmCardPayment: confirmCardPaymentStripeMock,
      };
    });

    useSmbProfileMock.mockImplementation((condition: boolean) => {
      expect(condition).toBeTruthy();
      return {
        smbProfile: {
          companyId: 777,
          id: 0,
          languageIsoCode: 'NotUsed',
          username: 'NotUsed',
          email: 'NotUsed',
          firstName: 'NotUsed',
          lastName: 'NotUsed',
          address: 'NotUsed',
          jobTitle: 'NotUsed',
          phoneNumber: 'NotUsed',
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

    withStoreRender(
      <ModalProvider>
        <CreditCard expMonth={0} expYear={1970} lastFour={'4444'} brand={'visa'} onPaymentSuccess={onSuccess} />
      </ModalProvider>,
      {
        initialState: {},
      }
    );

    await waitFor(() => {
      expect(useSmbProfileMock).toBeCalled();
      expect(retrySubscriptionPaymentMock).not.toBeCalled();
      expect(onSuccess).not.toBeCalled();

      expect(queryByText(translations.t('profile.retryPayment') as string)).toBeNull();
    });
  });

  test('should show retry payment button when card is refused', async () => {
    const { queryByText } = screen;

    const confirmCardPaymentStripeMock = jest.fn();
    useStripeMock.mockImplementation(() => {
      return {
        confirmCardPayment: confirmCardPaymentStripeMock,
      };
    });

    useSmbProfileMock.mockImplementation((condition: boolean) => {
      expect(condition).toBeTruthy();
      return {
        smbProfile: {
          companyId: 777,
          id: 0,
          languageIsoCode: 'NotUsed',
          username: 'NotUsed',
          email: 'NotUsed',
          firstName: 'NotUsed',
          lastName: 'NotUsed',
          address: 'NotUsed',
          jobTitle: 'NotUsed',
          phoneNumber: 'NotUsed',
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

    withStoreRender(
      <ModalProvider>
        <CreditCard expMonth={0} expYear={2025} lastFour={'4444'} brand={'visa'} onPaymentSuccess={onSuccess} isPaymentRefused />
      </ModalProvider>,
      { initialState: {} }
    );

    await waitFor(() => {
      expect(useSmbProfileMock).toBeCalled();
      expect(retrySubscriptionPaymentMock).not.toBeCalled();
      expect(onSuccess).not.toBeCalled();

      expect(queryByText(translations.t('profile.retryPayment') as string)).not.toBeNull();
    });
  });

  test('should show error modal on click to payment button when network fails', async () => {
    const { getByText } = screen;

    const confirmCardPaymentStripeMock = jest.fn();
    useStripeMock.mockImplementation(() => {
      return {
        confirmCardPayment: confirmCardPaymentStripeMock,
      };
    });

    useSmbProfileMock.mockImplementation((condition: boolean) => {
      expect(condition).toBeTruthy();
      return {
        smbProfile: {
          companyId: 777,
          id: 0,
          languageIsoCode: 'NotUsed',
          username: 'NotUsed',
          email: 'NotUsed',
          firstName: 'NotUsed',
          lastName: 'NotUsed',
          address: 'NotUsed',
          jobTitle: 'NotUsed',
          phoneNumber: 'NotUsed',
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

    retrySubscriptionPaymentMock.mockImplementation((companyId) => {
      expect(companyId).toBe(777);
      return Promise.reject(new Error('Marker'));
    });

    withStoreRender(
      <ModalProvider>
        <CreditCard expMonth={0} expYear={2025} lastFour={'4444'} brand={'visa'} onPaymentSuccess={onSuccess} isPaymentRefused />
      </ModalProvider>,
      { initialState: {} }
    );

    const retryPayment = getByText(translations.t('profile.retryPayment') as string);

    expect(fireEvent.click(retryPayment)).toBeTruthy();

    await waitFor(() => {
      expect(useSmbProfileMock).toBeCalled();
      expect(retrySubscriptionPaymentMock).toBeCalled();
      expect(onSuccess).not.toBeCalled();
    });
  });

  test('should show error modal on click to payment button when server return unexpected status', async () => {
    const { getByText } = screen;

    const confirmCardPaymentStripeMock = jest.fn();
    useStripeMock.mockImplementation(() => {
      return {
        confirmCardPayment: confirmCardPaymentStripeMock,
      };
    });

    useSmbProfileMock.mockImplementation((condition: boolean) => {
      expect(condition).toBeTruthy();
      return {
        smbProfile: {
          companyId: 777,
          id: 0,
          languageIsoCode: 'NotUsed',
          username: 'NotUsed',
          email: 'NotUsed',
          firstName: 'NotUsed',
          lastName: 'NotUsed',
          address: 'NotUsed',
          jobTitle: 'NotUsed',
          phoneNumber: 'NotUsed',
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

    retrySubscriptionPaymentMock.mockImplementation((companyId) => {
      expect(companyId).toBe(777);
      return {
        data: {
          status: 'UNEXPECTED STATUS',
          clientSecret: 'secret',
          type: IntentType.SetupIntent,
        },
      };
    });

    withStoreRender(
      <ModalProvider>
        <CreditCard expMonth={0} expYear={2025} lastFour={'4444'} brand={'visa'} onPaymentSuccess={onSuccess} isPaymentRefused />
      </ModalProvider>,
      { initialState: {} }
    );

    const retryPayment = getByText(translations.t('profile.retryPayment') as string);

    fireEvent.click(retryPayment);

    await waitFor(() => {
      expect(useSmbProfileMock).toBeCalled();
      expect(retrySubscriptionPaymentMock).toBeCalled();

      expect(onSuccess).not.toBeCalled();
    });
  });

  test('should show error modal on click to payment button when Stripe fails', async () => {
    const { getByText } = screen;

    const confirmCardPaymentStripeMock = jest.fn();
    useStripeMock.mockImplementation(() => {
      return {
        confirmCardPayment: confirmCardPaymentStripeMock,
      };
    });

    useSmbProfileMock.mockImplementation((condition: boolean) => {
      expect(condition).toBeTruthy();
      return {
        smbProfile: {
          companyId: 777,
          id: 0,
          languageIsoCode: 'NotUsed',
          username: 'NotUsed',
          email: 'NotUsed',
          firstName: 'NotUsed',
          lastName: 'NotUsed',
          address: 'NotUsed',
          jobTitle: 'NotUsed',
          phoneNumber: 'NotUsed',
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

    retrySubscriptionPaymentMock.mockImplementation((companyId) => {
      expect(companyId).toBe(777);
      return Promise.resolve({
        data: {
          status: IntentStatus.RequiresAction,
          clientSecret: 'secret',
          type: IntentType.SetupIntent,
        },
      });
    });

    confirmCardPaymentStripeMock.mockImplementation((clientSecret) => {
      expect(clientSecret).toBe('secret');
      return Promise.resolve({ error: jest.fn(), paymentIntent: jest.fn() });
    });

    withStoreRender(
      <ModalProvider>
        <CreditCard expMonth={0} expYear={2025} lastFour={'4444'} brand={'visa'} onPaymentSuccess={onSuccess} isPaymentRefused />
      </ModalProvider>,
      { initialState: {} }
    );

    const retryPayment = getByText(translations.t('profile.retryPayment') as string);

    fireEvent.click(retryPayment);

    await waitFor(() => {
      expect(useSmbProfileMock).toBeCalled();
      expect(retrySubscriptionPaymentMock).toBeCalled();
      expect(confirmCardPaymentStripeMock).toBeCalled();
      expect(onSuccess).not.toBeCalled();
    });
  });

  test('should DO NOT show error modal and invoke onSuccess on click to payment button when server returns success', async () => {
    const { getByText } = screen;

    const confirmCardPaymentStripeMock = jest.fn();
    useStripeMock.mockImplementation(() => {
      return {
        confirmCardPayment: confirmCardPaymentStripeMock,
      };
    });

    useSmbProfileMock.mockImplementation((condition: boolean) => {
      expect(condition).toBeTruthy();
      return {
        smbProfile: {
          companyId: 777,
          id: 0,
          languageIsoCode: 'NotUsed',
          username: 'NotUsed',
          email: 'NotUsed',
          firstName: 'NotUsed',
          lastName: 'NotUsed',
          address: 'NotUsed',
          jobTitle: 'NotUsed',
          phoneNumber: 'NotUsed',
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

    retrySubscriptionPaymentMock.mockImplementation((companyId) => {
      expect(companyId).toBe(777);
      return Promise.resolve({
        data: {
          status: IntentStatus.Succeeded,
          clientSecret: 'secret',
          type: IntentType.SetupIntent,
        },
      });
    });

    withStoreRender(
      <ModalProvider>
        <CreditCard expMonth={0} expYear={2025} lastFour={'4444'} brand={'visa'} onPaymentSuccess={onSuccess} isPaymentRefused />
      </ModalProvider>,
      { initialState: {} }
    );

    const retryPayment = getByText(translations.t('profile.retryPayment') as string);

    fireEvent.click(retryPayment);

    await waitFor(() => {
      expect(useSmbProfileMock).toBeCalled();
      expect(retrySubscriptionPaymentMock).toBeCalled();
      expect(confirmCardPaymentStripeMock).not.toBeCalled();
      expect(onSuccess).toBeCalled();
    });
  });

  test('should DO NOT show error modal on click to payment button when Stripe confirmation has success', async () => {
    const { getByText } = screen;

    const confirmCardPaymentStripeMock = jest.fn();
    useStripeMock.mockImplementation(() => {
      return {
        confirmCardPayment: confirmCardPaymentStripeMock,
      };
    });

    useSmbProfileMock.mockImplementation((condition: boolean) => {
      expect(condition).toBeTruthy();
      return {
        smbProfile: {
          companyId: 777,
          id: 0,
          languageIsoCode: 'NotUsed',
          username: 'NotUsed',
          email: 'NotUsed',
          firstName: 'NotUsed',
          lastName: 'NotUsed',
          address: 'NotUsed',
          jobTitle: 'NotUsed',
          phoneNumber: 'NotUsed',
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

    retrySubscriptionPaymentMock.mockImplementation((companyId) => {
      expect(companyId).toBe(777);
      return Promise.resolve({
        data: {
          status: IntentStatus.RequiresAction,
          clientSecret: 'secret',
          type: IntentType.SetupIntent,
        },
      });
    });

    confirmCardPaymentStripeMock.mockImplementation((clientSecret) => {
      expect(clientSecret).toBe('secret');
      return Promise.resolve({ paymentIntent: undefined, error: undefined });
    });

    withStoreRender(
      <ModalProvider>
        <CreditCard expMonth={0} expYear={2025} lastFour={'4444'} brand={'visa'} onPaymentSuccess={onSuccess} isPaymentRefused />
      </ModalProvider>,
      { initialState: {} }
    );

    const retryPayment = getByText(translations.t('profile.retryPayment') as string);

    fireEvent.click(retryPayment);

    await waitFor(() => {
      expect(useSmbProfileMock).toBeCalled();
      expect(retrySubscriptionPaymentMock).toBeCalled();
      expect(confirmCardPaymentStripeMock).toBeCalled();
      expect(onSuccess).toBeCalled();
    });
  });
});
