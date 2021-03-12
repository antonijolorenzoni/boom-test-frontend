import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import { EditPanel } from '.';
import { OrderStatus } from 'types/OrderStatus';
import i18n from 'i18n';

import { Order } from 'types/Order';
import { fetchGoogleAddressDetails } from 'utils/google-place';

const orderUnscheduled: Order = {
  orderId: 828,
  orderCode: 'SWT34-828',
  orderStatus: OrderStatus.Unscheduled,
  contact: { name: 'fra', phone: '+393466876006', email: 'bra@gmail.com' },
  address: '22034 Brunate, Province of Como, Italy',
  businessName: '',
  company: {
    name: 'SweetGuest Italia',
    guidelines: { title: '20180820_Brandbook_video', link: '15/checklists/16/20180820_Brandbook_video.pdf' },
    organization: {
      id: 1,
    },
  },
  startDate: null,
  endDate: null,
  suggestedDate: '2020-09-17T13:00:00.000+0000',
  timezone: 'Europe/Rome',
  orderType: 'REAL_ESTATE',
  details: { photosQuantity: 10, shootingDuration: 50 },
  downloadLink: '810a5e4234decbd3472cf5b08fc631bd72ade41f4f6f679af8a5ba4a36659540',
};

const orderBooked: Order = { ...orderUnscheduled, orderStatus: OrderStatus.Booked };

jest.mock('utils/google-place', () => ({
  onFetchGooglePlacesOptions: jest.fn(() => {
    return {
      value: '22034 Brunate, Province of Como, Italy',
      label: '22034 Brunate, Province of Como, Italy',
    };
  }),
  fetchGoogleAddressDetails: jest.fn(() => {
    return Promise.resolve({
      city: 'Brunate',
      countryCode: 'IT',
      formattedAddress: '22034 Brunate, Province of Como, Italy',
      location: {
        latitude: 45.8200931,
        longitude: 9.0970379,
      },
      placeId: 'ChIJM_wOxcSdhkcReEoAckqr6uU',
      street: 'test',
      timezone: 'Europe/Rome',
    });
  }),
}));

beforeEach(jest.clearAllMocks);

test('EditPanel is shown correctly when Order is UNSCHEDULED', async () => {
  const onSetEditMode = jest.fn();

  render(<EditPanel order={orderUnscheduled} onSetEditMode={onSetEditMode} />);

  await waitFor(() => expect(fetchGoogleAddressDetails).toBeCalled());

  expect(screen.queryByText(i18n.t('editOrder.editContact').toUpperCase())).toBeVisible();
  expect(screen.queryByText(i18n.t('form.contact') as string)).toBeVisible();
  expect(screen.queryByText(i18n.t('orderInfo.nameSurname').toUpperCase())).toBeVisible();
  expect(screen.queryByText(i18n.t('orderInfo.phone').toUpperCase())).toBeVisible();
  expect(screen.queryByText(i18n.t('orderInfo.email').toUpperCase())).toBeVisible();
  expect(screen.queryByText(i18n.t('form.business') as string)).toBeVisible();
  expect(screen.getByLabelText(i18n.t('form.shortAddress').toUpperCase())).toBeVisible();
  expect(screen.queryByTestId('addressTypography')).not.toBeInTheDocument();

  expect(screen.queryByText(/fra/i)).toBeVisible();
  expect(screen.queryByText('+393466876006')).toBeVisible();
  expect(screen.queryByText(/bra@gmail.com/i)).toBeVisible();
  expect(screen.queryByText(/22034 Brunate, Province of Como, Italy/i));
});

test('EditPanel is shown correctly when Order is BOOKED', async () => {
  const onSetEditMode = jest.fn();

  render(<EditPanel order={orderBooked} onSetEditMode={onSetEditMode} />);

  await waitFor(() => expect(fetchGoogleAddressDetails).toBeCalled());

  expect(screen.queryByText(i18n.t('editOrder.editContact').toUpperCase())).toBeVisible();
  expect(screen.queryByText(i18n.t('form.contact') as string)).toBeVisible();
  expect(screen.queryByText(i18n.t('orderInfo.nameSurname').toUpperCase())).toBeVisible();
  expect(screen.queryByText(i18n.t('orderInfo.phone').toUpperCase())).toBeVisible();
  expect(screen.queryByText(i18n.t('orderInfo.email').toUpperCase())).toBeVisible();
  expect(screen.queryByText(i18n.t('form.business') as string)).toBeVisible();
  expect(screen.queryByTestId('addressTypography')).toBeVisible();

  expect(screen.queryByText(/fra/i)).toBeVisible();
  expect(screen.queryByText('+393466876006')).toBeVisible();
  expect(screen.queryByText(/bra@gmail.com/i)).toBeVisible();
  expect(screen.queryByText(/22034 Brunate, Province of Como, Italy/i));
});
