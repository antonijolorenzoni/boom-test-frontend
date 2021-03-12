import React from 'react';
import moment from 'moment';
import { render, fireEvent, screen, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import translation from 'translations/i18next';

import { OrdersCalendar } from '.';
import { OrderStatus } from 'types/OrderStatus';
import { CalendarViewType } from 'types/CalendarViewType';

const events = [
  {
    orderId: 2862,
    orderCode: 'SWT5-2862',
    orderTitle: 'ASDZOR',
    orderStatus: OrderStatus.Accepted,
    companyId: 5,
    companyName: 'SweetGuest',
    startDate: '2021-01-20T14:30:00.000+0000',
    endDate: '2021-01-20T16:30:00.000+0000',
    timezone: 'Europe/Rome',
    address: 'Via Brunati, 25087 Salò BS, Italy',
    latitude: 45.6079258,
    longitude: 10.5289213,
  },
  {
    orderId: 2864,
    orderCode: 'RCC95-2864',
    orderTitle: 'EarningTest',
    orderStatus: OrderStatus.Matched,
    companyId: 95,
    companyName: 'Riccardo Organization',
    startDate: '2021-01-19T16:00:00.000+0000',
    endDate: '2021-01-19T16:30:00.000+0000',
    timezone: 'Europe/Rome',
    address: 'Via Andrea Maria Ampère, 57, 20131 Milano MI, Italy',
    latitude: 45.48345070000001,
    longitude: 9.2263643,
  },
  {
    orderId: 2881,
    orderCode: 'SWT5-2881',
    orderTitle: 'Castagna',
    orderStatus: OrderStatus.Reshoot,
    companyId: 5,
    companyName: 'SweetGuest',
    startDate: '2021-01-23T15:00:00.000+0000',
    endDate: '2021-01-23T17:00:00.000+0000',
    timezone: 'Europe/Rome',
    address: 'Via Brunate, 00135 Roma RM, Italy',
    latitude: 41.9389612,
    longitude: 12.4386273,
  },
];

const selectOrder = jest.fn();
const openForm = jest.fn();

beforeEach(jest.clearAllMocks);

test('events are correctly rendered', () => {
  render(
    <OrdersCalendar
      date="2021-01-20T07:46:23Z"
      calendarViewType={CalendarViewType.Week}
      events={events.map((e) => ({ ...e, startDate: moment(e.startDate).toDate(), endDate: moment(e.endDate).toDate() }))}
      onSelectEvent={selectOrder}
      onOpenNewOrderForm={openForm}
    />
  );

  screen.getByTestId('order-calendar-SWT5-2862');
  screen.getByTestId('order-calendar-RCC95-2864');
  screen.getByTestId('order-calendar-SWT5-2881');
});

test('clicking on an event trigger will show up the tooltip and user can click on details button', async () => {
  render(
    <>
      <OrdersCalendar
        date="2021-01-20T07:46:23Z"
        calendarViewType={CalendarViewType.Week}
        events={events.map((e) => ({ ...e, startDate: moment(e.startDate).toDate(), endDate: moment(e.endDate).toDate() }))}
        onSelectEvent={selectOrder}
        onOpenNewOrderForm={openForm}
      />
      <div id="event-modal" />
    </>
  );

  await waitFor(() => fireEvent.click(screen.getByTestId('order-calendar-SWT5-2862')));
  fireEvent.click(within(screen.getByTestId('order-calendar-tooltip-SWT5-2862')).getByText(translation.t('general.details') as string));

  await waitFor(() => fireEvent.click(screen.getByTestId('order-calendar-SWT5-2881')));
  fireEvent.click(within(screen.getByTestId('order-calendar-tooltip-SWT5-2881')).getByText(translation.t('general.details') as string));

  expect(selectOrder).toBeCalledTimes(2);
});
