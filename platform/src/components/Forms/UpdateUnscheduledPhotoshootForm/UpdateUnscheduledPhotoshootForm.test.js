import React from 'react';
import { fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UpdateUnscheduledPhotoshootForm } from '.';

import * as PhoneCallsApi from 'api/phoneCallsAPI';

import translations from '../../../translations/i18next';
import { withStoreRender } from 'utils/test-utils';

const shooting = {
  id: 843,
  code: 'SWT34-843',
  title: 'Prova',
  company: { id: 34, name: 'SweetGuest Italia', organization: 15 },
  photographerId: 671,
  startDate: null,
  endDate: null,
  callAttempts: 2,
  timezone: 'Europe/Rome',
  canChangeEditingOption: true,
  editingOption: 'EXTERNAL',
  place: {
    placeId: 'ChIJLfawmlDBhkcRX8dY63xh_1w',
    formattedAddress: 'Corso Magenta, Milano MI, Italy',
    city: 'Milano',
    street: 'Corso Magenta',
    timezone: 'Europe/Rome',
    location: { latitude: 45.4657262, longitude: 9.173159199999999 },
  },
  pricingPackageId: 12,
  state: 'ACCEPTED',
  createdAt: 1592388300000,
  updatedAt: 1592403622000,
  downloadLink: 'http://localhost:8080/api/v1/public/shootings/images/3dbdc56a7bf7ab6c0157130068e4a32b41b8f6ccc969cabefe6f3de545c18fd6',
  distance: null,
  travelExpenses: 100,
  deliveryMethods: [
    { type: 'EMAIL', contact: 'ste@boom.co', status: 'WAITING', errorMessage: null, alias: null },
    { type: 'DRIVE', contact: '', status: 'WAITING', errorMessage: null, alias: 'Boom Photos' },
    { type: 'EMAIL', contact: 'info@boom.co', status: 'WAITING', errorMessage: null, alias: null },
  ],
  deliveryStatus: 'WAITING',
  pricingPackage: {
    id: 12,
    name: 'Pacchetto EuroSpin',
    photosQuantity: 10,
    shootingDuration: 60,
    companyPrice: 1000,
    photographerEarning: 500,
    photoType: { id: 3, type: 'REAL_ESTATE' },
    authorizedCompanies: [
      { id: 34, name: 'SweetGuest Italia', organization: 15, parentCompany: 15, createdAt: 1541672803000, updatedAt: 1588975291000 },
      { id: 15, name: 'SweetGuest', organization: 15, parentCompany: 1, createdAt: 1540904177000, updatedAt: 1576599729000 },
    ],
    organizationId: 15,
    currency: { id: 1, alphabeticCode: 'EUR', numericCode: 978, displayName: 'Euro', symbol: '€' },
    deleted: false,
  },
  description: 'Prova',
  contact: null,
  logisticInformation: 'Logistic info!',
  refund: 200,
  uploadComments: null,
  stateChangedAt: 1592403622000,
  processing: false,
  completedAt: null,
  mainContact: { fullName: 'Stefano Armenes', email: 'ste@boom.co', phoneNumber: '+393407272724' },
};

jest.mock('axios', () => {
  const axios = jest.requireActual('axios');

  axios.create = jest.fn().mockImplementation(() => axios);

  axios.get = jest.fn().mockImplementation((url) => {
    switch (url) {
      case '/api/v1/orders/815/operation-notes':
        return Promise.resolve({
          data: [
            { userName: 'Alessia Rossi', text: 'First operation notes', creationDate: '2020-08-11T14:52:01.000+0000' },
            { userName: 'Alessia Neri', text: 'Second operation notes', creationDate: '2020-08-11T14:51:01.000+0000' },
            { userName: 'Alessia Verdi', text: 'Third operation notes', creationDate: '2020-08-11T14:50:01.000+0000' },
          ],
        });
      case '/api/v1/orders/230/operation-notes':
        return Promise.resolve({
          data: [],
        });
      case '/api/v1/organizations/15/companies/34/pricingPackages':
        return Promise.resolve({
          data: [
            {
              id: 19,
              name: 'Real estate figooo',
              photosQuantity: 100,
              shootingDuration: 30,
              companyPrice: 100.0,
              photographerEarning: 10.0,
              photoType: { id: 3, type: 'REAL_ESTATE' },
              authorizedCompanies: [
                {
                  id: 986,
                  name: 'Sweetguest Italia',
                  organization: 15,
                  parentCompany: 15,
                  createdAt: 1604582801000,
                  updatedAt: 1604582801000,
                  tier: 'enterprise',
                  segment: 'enterprise',
                },
              ],
              organizationId: 15,
              currency: { id: 1, alphabeticCode: 'EUR', numericCode: 978, displayName: 'Euro', symbol: '€' },
              deleted: false,
              editingOption: 'EXTERNAL',
              canChangeEditingOption: true,
            },
            {
              id: 22,
              name: 'L PACK',
              photosQuantity: 10,
              shootingDuration: 10,
              companyPrice: 10.0,
              photographerEarning: 10.0,
              photoType: { id: 3, type: 'REAL_ESTATE' },
              authorizedCompanies: [
                {
                  id: 986,
                  name: 'Sweetguest Italia',
                  organization: 15,
                  parentCompany: 15,
                  createdAt: 1604582801000,
                  updatedAt: 1604582801000,
                  tier: 'enterprise',
                  segment: 'enterprise',
                },
              ],
              organizationId: 15,
              currency: { id: 1, alphabeticCode: 'EUR', numericCode: 978, displayName: 'Euro', symbol: '€' },
              deleted: false,
              editingOption: 'EXTERNAL',
              canChangeEditingOption: true,
            },
            {
              id: 20,
              name: 'Products bruttooo',
              photosQuantity: 100,
              shootingDuration: 30,
              companyPrice: 20.0,
              photographerEarning: 10.0,
              photoType: { id: 5, type: 'PRODUCTS' },
              authorizedCompanies: [
                {
                  id: 986,
                  name: 'Sweetguest Italia',
                  organization: 15,
                  parentCompany: 15,
                  createdAt: 1604582801000,
                  updatedAt: 1604582801000,
                  tier: 'enterprise',
                  segment: 'enterprise',
                },
              ],
              organizationId: 15,
              currency: { id: 1, alphabeticCode: 'EUR', numericCode: 978, displayName: 'Euro', symbol: '€' },
              deleted: false,
              editingOption: 'INTERNAL',
              canChangeEditingOption: false,
            },
          ],
        });
      default:
        return Promise.reject();
    }
  });

  axios.post = jest.fn().mockImplementation((url) => {
    switch (url) {
      case '/api/v1/events/orders/SWT34-843/phone-calls':
        return Promise.resolve();
      default:
        return Promise.reject();
    }
  });

  return axios;
});

jest.mock('../../../api/instances/googlePlacesInstance');

// Friday 18 November 2016 00:00:00
jest.spyOn(Date, 'now').mockImplementation(() => 1479427200000);

jest.mock('moment-timezone', () => {
  const moment = jest.requireActual('moment-timezone');
  moment.tz.setDefault('America/New_York');
  return moment;
});

beforeEach(jest.clearAllMocks);

test('local time label is correctly rendered', async () => {
  const { container } = withStoreRender(<UpdateUnscheduledPhotoshootForm shooting={shooting} isDriveAuthorized onSubmit={() => {}} />, {
    initialState: {
      user: {
        data: {
          isBoom: true,
        },
      },
    },
  });

  await waitFor(() => container);

  screen.getByText(`${translations.t('shootings.localTime')}: 01:00 am`);
});

test('fill all the fields excluding the ones inside accordions and date/time and check submit is called', async () => {
  const fakeSubmit = jest.fn();

  const { container } = withStoreRender(
    <UpdateUnscheduledPhotoshootForm shooting={shooting} isDriveAuthorized={true} onSubmit={fakeSubmit} />,
    {
      initialState: {
        user: {
          data: {
            isBoom: true,
          },
        },
      },
    }
  );

  await waitFor(() => container);

  const inputFullName = screen.getByLabelText(translations.t('shootings.shootingContactsDetails.nameAndSurname'));
  fireEvent.change(inputFullName, { target: { value: 'Marco Rossi' } });
  expect(inputFullName).toHaveValue('Marco Rossi');

  const inputPhoneNumber = screen.getByLabelText(translations.t('shootings.shootingContactsDetails.phone'));
  fireEvent.change(inputPhoneNumber, { target: { value: '+393491212124' } });
  expect(inputPhoneNumber).toHaveValue('+39 349 121 2124');

  const inputEmail = screen.getAllByLabelText(translations.t('shootings.shootingContactsDetails.email'))[0];
  fireEvent.change(inputEmail, { target: { value: 'marco.rossi@boom.co' } });
  expect(inputEmail).toHaveValue('marco.rossi@boom.co');

  const fullAddress = screen.getByLabelText(translations.t('general.fullAddress'));
  fireEvent.focus(fullAddress);
  fireEvent.change(fullAddress, { target: { value: 'fake' } });

  const option = await screen.findByText('Corso Magenta, Milano MI, Italy');
  fireEvent.click(option);

  fireEvent.click(screen.getByText(translations.t('general.confirm')));

  await waitFor(() => expect(fakeSubmit).toHaveBeenCalledTimes(1));

  await waitFor(() =>
    expect(fakeSubmit).toHaveBeenCalledWith({
      businessName: '',
      date: null,
      startTime: null,
      deliveryMethodsEmails: ['ste@boom.co', 'info@boom.co'],
      deliveryMethodsIsDriveSelected: true,
      description: 'Prova',
      email: 'marco.rossi@boom.co',
      fullName: 'Marco Rossi',
      logisticInformation: 'Logistic info!',
      phoneNumber: '+393491212124',
      shootingAddress: {
        city: 'Milano',
        formattedAddress: 'Corso Magenta, Milano MI, Italy',
        location: {
          latitude: 45.4657262,
          longitude: 9.173159199999999,
        },
        placeId: 'ChIJLfawmlDBhkcRX8dY63xh_1w',
        street: 'Corso Magenta',
        timezone: 'Europe/Rome',
      },
      editingOption: 'EXTERNAL',
      pricingPackage: 12,
    })
  );
});

test('fill all the fields with errors excluding the ones inside accordions and check submit is not called', async () => {
  const fakeSubmit = jest.fn();

  const { container } = withStoreRender(
    <UpdateUnscheduledPhotoshootForm shooting={shooting} isDriveAuthorized={true} onSubmit={fakeSubmit} />,
    {
      initialState: {
        user: {
          data: {
            isBoom: true,
          },
        },
      },
    }
  );

  await waitFor(() => container);

  const inputFullName = screen.getByLabelText(translations.t('shootings.shootingContactsDetails.nameAndSurname'));
  inputFullName.focus();
  fireEvent.change(inputFullName, { target: { value: '' } });
  expect(inputFullName).toHaveValue('');
  inputFullName.blur();

  const inputPhoneNumber = screen.getByLabelText(translations.t('shootings.shootingContactsDetails.phone'));
  inputPhoneNumber.focus();
  fireEvent.change(inputPhoneNumber, { target: { value: '' } });
  expect(inputPhoneNumber).toHaveValue('');
  inputPhoneNumber.blur();

  const inputEmail = screen.getAllByLabelText(translations.t('shootings.shootingContactsDetails.email'))[0];
  inputEmail.focus();
  fireEvent.change(inputEmail, { target: { value: 'marco.rossi@boom' } });
  expect(inputEmail).toHaveValue('marco.rossi@boom');
  inputEmail.blur();

  const fullAddress = screen.getByLabelText(translations.t('general.fullAddress'));
  fullAddress.focus();
  fireEvent.click(container.querySelector('div[data-testid="addressAndBusinessName"] svg'));
  fullAddress.blur();

  await waitFor(() => fireEvent.click(screen.getByText(translations.t('general.confirm'))));

  expect(inputFullName.nextSibling.nextSibling.textContent).toBe(translations.t('forms.required'));
  expect(inputPhoneNumber.parentElement.nextSibling.textContent).toBe(translations.t('forms.invalidPhone'));
  expect(inputEmail.nextSibling.nextSibling.textContent).toBe(translations.t('forms.invalidEmail'));

  expect(fakeSubmit).not.toBeCalled();
});

test('delivery methods label is visible inside the accordion label', async () => {
  const { container } = withStoreRender(
    <UpdateUnscheduledPhotoshootForm shooting={shooting} isDriveAuthorized={true} onSubmit={() => {}} />,
    {
      initialState: {
        user: {
          data: {
            isBoom: true,
          },
        },
      },
    }
  );

  await waitFor(() => container);

  expect(screen.getByTestId('selected-delivery-methods').textContent).toBe(
    `${translations.t('shootings.deliveryMethodsType.email')}, ${translations.t('shootings.deliveryMethodsType.drive')}`
  );

  const accordionTitle = screen.getByText(translations.t('shootings.deliveryMethods'));
  fireEvent.click(accordionTitle);
  expect(screen.queryByTestId('selected-delivery-methods')).not.toBeInTheDocument();

  await waitFor(() => container.querySelector('input[type="checkbox"]').click());

  fireEvent.click(accordionTitle);
  expect(screen.getByTestId('selected-delivery-methods').textContent).toBe(`${translations.t('shootings.deliveryMethodsType.email')}`);
});

test('call attempts are visible and on click telephone icon the call to backend start', async () => {
  const postMethodSpy = jest.spyOn(PhoneCallsApi, 'incrementPhoneCallCounter').mockImplementation(() => {});

  const { queryByText, container } = withStoreRender(
    <UpdateUnscheduledPhotoshootForm shooting={shooting} isDriveAuthorized={true} onSubmit={() => {}} />,
    {
      initialState: {
        user: {
          data: {
            isBoom: true,
          },
        },
      },
    }
  );

  await waitFor(() => container);

  expect(queryByText(/(2)/i)).toBeVisible();

  const numberCalls = queryByText(/(2)/i);
  await waitFor(() => fireEvent.click(numberCalls));
  expect(queryByText(/(3)/i)).toBeVisible();

  expect(postMethodSpy).toHaveBeenCalled();
  expect(postMethodSpy).toHaveBeenCalledWith('SWT34-843');
});

test('delivery methods label is visible inside the accordion label', async () => {
  const { container } = withStoreRender(
    <UpdateUnscheduledPhotoshootForm shooting={shooting} isDriveAuthorized={true} onSubmit={() => {}} />,
    {
      initialState: {
        user: {
          data: {
            isBoom: true,
          },
        },
      },
    }
  );
  await waitFor(() => container);

  expect(screen.getByTestId('selected-delivery-methods').textContent).toBe(
    `${translations.t('shootings.deliveryMethodsType.email')}, ${translations.t('shootings.deliveryMethodsType.drive')}`
  );

  const accordionTitle = screen.getByText(translations.t('shootings.deliveryMethods'));
  await waitFor(() => fireEvent.click(accordionTitle));
  expect(screen.queryByTestId('selected-delivery-methods')).not.toBeInTheDocument();

  container.querySelector('input[type="checkbox"]').click();

  await waitFor(() => fireEvent.click(accordionTitle));
  expect(screen.getByTestId('selected-delivery-methods').textContent).toBe(`${translations.t('shootings.deliveryMethodsType.email')}`);
});
