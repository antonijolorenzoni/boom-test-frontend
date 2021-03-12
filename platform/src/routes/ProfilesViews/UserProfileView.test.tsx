import React from 'react';
import { cleanup, screen } from '@testing-library/react';
import translations from 'translations/i18next';
import i18Countries from 'i18n-iso-countries';
import { withStoreRender } from 'utils/test-utils';
import '@testing-library/jest-dom/extend-expect';
import UserProfileView from './UserProfileView';
import { USER_ROLES } from 'config/consts';
import { useSmbProfile } from 'hook/useSmbProfile';
import { usePaymentMethod } from 'hook/usePaymentMethod';
import { useOrganization } from 'hook/useOrganization';
import i18next from 'translations/i18next';
import { useSubscriptionWithRetry } from 'hook/useSubscriptionWithRetry';
import { ModalProvider } from 'hook/useModal';

afterEach(cleanup);

i18next.init({
  lng: 'en',
  fallbackLng: ['en', 'it'],
});

const error = jest.fn();
const mutate = jest.fn();
const exponentialRetry = jest.fn();

jest.mock('@stripe/react-stripe-js', () => ({
  useStripe: jest.fn(),
}));

jest.mock('hook/useSmbProfile', () => ({
  useSmbProfile: jest.fn(),
}));

const useSmbProfileMock = useSmbProfile as jest.Mock;

jest.mock('hook/useSubscriptionWithRetry', () => ({
  useSubscriptionWithRetry: jest.fn(),
}));

const useSubscriptionMock = useSubscriptionWithRetry as jest.Mock;

jest.mock('hook/usePaymentMethod', () => ({
  usePaymentMethod: jest.fn(),
}));

const usePaymentMethodMock = usePaymentMethod as jest.Mock;

jest.mock('hook/useOrganization', () => ({
  useOrganization: jest.fn(),
}));

const useOrganizationMock = useOrganization as jest.Mock;

describe('User profile view', () => {
  test('As SMB client, I want to see invitation to subscribe when unsubscribed', async () => {
    const { findByText } = screen;

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
          organization: 88888,
          roles: [],
          enabled: true,
          deleted: true,
        },
        error,
        mutate,
      };
    });

    useSubscriptionMock.mockImplementation((condition: boolean, companyId?: number) => {
      return {
        subscription: {
          billingInfoDto: {
            address: 'maple street 23',
            city: 'London',
            corporateName: 'ACME inc.',
            country: 'it',
            sdiCode: 'e456dv8',
            vatNumber: 'NL999999999B01',
            zipCode: 'A123Z',
          },
          createdAt: '2020-12-02T09:30:00.000+0000',
          currentPeriodEnd: '2020-12-25T09:30:00.000+0000',
          remainingTrialDays: 15,
          subscriptionId: 'f0a9aa86-8b38-4bd7-8c88-89117d006367',
          subscriptionStatus: 'UNSUBSCRIBED',
        },
        isSubscribed: false,
        isActive: false,
        isTrialing: false,
        isUnsubscribedActive: false,
        isUnsubscribed: true,
        isUnsubscribedGrace: false,
        isCancelled: false,
        error,
        mutate,
        exponentialRetry,
      };
    });

    usePaymentMethodMock.mockImplementation((condition: boolean, companyId?: number) => {
      return {
        paymentMethod: undefined,
        error,
        mutate,
      };
    });

    useOrganizationMock.mockImplementation((condition: boolean, organizationId?: number) => {
      return {
        organization: undefined,
        error,
        mutate,
      };
    });

    withStoreRender(
      <ModalProvider>
        <UserProfileView />
      </ModalProvider>,
      {
        initialState: {
          user: {
            data: {
              authorities: [USER_ROLES.ROLE_SMB],
            },
          },
        },
      }
    );

    expect(await findByText(translations.t('subscription.expiredTitle') as string)).not.toBeNull();
    expect(await findByText(translations.t('subscription.subscribeAction') as string)).not.toBeNull();
    expect(await findByText(translations.t('subscription.subscribeLink') as string)).not.toBeNull();

    expect(useSmbProfileMock).toHaveBeenNthCalledWith(1, true);
    expect(useSubscriptionMock).toHaveBeenCalled();
    expect(usePaymentMethodMock).toHaveBeenNthCalledWith(1, true, 777);
    expect(useOrganizationMock).toHaveBeenNthCalledWith(1, true, 88888);
  });

  test('As SMB client, I want to see my profile when subscription is active', async () => {
    const { findByText } = screen;

    useSmbProfileMock.mockImplementation((condition: boolean) => {
      return {
        smbProfile: {
          companyId: 777,
          id: 0,
          languageIsoCode: 'string',
          username: 'string',
          email: 'johnny@mail.com',
          firstName: 'Johnny',
          lastName: 'Silverhand',
          address: 'string',
          jobTitle: 'string',
          phoneNumber: '+393394443377',
          language: 'ENGLISH',
          activationDate: 0,
          organization: 88888,
          roles: [],
          enabled: true,
          deleted: true,
        },
        error,
        mutate,
      };
    });

    useSubscriptionMock.mockImplementation((condition: boolean, companyId?: number) => {
      return {
        subscription: {
          billingInfoDto: {
            address: 'maple street 23',
            city: 'London',
            corporateName: 'ACME inc.',
            country: 're',
            sdiCode: 'e456dv8',
            vatNumber: 'NL999999999B01',
            zipCode: 'A123Z',
          },
          createdAt: '2020-12-02T09:30:00.000+0000',
          currentPeriodEnd: '2020-12-25T09:30:00.000+0000',
          remainingTrialDays: 15,
          subscriptionId: 'f0a9aa86-8b38-4bd7-8c88-89117d006367',
          subscriptionStatus: 'SUBSCRIBED',
        },
        isSubscribed: false,
        isActive: false,
        isTrialing: false,
        isUnsubscribedActive: true,
        isUnsubscribed: false,
        isUnsubscribedGrace: false,
        isCancelled: false,
        error,
        mutate,
        exponentialRetry,
      };
    });

    usePaymentMethodMock.mockImplementation((condition: boolean, companyId?: number) => {
      return {
        paymentMethod: {
          brand: 'visa',
          expMonth: 12,
          expYear: 2021,
          lastFour: '4242',
        },
        error,
        mutate,
      };
    });

    useOrganizationMock.mockImplementation((condition: boolean, organizationId?: number) => {
      return {
        organization: {
          createdAt: 1604333687,
          domain: 'awesome.boom.co',
          id: 5,
          name: 'Awesome Organization',
          tier: 'enterprise',
          segment: 'enterprise',
          updatedAt: 1604333687,
        },
        error,
        mutate,
      };
    });

    withStoreRender(
      <ModalProvider>
        <UserProfileView />
      </ModalProvider>,
      {
        initialState: {
          user: {
            data: {
              authorities: [USER_ROLES.ROLE_SMB],
            },
          },
        },
      }
    );

    expect(await findByText(/Johnny Silverhand/i)).not.toBeNull();
    expect(await findByText(/English/i)).not.toBeNull();
    expect(await findByText(/\+393394443377/i)).not.toBeNull();
    expect(await findByText(/johnny@mail.com/i)).not.toBeNull();

    expect(await findByText(/ends with 4242/i)).not.toBeNull();
    expect(await findByText(/December 2021/i)).not.toBeNull();

    expect(await findByText(/Awesome Organization/i)).not.toBeNull();
    expect(await findByText(/NL999999999B01/i)).not.toBeNull();

    expect(await findByText(/maple street 23/i)).not.toBeNull();
    expect(await findByText(/London/i)).not.toBeNull();
    expect(await findByText(/A123Z/i)).not.toBeNull();
    expect(await findByText(i18Countries.getName('re', 'en'))).not.toBeNull();

    expect(useSmbProfileMock).toHaveBeenNthCalledWith(1, true);
    expect(useSubscriptionMock).toHaveBeenCalled();
    expect(usePaymentMethodMock).toHaveBeenNthCalledWith(1, true, 777);
    expect(useOrganizationMock).toHaveBeenNthCalledWith(1, true, 88888);
  });
});
