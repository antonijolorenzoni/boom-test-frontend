import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import translations from 'translations/i18next';
import { NewOrderForm } from '.';
import { withStoreRender } from 'utils/test-utils';
import '@testing-library/jest-dom/extend-expect';
import { USER_ROLES } from 'config/consts';

import { fetchOrganizations } from 'api/organizationsAPI';
import { fetchCompanyDetails, fetchCompanyPricingPackage, fetchOrganizationCompanies } from 'api/companiesAPI';
import { fetchGoogleAddressDetails, onFetchGooglePlacesOptions } from 'api/instances/googlePlacesInstance';
import { createShooting } from 'api/shootingsAPI';

const REQUIRED = 'Required';

const key = (value) => translations.t(`forms.${value}`);

beforeEach(jest.clearAllMocks);

jest.mock('axios', () => {
  const axios = jest.requireActual('axios');
  axios.create = jest.fn().mockImplementation(() => axios);
  axios.get = jest.fn();

  return axios;
});

jest.mock('api/organizationsAPI', () => ({
  fetchOrganizations: jest.fn(),
}));

jest.mock('api/companiesAPI', () => ({
  fetchOrganizationCompanies: jest.fn(),
  fetchCompanyPricingPackage: jest.fn(),
  fetchCompanyDetails: jest.fn(),
}));

jest.mock('api/instances/googlePlacesInstance', () => ({
  onFetchGooglePlacesOptions: jest.fn(),
  fetchGoogleAddressDetails: jest.fn(),
}));

jest.mock('api/shootingsAPI', () => ({
  createShooting: jest.fn(),
}));

jest.mock('config/featureFlags', () => ({ featureFlag: { isFeatureEnabled: () => true } }));

const onCreateOrderCompletedMock = jest.fn();

describe('New order form', () => {
  test('As Admin, I expect get validation errors on submit empty forms', async () => {
    const { getByLabelText, getByText, getAllByText } = screen;

    jest.mock('axios', () => {
      const axios = jest.requireActual('axios');

      axios.create = jest.fn().mockImplementation(() => axios);

      axios.get = jest.fn().mockImplementation((url) => {
        if (url === '/api/v1/organizations/888') {
          return Promise.resolve({
            data: { name: 'organization-name', id: 888 },
          });
        }

        return Promise.reject('Not mocked call!');
      });

      return axios;
    });

    withStoreRender(<NewOrderForm onCancel={() => {}} onCreateOrderCompleted={onCreateOrderCompletedMock} />, {
      initialState: {
        user: {
          data: {
            organization: 1,
            roles: [{ id: 1, name: USER_ROLES.ROLE_ADMIN }],
          },
        },
      },
    });

    fireEvent.click(getByText(translations.t('general.confirm')));

    await waitFor(() => expect(getByLabelText(key('newOrder.orderName'))?.parentElement?.lastElementChild?.textContent).toBe(REQUIRED));
    await waitFor(() => expect(getByText(key('newOrder.organizationName'))?.parentElement?.lastElementChild?.textContent).toBe(REQUIRED));
    await waitFor(() => expect(getByText(key('newOrder.companyName'))?.parentElement?.lastElementChild?.textContent).toBe(REQUIRED));
    await waitFor(() => expect(getByText(key('newOrder.pricingPackage'))?.parentElement?.lastElementChild?.textContent).toBe(REQUIRED));
    await waitFor(() => expect(getByText(key('contactName'))?.parentElement?.parentElement?.lastElementChild?.textContent).toBe(REQUIRED));
    await waitFor(() => expect(getByText(key('contactPhone'))?.parentElement?.lastElementChild?.textContent).toBe(REQUIRED));
    await waitFor(() => expect(getByText(key('additionalContactPhone'))?.parentElement?.lastElementChild?.textContent).not.toBe(REQUIRED));
    await waitFor(() =>
      expect(getAllByText(key('contactEmail'))[0].parentElement?.parentElement?.lastElementChild?.textContent).toBe(REQUIRED)
    );
    await waitFor(() => expect(getByText(key('fullAddress'))?.parentElement?.lastElementChild?.textContent).toBe(REQUIRED));
  });

  test('As Admin, I expect see summary page on submit forms correctly', async () => {
    const { getByRole, getByLabelText, getByText, findByText, getAllByLabelText, findByLabelText, queryByText } = screen;

    jest.mock('axios', () => {
      const axios = jest.requireActual('axios');

      axios.create = jest.fn().mockImplementation(() => axios);

      axios.get = jest.fn().mockImplementation((url) => {
        if (url === '/api/v1/organizations/1') {
          return Promise.resolve({
            data: { name: 'organization-name', id: 1 },
          });
        }

        return Promise.reject('Not mocked call!');
      });

      return axios;
    });

    fetchOrganizations.mockImplementation(() =>
      Promise.resolve({
        data: {
          content: [{ name: 'organization-name', id: 1 }],
        },
      })
    );

    fetchCompanyDetails.mockImplementation(() =>
      Promise.resolve({
        data: {
          id: 0,
          company: 0,
          email: 'mr@company.com',
          address: 'string',
          phoneNumber: 'string',
          language: 'string',
          photoTypes: [
            {
              id: 0,
              type: 'string',
            },
          ],
          googleAuthorized: true,
        },
      })
    );

    fetchCompanyPricingPackage.mockImplementation(() =>
      Promise.resolve({
        data: [
          {
            id: 333,
            name: 'XL',
            photosQuantity: 10,
            shootingDuration: 60,
            companyPrice: 200.0,
            photographerEarning: 400.0,
            photoType: { id: 3, type: 'REAL_ESTATE' },
            authorizedCompanies: [
              { id: 986, name: 'ACompany', organization: 15, parentCompany: 15, createdAt: 1604488837000, updatedAt: 1604488837000 },
            ],
            organizationId: 15,
            currency: { id: 1, alphabeticCode: 'EUR', numericCode: 978, displayName: 'Euro', symbol: '€' },
            deleted: false,
            editingOption: 'INTERNAL',
            canChangeEditingOption: false,
          },
        ],
      })
    );

    onFetchGooglePlacesOptions.mockImplementation(() =>
      Promise.resolve([
        {
          value: 'addressValue',
          label: 'Area 51, NV, USA',
        },
      ])
    );

    fetchGoogleAddressDetails.mockImplementation(() =>
      Promise.resolve({
        city: 'Milano',
        countryCode: 'IT',
        formattedAddress: 'Corso Magenta, 85, 20123 Milano MI, Italy',
        location: {
          latitude: 45.4658235,
          longitude: 9.1666898,
        },
        placeId: 'ChIJ4edudVzBhkcRHP7WsU-4aSM',
        street: 'Corso Magenta',
        timezone: 'Europe/Rome',
      })
    );

    fetchOrganizationCompanies.mockImplementation(() =>
      Promise.resolve({
        data: {
          content: [{ name: 'company-name', id: 777 }],
        },
      })
    );

    withStoreRender(<NewOrderForm onCancel={() => {}} onCreateOrderCompleted={onCreateOrderCompletedMock} />, {
      initialState: {
        user: {
          data: {
            organization: 1,
            roles: [{ id: 1, name: USER_ROLES.ROLE_ADMIN }],
          },
        },
      },
    });

    fireEvent.change(getByLabelText(key('newOrder.orderName')), { target: { value: 'new-order' } });

    const organizationName = getByLabelText(key('newOrder.organizationName'));
    fireEvent.focus(organizationName);
    fireEvent.change(organizationName, { target: { value: 'Org' } });
    await waitFor(() => expect(fetchOrganizations).toBeCalledTimes(1));
    const organizationOption = await findByText('organization-name');
    expect(organizationOption).toBeDefined();
    fireEvent.click(organizationOption);

    const companyName = getByLabelText(key('newOrder.companyName'));
    fireEvent.focus(companyName);
    await waitFor(() => fireEvent.change(companyName, { target: { value: 'Comp' } }));
    const companyOption = await findByText('company-name');
    expect(companyOption).toBeDefined();
    fireEvent.click(companyOption);
    await waitFor(() => expect(fetchCompanyDetails).toBeCalledTimes(1));

    const pricingPackage = getByLabelText(key('newOrder.pricingPackage'));
    fireEvent.focus(pricingPackage);
    fireEvent.change(pricingPackage, { target: { value: 'XL' } });
    await waitFor(() => expect(fetchCompanyPricingPackage).toBeCalledTimes(1));
    const pricingPackageOption = await findByText('XL (10 Photos - 1 hour) - 200 €');
    expect(pricingPackageOption).toBeDefined();
    fireEvent.click(pricingPackageOption);

    fireEvent.change(getByLabelText(key('contactName')), { target: { value: 'Max Planck' } });
    fireEvent.change(getByLabelText(key('contactPhone')), { target: { value: '+393398883322' } });
    fireEvent.change(getByLabelText(key('additionalContactPhone')), { target: { value: '+393398883333' } });
    fireEvent.change(getAllByLabelText(key('contactEmail'))[0], { target: { value: 'mp@company.com' } });

    const fullAddress = getByLabelText(key('fullAddress'));
    fireEvent.focus(fullAddress);
    await waitFor(() => fireEvent.change(fullAddress, { target: { value: 'Are' } }));
    await waitFor(() => expect(onFetchGooglePlacesOptions).toBeCalled(), { timeout: 2000 });
    const fullAddressOption = await findByText('Area 51, NV, USA');
    expect(fullAddressOption).toBeDefined();
    await waitFor(() => fireEvent.click(fullAddressOption));

    fireEvent.change(await findByLabelText(key('businessName')), { target: { value: 'business-name' } });

    const radioButton = await waitFor(() => getByRole('radio', { name: translations.t('forms.dateAndTimeUnknown') }));
    expect(radioButton.checked).toEqual(false);
    fireEvent.click(radioButton);
    expect(radioButton.checked).toEqual(true);

    fireEvent.click(getByText(translations.t('general.confirm')));

    await waitFor(() => expect(queryByText(translations.t('general.publish'))).toBeInTheDocument());

    getByText(/new-order/i);
    getByText(/organization-name/i);
    getByText(/company-name/i);
    getByText(/XL \(10 Photos - 1 hour\) - 200 €/i);
    getByText(/Max Planck/i);
    getByText(/\+393398883322/i);
    getByText(/\+393398883333/i);
    getByText(/mp@company.com/i);
    getByText(/Area 51, NV, USA/i);
    getByText(/business-name/i);
    getByText(/Internal/i);
  }, 15000);

  test('As Admin, I expect successfully publish new order', async () => {
    const { getByRole, getByLabelText, getAllByLabelText, getByText, findByText } = screen;

    jest.mock('axios', () => {
      const axios = jest.requireActual('axios');

      axios.create = jest.fn().mockImplementation(() => axios);

      axios.get = jest.fn().mockImplementation((url) => {
        if (url === '/api/v1/organizations/1') {
          return Promise.resolve({
            data: { name: 'organization-name', id: 1 },
          });
        }

        return Promise.reject('Not mocked call!');
      });

      return axios;
    });

    fetchOrganizations.mockImplementation(() =>
      Promise.resolve({
        data: {
          content: [{ name: 'organization-name', id: 1 }],
        },
      })
    );

    fetchCompanyDetails.mockImplementation(() =>
      Promise.resolve({
        data: {
          id: 0,
          company: 0,
          email: 'mr@company.com',
          address: 'string',
          phoneNumber: 'string',
          language: 'string',
          photoTypes: [
            {
              id: 0,
              type: 'string',
            },
          ],
          googleAuthorized: true,
        },
      })
    );

    fetchCompanyPricingPackage.mockImplementation(() =>
      Promise.resolve({
        data: [
          {
            id: 333,
            name: 'XL',
            photosQuantity: 10,
            shootingDuration: 60,
            companyPrice: 200.0,
            photographerEarning: 400.0,
            photoType: { id: 3, type: 'REAL_ESTATE' },
            authorizedCompanies: [
              { id: 986, name: 'ACompany', organization: 15, parentCompany: 15, createdAt: 1604488837000, updatedAt: 1604488837000 },
            ],
            organizationId: 15,
            currency: { id: 1, alphabeticCode: 'EUR', numericCode: 978, displayName: 'Euro', symbol: '€' },
            deleted: false,
            editingOption: 'INTERNAL',
            canChangeEditingOption: false,
          },
        ],
      })
    );

    onFetchGooglePlacesOptions.mockImplementation(() =>
      Promise.resolve([
        {
          value: 'addressValue',
          label: 'Area 51, NV, USA',
        },
      ])
    );

    fetchGoogleAddressDetails.mockImplementation(() =>
      Promise.resolve({
        city: 'Milano',
        countryCode: 'IT',
        formattedAddress: 'Corso Magenta, 85, 20123 Milano MI, Italy',
        location: {
          latitude: 45.4658235,
          longitude: 9.1666898,
        },
        placeId: 'ChIJ4edudVzBhkcRHP7WsU-4aSM',
        street: 'Corso Magenta',
        timezone: 'Europe/Rome',
      })
    );

    fetchOrganizationCompanies.mockImplementation(() =>
      Promise.resolve({
        data: {
          content: [{ name: 'company-name', id: 777 }],
        },
      })
    );

    createShooting.mockImplementation(() => Promise.resolve({ data: { company: { organization: 1 }, id: 1234 } }));

    withStoreRender(<NewOrderForm onCancel={() => {}} onCreateOrderCompleted={onCreateOrderCompletedMock} />, {
      initialState: {
        user: {
          data: {
            organization: 1,
            roles: [{ id: 1, name: USER_ROLES.ROLE_ADMIN }],
          },
        },
      },
    });

    fireEvent.change(getByLabelText(key('newOrder.orderName')), { target: { value: 'new-order' } });

    const organizationName = getByLabelText(key('newOrder.organizationName'));
    fireEvent.focus(organizationName);
    await waitFor(() => fireEvent.change(organizationName, { target: { value: 'Org' } }));
    const organizationOption = await findByText('organization-name');
    expect(organizationOption).toBeDefined();
    fireEvent.click(organizationOption);

    const companyName = getByLabelText(key('newOrder.companyName'));
    fireEvent.focus(companyName);
    await waitFor(() => fireEvent.change(companyName, { target: { value: 'Comp' } }));
    const companyOption = await findByText('company-name');
    expect(companyOption).toBeDefined();
    fireEvent.click(companyOption);

    const pricingPackage = getByLabelText(key('newOrder.pricingPackage'));
    fireEvent.focus(pricingPackage);
    fireEvent.change(pricingPackage, { target: { value: 'XL' } });
    const pricingPackageOption = await findByText('XL (10 Photos - 1 hour) - 200 €');
    expect(pricingPackageOption).toBeDefined();
    fireEvent.click(pricingPackageOption);

    fireEvent.change(getByLabelText(key('contactName')), { target: { value: 'Max Planck' } });
    fireEvent.change(getByLabelText(key('contactPhone')), { target: { value: '+393398883322' } });
    fireEvent.change(getAllByLabelText(key('contactEmail'))[0], { target: { value: 'mp@company.com' } });

    const fullAddress = getByLabelText(key('fullAddress'));
    fireEvent.focus(fullAddress);
    fireEvent.change(fullAddress, { target: { value: 'Are' } });
    await waitFor(() => expect(onFetchGooglePlacesOptions).toBeCalled(), { timeout: 2000 });
    const fullAddressOption = await findByText('Area 51, NV, USA');
    expect(fullAddressOption).toBeDefined();
    fireEvent.click(fullAddressOption);

    const radioButton = getByRole('radio', { name: translations.t('forms.dateAndTimeUnknown') });
    expect(radioButton.checked).toEqual(false);
    fireEvent.click(radioButton);
    expect(radioButton.checked).toEqual(true);

    fireEvent.click(getByText(key('newOrder.refund')));
    fireEvent.change(getByLabelText(`${key('newOrder.refundValue')} €`), { target: { value: 500 } });

    const confirmButton = getByRole('button', { name: translations.t('general.confirm') });
    expect(confirmButton).toBeDefined();
    expect(fireEvent.click(confirmButton)).toBeTruthy();

    await waitFor(() => expect(fetchOrganizationCompanies).toHaveBeenCalled());
    await waitFor(() => expect(fetchCompanyPricingPackage).toHaveBeenCalled());
    await waitFor(() => expect(fetchOrganizations).toHaveBeenCalled());
    await waitFor(() => expect(fetchCompanyDetails).toHaveBeenCalled());
    await waitFor(() => expect(fetchGoogleAddressDetails).toHaveBeenCalled());

    const publish = await findByText(translations.t('general.publish'));
    expect(publish).toBeDefined();
    fireEvent.click(publish);

    await waitFor(() => expect(createShooting).toHaveBeenCalled());
    await waitFor(() => expect(onCreateOrderCompletedMock).toBeCalledTimes(1));
    await waitFor(() => expect(onCreateOrderCompletedMock).toBeCalledWith(1, 1234, 500));
  }, 15000);

  test('As Client, I expect get validation errors on submit empty forms', async () => {
    const { getByLabelText, getByText, getAllByText } = screen;

    jest.mock('axios', () => {
      const axios = jest.requireActual('axios');

      axios.create = jest.fn().mockImplementation(() => axios);

      axios.get = jest.fn().mockImplementation((url) => {
        if (url === '/api/v1/organizations/888') {
          return Promise.resolve({
            data: { name: 'organization-name', id: 888 },
          });
        }

        return Promise.reject('Not mocked call!');
      });

      return axios;
    });

    withStoreRender(<NewOrderForm onCancel={() => {}} onCreateOrderCompleted={onCreateOrderCompletedMock} />, {
      initialState: {
        user: {
          data: {
            organization: 888,
            roles: [{ id: 1, name: USER_ROLES.ROLE_MANAGER }],
          },
        },
      },
    });

    fireEvent.click(getByText(translations.t('general.confirm')));

    await waitFor(() => expect(getByLabelText(key('newOrder.orderName'))?.parentElement?.lastElementChild?.textContent).toBe(REQUIRED));
    await waitFor(() => expect(getByText(key('newOrder.companyName'))?.parentElement?.lastElementChild?.textContent).toBe(REQUIRED));
    await waitFor(() => expect(getByText(key('newOrder.pricingPackage'))?.parentElement?.lastElementChild?.textContent).toBe(REQUIRED));
    await waitFor(() => expect(getByText(key('contactName'))?.parentElement?.parentElement?.lastElementChild?.textContent).toBe(REQUIRED));
    await waitFor(() => expect(getByText(key('contactPhone'))?.parentElement?.lastElementChild?.textContent).toBe(REQUIRED));
    await waitFor(() => expect(getByText(key('additionalContactPhone'))?.parentElement?.lastElementChild?.textContent).not.toBe(REQUIRED));
    await waitFor(() =>
      expect(getAllByText(key('contactEmail'))[0].parentElement?.parentElement?.lastElementChild?.textContent).toBe(REQUIRED)
    );
    await waitFor(() => expect(getByText(key('fullAddress'))?.parentElement?.lastElementChild?.textContent).toBe(REQUIRED));
  });
});
