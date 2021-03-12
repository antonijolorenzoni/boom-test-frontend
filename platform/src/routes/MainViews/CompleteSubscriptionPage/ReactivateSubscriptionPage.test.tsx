import React from 'react';
import { screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import translations from 'translations/i18next';
import { MemoryRouter } from 'react-router-dom';

import { withStoreRender } from 'utils/test-utils';

import { ReactivateSubscriptionPage } from './ReactivateSubscriptionPage';
import { confirmAndSubscribe } from 'api/paymentsAPI';
import { LANGUAGE_LOCAL_MAP } from 'config/consts';
import selectEvent from 'react-select-event';

beforeEach(jest.clearAllMocks);

jest.mock('@stripe/react-stripe-js', () => ({
  useStripe: jest.fn(),
}));

jest.mock('hook/useSmbProfile', () => ({
  useSmbProfile: () => ({
    smbProfile: {
      firstName: 'Mario',
      lastName: 'Rossi',
      phoneNumber: null,
      email: 'mario@rossi.it',
      languageIsoCode: 'en',
      companyId: 1002,
      organization: 1000,
    },
    error: undefined,
  }),
}));

jest.mock('hook/useSubscription', () => ({
  useSubscription: () => ({
    subscription: {
      billingInfoDto: {
        address: 'Viale San Marco 300',
        city: 'Venezia',
        corporateName: 'My corporate name',
        country: 'it',
        sdiCode: 'cccc',
        vatNumber: 'xxxx1234',
        zipCode: '30173',
      },
      createdAt: '2020-12-24T11:02:57.000+0000',
      currentPeriodEnd: '2021-01-23T11:02:56.000+0000',
      remainingTrialDays: 29,
      subscriptionId: '327188cc-ddcf-4b2e-b82f-1af4939d8304',
      subscriptionStatus: 'TRIALING',
    },
    isUnsubscribed: true,
    error: undefined,
  }),
}));

jest.mock('hook/usePaymentMethodById', () => ({
  usePaymentMethodById: (condition: boolean, { companyId, paymentMethodId }: { companyId: number; paymentMethodId: string }) => ({
    paymentMethod: undefined,
    error: undefined,
    mutate: jest.fn(),
  }),
}));

jest.mock('hook/useOrganization', () => ({ useOrganization: () => ({ organization: { name: 'org name' } }) }));

jest.mock('api/paymentsAPI', () => ({
  confirmAndSubscribe: jest.fn(),
  cancelCard: jest.fn().mockReturnValue(Promise.resolve()),
}));

jest.mock('api/userAPI', () => ({ updateUser: jest.fn() }));

jest.mock('api/instances/googlePlacesInstance', () => ({
  onFetchGooglePlacesOptions: (value: string, token: string) =>
    Promise.resolve([
      {
        label: 'Viale San Marco, 300, Venice, Metropolitan City of Venice, Italy',
        value:
          'EkBWaWFsZSBTYW4gTWFyY28sIDMwMCwgVmVuaWNlLCBNZXRyb3BvbGl0YW4gQ2l0eSBvZiBWZW5pY2UsIEl0YWx5IjESLwoUChIJHeCu8we0fkcRcvFe6LOURLcQrAIqFAoSCdOQzooOtH5HEbGZFChGYR36',
      },
    ]),

  fetchGoogleAddressDetails: () =>
    Promise.resolve({
      country: 'Italy',
      countryCode: 'IT',
      formattedAddress: 'Viale S. Marco, 300, 30173 Venezia VE, Italy',
      location: { latitude: 45.4810263, longitude: 12.2618412 },
      placeId: 'EixWaWFsZSBTLiBNYXJjbywgMzAwLCAzMDE3MyBWZW5lemlhIFZFLCBJdGFseSIbEhkKFAoSCR3grvMHtH5HEXLxXuizlES3EKwC',
      postalCode: '30173',
      street: 'Viale San Marco',
      street_number: '300',
      timezone: 'Europe/Rome',
    }),
}));

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useHistory: () => ({
    push: mockHistoryPush,
    location: {
      pathname: '/subscription',
    },
  }),
}));

translations.changeLanguage(LANGUAGE_LOCAL_MAP.ENGLISH.key);

test('required fields submitting empty form', async () => {
  withStoreRender(<ReactivateSubscriptionPage AddCreditCardPanelComponent={() => <div>fake</div>} />, {
    initialState: {},
    container: document.body,
  });

  await waitFor(() => screen.findByTestId('complete-subscription-page-wrapper'));

  fireEvent.change(screen.getByLabelText(translations.t('smb.corporateName') as string), { target: { value: '' } });
  fireEvent.change(screen.getByLabelText(translations.t('smb.vatNumber') as string), { target: { value: '' } });

  await selectEvent.clearFirst(screen.getByLabelText(translations.t('smb.country') as string));

  await waitFor(() => fireEvent.click(screen.getByText(translations.t('smb.confirmAndSubscribe') as string)));

  expect(screen.getByText(translations.t('smb.corporateName') as string)?.parentElement?.parentElement?.lastElementChild?.textContent).toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('smb.vatNumber') as string)?.parentElement?.parentElement?.lastElementChild?.textContent).toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('smb.country') as string)?.parentElement?.lastElementChild?.textContent).toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('smb.address') as string)?.parentElement?.lastElementChild?.textContent).toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('smb.city') as string)?.parentElement?.parentElement?.lastElementChild?.textContent).toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('smb.zipCode') as string)?.parentElement?.parentElement?.lastElementChild?.textContent).toBe(
    translations.t('forms.error.required')
  );

  expect(
    screen.getByText(translations.t('smb.sdiCodePecEmail') as string)?.parentElement?.parentElement?.lastElementChild?.textContent
  ).not.toBe(translations.t('forms.error.required'));

  expect(within(screen.getByTestId('no-card-wrapper')).getByText(translations.t('forms.error.required') as string));
  expect(confirmAndSubscribe).not.toBeCalled();
});

// fixme
test.skip('submit form without errors', async () => {
  withStoreRender(
    <ReactivateSubscriptionPage
      AddCreditCardPanelComponent={({ _, _1, onConfirmAdding }) => (
        <div data-testid="fake-add-cc-panel" onClick={() => onConfirmAdding('fake_paymentMethod')}></div>
      )}
    />,
    {
      initialState: {},
      container: document.body,
    }
  );

  screen.findByTestId('complete-subscription-page-wrapper');

  fireEvent.click(screen.getByText(translations.t('smb.addCreditCard') as string));
  fireEvent.click(screen.getByTestId('fake-add-cc-panel'));
  fireEvent.click(screen.getByText(translations.t('smb.confirmAndSubscribe') as string));

  await waitFor(() => expect(confirmAndSubscribe).toBeCalledTimes(1));

  await waitFor(() =>
    expect(confirmAndSubscribe).toBeCalledWith(1002, {
      city: 'Venezia',
      corporateName: 'My corporate name',
      sdiCode: 'cccc',
      vatNumber: 'xxxx1234',
      zipCode: '30173',
      country: 'it',
      address: 'Viale San Marco 300',
    })
  );
});

test('redirect to profile page when click on cancel', async () => {
  withStoreRender(
    <MemoryRouter>
      <ReactivateSubscriptionPage AddCreditCardPanelComponent={() => <div>fake</div>} />
    </MemoryRouter>,
    { initialState: {}, container: document.body }
  );

  screen.findByTestId('complete-subscription-page-wrapper');

  fireEvent.click(screen.getByText(translations.t('general.cancel') as string));

  await waitFor(() => {
    expect(screen.queryByTestId('smb-cancel-landing')).not.toBeInTheDocument();
    expect(mockHistoryPush).toBeCalledTimes(1);
    expect(mockHistoryPush).toBeCalledWith('/profile');
  });
});
