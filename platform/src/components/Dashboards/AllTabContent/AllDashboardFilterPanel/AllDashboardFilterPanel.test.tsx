import React from 'react';
import moment from 'moment';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import selectEvent from 'react-select-event';

import translations from 'translations/i18next';

import { AllDashboardFilterPanel } from '.';
import { OrderStatus } from 'types/OrderStatus';
import { withStoreRender } from 'utils/test-utils';
import { ModalProvider } from 'hook/useModal';

jest.mock('api/companiesAPI', () => ({
  getCompanies: () => ({
    data: [
      {
        id: 5,
        name: 'SweetGuest',
        organization: 3,
        tier: 'enterprise',
        parentCompany: 1,
        createdAt: 1542295379000,
        updatedAt: 1609318689000,
      },
    ],
  }),
  getSubcompanies: () => ({
    data: [
      {
        id: 6,
        name: 'SweetGuest Italia',
        organization: 3,
        tier: 'enterprise',
        parentCompany: 5,
        createdAt: 1542295506000,
        updatedAt: 1600251617000,
      },
    ],
  }),
}));

jest.mock('hook/useCountries', () => ({
  useCountries: () => ({
    countries: [
      'IT',
      'ES',
      'US',
      'PT',
      'FR',
      'AL',
      'DZ',
      'CZ',
      'DK',
      'DE',
      'GB',
      'EG',
      'NO',
      'JP',
      'NL',
      'BE',
      'AE',
      'SE',
      'IN',
      'MA',
      'HU',
      'CL',
      'PY',
      'EC',
      'AU',
      'N/A',
    ],
  }),
}));

test('all clicking on done onSearch is correctly called', async () => {
  const search = jest.fn();

  const start = moment().utc().set('date', 1).set('month', 1).set('year', 2021).startOf('day').toDate();
  const end = moment().utc().set('date', 7).set('month', 1).set('year', 2021).startOf('day').toDate();

  withStoreRender(
    <ModalProvider>
      <AllDashboardFilterPanel
        onSearch={search}
        onReset={() => {}}
        initialDateRange={{
          start,
          end,
        }}
        isLoading={false}
        calendarVisible={false}
      />
    </ModalProvider>,
    {
      initialState: { user: { data: { organization: 1 } } },
    }
  );

  fireEvent.change(screen.getByPlaceholderText(translations.t('forms.search') as string), { target: { value: 'Some text...' } });
  await selectEvent.select(screen.getByLabelText(translations.t('order.status') as string), [
    translations.t(`shootingStatuses.${OrderStatus.Matched}`),
    translations.t(`shootingStatuses.${OrderStatus.Downloaded}`),
  ]);

  await selectEvent.select(screen.getByLabelText(translations.t('shootings.country') as string), ['Italia']);
  fireEvent.change(screen.getByLabelText(translations.t('forms.address') as string), { target: { value: 'corso' } });

  await waitFor(() =>
    fireEvent.change(screen.getByLabelText(translations.t('shootings.company') as string), { target: { value: 'Sweet' } })
  );

  await selectEvent.select(screen.getByLabelText(translations.t('shootings.company') as string), ['SweetGuest']);

  await waitFor(() =>
    fireEvent.change(screen.getByLabelText(translations.t('shootings.subcompany') as string), { target: { value: 'Sweet' } })
  );

  await selectEvent.select(screen.getByLabelText(translations.t('shootings.subcompany') as string), ['SweetGuest Italia']);

  fireEvent.click(screen.getByText(translations.t('forms.filter') as string));
  expect(search).toBeCalledTimes(1);
  expect(search).toBeCalledWith({
    freeText: 'Some text...',
    statuses: [OrderStatus.Matched, OrderStatus.Downloaded],
    dateRange: {
      start,
      end,
    },
    company: {
      label: 'SweetGuest',
      value: 5,
    },
    subCompany: {
      label: 'SweetGuest Italia',
      value: 6,
    },
    countryCode: 'IT',
    address: 'corso',
  });
});

test('all clicking on reset onReset is correctly called and all the filter will be cleared', async () => {
  const search = jest.fn();

  withStoreRender(
    <ModalProvider>
      <AllDashboardFilterPanel
        onSearch={search}
        onReset={() => {}}
        initialDateRange={{ start: null, end: null }}
        isLoading={false}
        calendarVisible={false}
      />
    </ModalProvider>,
    {
      initialState: { user: { data: { organization: 1 } } },
    }
  );

  fireEvent.change(screen.getByPlaceholderText(translations.t('forms.search') as string), { target: { value: 'Some text...' } });
  await selectEvent.select(screen.getByLabelText(translations.t('order.status') as string), [
    translations.t(`shootingStatuses.${OrderStatus.Matched}`),
    translations.t(`shootingStatuses.${OrderStatus.Downloaded}`),
  ]);

  await selectEvent.select(screen.getByLabelText(translations.t('shootings.country') as string), ['Italia']);
  fireEvent.change(screen.getByLabelText(translations.t('forms.address') as string), { target: { value: 'corso' } });

  await waitFor(() =>
    fireEvent.change(screen.getByLabelText(translations.t('shootings.company') as string), { target: { value: 'Sweet' } })
  );

  await selectEvent.select(screen.getByLabelText(translations.t('shootings.company') as string), ['SweetGuest']);

  await waitFor(() =>
    fireEvent.change(screen.getByLabelText(translations.t('shootings.subcompany') as string), { target: { value: 'Sweet' } })
  );

  await selectEvent.select(screen.getByLabelText(translations.t('shootings.subcompany') as string), ['SweetGuest Italia']);

  fireEvent.click(screen.getByText(translations.t('forms.filter') as string));
  fireEvent.click(screen.getByText(translations.t('forms.reset') as string));

  expect(search).toBeCalledTimes(1);
  expect(search).toBeCalledWith({
    freeText: 'Some text...',
    statuses: [OrderStatus.Matched, OrderStatus.Downloaded],
    dateRange: {
      start: null,
      end: null,
    },
    company: {
      label: 'SweetGuest',
      value: 5,
    },
    subCompany: {
      label: 'SweetGuest Italia',
      value: 6,
    },
    countryCode: 'IT',
    address: 'corso',
  });

  fireEvent.click(screen.getByText(translations.t('forms.reset') as string));
  fireEvent.click(screen.getByText(translations.t('forms.filter') as string));

  expect(search).toBeCalledTimes(2);
  expect(search).toBeCalledWith({
    freeText: '',
    statuses: [],
    dateRange: {
      start: new Date(moment().utc().day('Sunday').startOf('day').valueOf()),
      end: new Date(moment().utc().day('Sunday').add(7, 'days').startOf('day').valueOf()),
    },
    company: null,
    subCompany: null,
    countryCode: null,
    address: '',
  });
});

test('client does not see the subcompanies filter', async () => {
  const search = jest.fn();
  const { container } = withStoreRender(
    <ModalProvider>
      <AllDashboardFilterPanel
        onSearch={search}
        onReset={() => {}}
        initialDateRange={{ start: null, end: null }}
        isLoading={false}
        calendarVisible={false}
      />
    </ModalProvider>,
    {
      initialState: { user: { data: { organization: 123 } } },
    }
  );

  await waitFor(() => container);

  expect(screen.queryByLabelText(translations.t('shootings.subcompany') as string)).not.toBeInTheDocument();
});

test('that for client reset button will empty the date filter', async () => {
  const search = jest.fn();

  const { container } = withStoreRender(
    <ModalProvider>
      <AllDashboardFilterPanel
        onSearch={search}
        onReset={() => {}}
        initialDateRange={{ start: new Date(), end: new Date() }}
        isLoading={false}
        calendarVisible={false}
      />
    </ModalProvider>,
    {
      initialState: { user: { data: { organization: 123 } } },
    }
  );

  await waitFor(() => container);

  fireEvent.click(screen.getByText(translations.t('forms.reset') as string));
  fireEvent.click(screen.getByText(translations.t('forms.filter') as string));

  expect(search).toBeCalledTimes(1);
  expect(search).toBeCalledWith({
    freeText: '',
    statuses: [],
    dateRange: {
      start: null,
      end: null,
    },
    company: null,
    subCompany: null,
    countryCode: null,
    address: '',
  });
});
