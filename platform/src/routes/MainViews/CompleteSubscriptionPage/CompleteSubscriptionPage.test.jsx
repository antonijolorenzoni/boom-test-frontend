import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen, fireEvent, waitFor, within } from '@testing-library/react';
import selectEvent from 'react-select-event';
import translations from 'translations/i18next';

import { withStoreRender } from 'utils/test-utils';

import { CompleteSubscriptionPage } from '.';
import { confirmAndSubscribe, cancelCard } from 'api/paymentsAPI';
import BaseAlert from 'components/Modals/BaseAlert';
import { LANGUAGE_LOCAL_MAP } from 'config/consts';
import { onFetchGooglePlacesOptions } from 'api/instances/googlePlacesInstance';

beforeEach(jest.clearAllMocks);

jest.mock('@stripe/react-stripe-js', () => ({
  useStripe: jest.fn(),
}));

jest.mock('hook/useSmbProfile', () => ({
  useSmbProfile: () => ({
    smbProfile: {
      firstName: 'Ste',
      lastName: 'Arm',
      phoneNumber: null,
      email: 'ste@smb.it',
      languageIsoCode: 'en',
      companyId: 1002,
      organization: 1000,
    },
    error: undefined,
  }),
}));

jest.mock('hook/usePaymentMethodById', () => ({
  usePaymentMethodById: (condition, { companyId, paymentMethodId }) => ({ paymentMethod: undefined, error: undefined, mutate: jest.fn() }),
}));

jest.mock('hook/useOrganization', () => ({ useOrganization: () => ({ organization: { name: 'org name' } }) }));
jest.mock('hook/useSubscription', () => ({ useSubscription: () => ({ subscription: undefined, error: undefined }) }));

jest.mock('api/paymentsAPI', () => ({
  confirmAndSubscribe: jest.fn(),
  cancelCard: jest.fn().mockReturnValue(Promise.resolve()),
}));

jest.mock('api/userAPI', () => ({ updateUser: jest.fn() }));

jest.mock('api/instances/googlePlacesInstance', () => ({
  onFetchGooglePlacesOptions: jest.fn((value, token) =>
    Promise.resolve([
      {
        value:
          'EjdDb3JzbyBNYWdlbnRhLCBNaWxhbiwgTWV0cm9wb2xpdGFuIENpdHkgb2YgTWlsYW4sIEl0YWx5Ii4qLAoUChIJLfawmlDBhkcRX8dY63xh_1wSFAoSCed1Ej9JwYZHEY0OdMYTzf88',
        label: 'Straße des 17. Juni',
      },
    ])
  ),
  fetchGoogleAddressDetails: jest.fn(() =>
    Promise.resolve({
      placeId: 'ChIJ4edudVzBhkcRHP7WsU-4aSM',
      street: 'Straße des 17. Juni',
      street_number: undefined,
      city: 'Berlin',
      timezone: 'Europe/Berlin',
    })
  ),
}));

translations.changeLanguage(LANGUAGE_LOCAL_MAP.ENGLISH.key);

test('required fields submitting empty form', async () => {
  withStoreRender(
    <MemoryRouter>
      <CompleteSubscriptionPage AddCreditCardPanelComponent={() => <div>fake</div>} />
    </MemoryRouter>,
    { initialState: {} }
  );

  await waitFor(() => screen.findByTestId('complete-subscription-page-wrapper'));
  await waitFor(() => fireEvent.click(screen.getByText(translations.t('smb.confirmAndSubscribe'))));

  expect(screen.getByText(translations.t('smb.phoneNumber'))?.parentElement?.lastElementChild?.textContent).toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('smb.corporateName'))?.parentElement?.parentElement?.lastElementChild?.textContent).toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('smb.vatNumber'))?.parentElement?.parentElement?.lastElementChild?.textContent).toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('smb.country'))?.parentElement?.lastElementChild?.textContent).toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('smb.address'))?.parentElement?.lastElementChild?.textContent).toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('smb.city'))?.parentElement?.parentElement?.lastElementChild?.textContent).toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('smb.zipCode'))?.parentElement?.parentElement?.lastElementChild?.textContent).toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('smb.sdiCodePecEmail'))?.parentElement?.parentElement?.lastElementChild?.textContent).toBe('');

  const countryDropdown = screen.getByLabelText(translations.t('smb.country'));
  fireEvent.focus(countryDropdown);
  fireEvent.change(countryDropdown, { target: { value: 'Ital' } });

  await waitFor(() => fireEvent.click(screen.getAllByText('Italy')[1]));
  await waitFor(() => fireEvent.blur(countryDropdown));

  expect(screen.getByText(translations.t('smb.sdiCodePecEmail'))?.parentElement?.parentElement?.lastElementChild?.textContent).toBe(
    translations.t('forms.error.required')
  );

  expect(within(screen.getByTestId('no-card-wrapper')).getByText(translations.t('forms.error.required')));
  expect(confirmAndSubscribe).not.toBeCalled();
});

test('submit form without errors', async () => {
  // to avoid verbose stuff using Bottega's modal lol :>
  window.console.warn = jest.fn();
  window.console.error = jest.fn();

  withStoreRender(
    <MemoryRouter>
      <CompleteSubscriptionPage
        AddCreditCardPanelComponent={({ _, _1, onConfirmAdding }) => (
          <div data-testid="fake-add-cc-panel" onClick={() => onConfirmAdding('fake_paymentMethod')}></div>
        )}
      />
      <BaseAlert />
    </MemoryRouter>,
    { initialState: {} }
  );

  await waitFor(() => screen.findByTestId('complete-subscription-page-wrapper'));

  await selectEvent.select(screen.getByLabelText(translations.t('smb.language')), ['Italian']);
  fireEvent.change(screen.getByLabelText(translations.t('smb.phoneNumber')), { target: { value: '+393393334433' } });

  fireEvent.change(screen.getByLabelText(translations.t('smb.corporateName')), { target: { value: 'My corporate name' } });
  fireEvent.change(screen.getByLabelText(translations.t('smb.vatNumber')), { target: { value: '0000000000000' } });

  selectEvent.select(screen.getByLabelText(translations.t('smb.country')), ['Germany']);

  fireEvent.change(screen.getByLabelText(translations.t('smb.address')), { target: { value: 'Stra' } });

  await waitFor(() => expect(onFetchGooglePlacesOptions).toBeCalled(), { timeout: 2000 });

  await selectEvent.select(screen.getByLabelText(translations.t('smb.address')), ['Straße des 17. Juni']);

  fireEvent.change(screen.getByLabelText(translations.t('smb.zipCode')), { target: { value: 'XXXXXX' } });

  fireEvent.click(screen.getByText(translations.t('smb.addCreditCard')));
  fireEvent.click(screen.getByTestId('fake-add-cc-panel'));
  fireEvent.click(screen.getByText(translations.t('smb.confirmAndSubscribe')));

  await waitFor(() => expect(confirmAndSubscribe).toBeCalledTimes(1));

  expect(confirmAndSubscribe).toBeCalledWith(1002, {
    city: 'Berlin',
    corporateName: 'My corporate name',
    sdiCode: '',
    vatNumber: '0000000000000',
    zipCode: 'XXXXXX',
    country: 'de',
    address: 'Straße des 17. Juni',
  });
}, 10000);

test('cancel landing page is visible when click on cancel', async () => {
  withStoreRender(
    <MemoryRouter>
      <CompleteSubscriptionPage AddCreditCardPanelComponent={() => <div>fake</div>} />
    </MemoryRouter>,
    { initialState: {} }
  );

  await waitFor(() => screen.findByTestId('complete-subscription-page-wrapper'));

  fireEvent.click(screen.getByText(translations.t('general.cancel')));
  screen.getByTestId('smb-cancel-landing');

  await waitFor(() => expect(cancelCard).toBeCalledTimes(1));
  expect(cancelCard).toBeCalledWith(1002);
});
