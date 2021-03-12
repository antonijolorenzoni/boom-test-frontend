import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { cleanup, screen, fireEvent, waitFor } from '@testing-library/react';

import translations from 'translations/i18next';
import { NewOrderFormForSubscribers } from './NewOrderFormForSubscribers';
import { withStoreRender } from 'utils/test-utils';
import { useSmbProfile } from 'hook/useSmbProfile';
import { ModalProvider } from 'hook/useModal';

const REQUIRED = 'Required';

const key = (value: string) => translations.t(`forms.${value}`);

const api = {
  fetchOrganizations: jest.fn(),
  fetchOrganizationCompanies: jest.fn(),
  fetchCompanyPricingPackage: jest.fn(),
  fetchCompanyDetails: jest.fn(),
  onFetchGooglePlacesOptions: jest.fn(),
  fetchGoogleAddressDetails: jest.fn(),
  createShooting: jest.fn(),
};

const onCreateOrderCompletedMock = jest.fn();
const error = jest.fn();
const mutate = jest.fn();

jest.mock('hook/useSmbProfile', () => ({
  useSmbProfile: jest.fn(),
}));

jest.mock('@stripe/react-stripe-js', () => ({
  useStripe: jest.fn(),
}));

const useSmbProfileMock = useSmbProfile as jest.Mock;

jest.mock('config/featureFlags', () => ({ featureFlag: { isFeatureEnabled: () => true } }));

afterEach(cleanup);

describe('New order form for subscribers', () => {
  test('As Client, I expect get validation errors on submit empty forms', async () => {
    const { getByLabelText, getByText, getAllByText } = screen;

    useSmbProfileMock.mockImplementation((condition: boolean) => {
      return {
        smbProfile: undefined,
        error,
        mutate,
      };
    });

    withStoreRender(
      <ModalProvider>
        <NewOrderFormForSubscribers api={api} onCancel={() => {}} onCreateOrderCompleted={onCreateOrderCompletedMock} />
      </ModalProvider>,
      {}
    );

    await waitFor(() => fireEvent.click(getByText(translations.t('general.confirm') as string)));

    expect(getByLabelText(key('newOrder.orderName'))?.parentElement?.lastElementChild?.textContent).toBe(REQUIRED);
    expect(getAllByText(key('newOrder.pricingPackage'))[1]?.parentElement?.lastElementChild?.textContent).toBe(REQUIRED);
    expect(getByText(key('contactName'))?.parentElement?.parentElement?.lastElementChild?.textContent).toBe(REQUIRED);
    expect(getByText(key('contactPhone'))?.parentElement?.lastElementChild?.textContent).toBe(REQUIRED);
    expect(getByText(key('additionalContactPhone'))?.parentElement?.lastElementChild?.textContent).not.toBe(REQUIRED);
    expect(getAllByText(key('contactEmail'))[0].parentElement?.parentElement?.lastElementChild?.textContent).toBe(REQUIRED);
    expect(getByText(key('fullAddress'))?.parentElement?.lastElementChild?.textContent).toBe(REQUIRED);
  });

  test('As Client, I expect get partial validation errors on submit empty forms', async () => {
    const { getByLabelText, getByText, getAllByText } = screen;

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

    withStoreRender(
      <ModalProvider>
        <NewOrderFormForSubscribers api={api} onCancel={() => {}} onCreateOrderCompleted={onCreateOrderCompletedMock} />
      </ModalProvider>,
      {}
    );

    await waitFor(() => fireEvent.click(getByText(translations.t('general.confirm') as string)));

    expect(getByLabelText(key('newOrder.orderName'))?.parentElement?.lastElementChild?.textContent).toBe(REQUIRED);
    expect(getAllByText(key('newOrder.pricingPackage'))[1]?.parentElement?.lastElementChild?.textContent).toBe(REQUIRED);

    expect(getByText(key('contactName'))?.parentElement?.lastElementChild?.textContent).not.toBe(REQUIRED);
    expect(getByText(key('contactPhone'))?.parentElement?.lastElementChild?.textContent).not.toBe(REQUIRED);
    expect(getByText(key('additionalContactPhone'))?.parentElement?.lastElementChild?.textContent).not.toBe(REQUIRED);
    expect(getAllByText(key('contactEmail'))[0].parentElement?.lastElementChild?.textContent).not.toBe(REQUIRED);

    expect(getByText(key('fullAddress'))?.parentElement?.lastElementChild?.textContent).toBe(REQUIRED);
  });
});
