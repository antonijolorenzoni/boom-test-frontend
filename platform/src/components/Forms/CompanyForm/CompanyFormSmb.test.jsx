import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import translations from 'translations/i18next';
import { LANGUAGE_LOCAL_MAP } from 'config/consts';
import { CompanyFormSmb } from './CompanyFormSmb';
import { withStoreRender } from 'utils/test-utils';

beforeEach(jest.clearAllMocks);

const photoTypesList = [
  { id: 1, type: 'FOOD' },
  { id: 2, type: 'PRODUCTS' },
  { id: 3, type: 'REAL_ESTATE' },
  { id: 4, type: 'EVENTS' },
];

const company = {
  createdAt: 1606314944000,
  id: 2,
  company: 2,
  name: 'company',
  tier: 'enterprise',
  updatedAt: 1606354944000,
  organization: 2,
  parentCompany: 1,
  address: null,
  email: null,
  language: 'en',
  phoneNumber: '+393333333333',
  photoTypes: [{ id: 3, type: 'REAL_ESTATE' }],
  googleAuthorized: true,
  logo: null,
};

const companyEmpty = {
  createdAt: 1606314944000,
  id: 2,
  company: 2,
  name: '',
  tier: 'enterprise',
  updatedAt: 1606354944000,
  organization: 2,
  parentCompany: 1,
  address: null,
  email: null,
  language: '',
  phoneNumber: '',
  photoTypes: [],
  googleAuthorized: true,
  logo: null,
};

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
        vatRate: '22',
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

jest.mock('api/instances/googlePlacesInstance', () => ({
  onFetchGooglePlacesOptions: (value, token) =>
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

const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();

translations.changeLanguage(LANGUAGE_LOCAL_MAP.ENGLISH.key);

test.skip('required fields submitting empty form', async () => {
  render(<CompanyFormSmb company={companyEmpty} photoTypesList={photoTypesList} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

  expect(screen.queryByTestId('company-form-smb')).toBeInTheDocument();

  await waitFor(() => fireEvent.click(screen.getByText(translations.t('forms.save'))));

  expect(screen.getByText(translations.t('forms.companyName'))?.parentElement?.lastElementChild?.textContent).toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('forms.phone'))?.parentElement?.lastElementChild?.textContent).toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('languages.language'))?.parentElement?.lastElementChild?.textContent).toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('forms.photoTypes'))?.parentElement?.lastElementChild?.textContent).toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('smb.corporateName'))?.parentElement?.lastElementChild?.textContent).toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('smb.vatNumber'))?.parentElement?.lastElementChild?.textContent).toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('smb.country'))?.parentElement?.lastElementChild?.textContent).toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('smb.address'))?.parentElement?.lastElementChild?.textContent).toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('smb.city'))?.parentElement?.lastElementChild?.textContent).toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('smb.zipCode'))?.parentElement?.lastElementChild?.textContent).toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('smb.sdiCodePecEmail'))?.parentElement?.lastElementChild?.textContent).not.toBe(
    translations.t('forms.error.required')
  );

  expect(mockOnSubmit).not.toBeCalled();
});

test('submit form without errors', async () => {
  withStoreRender(<CompanyFormSmb company={company} photoTypesList={photoTypesList} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />, {
    initialState: { user: { data: { organization: 1 } } },
  });

  await waitFor(() => screen.findByTestId('company-form-smb'));

  act(() => {
    fireEvent.change(screen.getByLabelText(translations.t('forms.phone')), { target: { value: '+393393334433' } });
  });

  expect(screen.getByText(translations.t('forms.companyName'))?.parentElement?.lastElementChild?.textContent).not.toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('forms.phone'))?.parentElement?.lastElementChild?.textContent).not.toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('languages.language'))?.parentElement?.lastElementChild?.textContent).not.toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('forms.photoTypes'))?.parentElement?.lastElementChild?.textContent).not.toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('smb.corporateName'))?.parentElement?.lastElementChild?.textContent).not.toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('smb.vatNumber'))?.parentElement?.lastElementChild?.textContent).not.toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('smb.country'))?.parentElement?.lastElementChild?.textContent).not.toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('smb.address'))?.parentElement?.lastElementChild?.textContent).not.toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('smb.city'))?.parentElement?.lastElementChild?.textContent).not.toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('smb.zipCode'))?.parentElement?.lastElementChild?.textContent).not.toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('smb.sdiCodePecEmail'))?.parentElement?.lastElementChild?.textContent).not.toBe(
    translations.t('forms.error.required')
  );

  expect(screen.queryByText(translations.t('forms.save'))).toBeInTheDocument();

  await waitFor(() => fireEvent.click(screen.getByText(translations.t('forms.save'))));

  expect(mockOnSubmit).toBeCalledTimes(1);
  expect(mockOnSubmit).toBeCalledWith(
    {
      ...company,
      name: 'company',
      phoneNumber: '+393393334433',
      photoTypes: [3],
      language: 'ENGLISH',
      logo: '',
    },
    {
      address: 'Viale San Marco 300',
      city: 'Venezia',
      corporateName: 'My corporate name',
      country: 'it',
      sdiCode: 'cccc',
      vatNumber: 'xxxx1234',
      vatRate: '22',
      zipCode: '30173',
    }
  );
});
