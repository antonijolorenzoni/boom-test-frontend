import React from 'react';
import { render, fireEvent, screen, within, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import axios from 'axios';

import { ScheduleWizard } from '.';
import { Order } from 'types/Order';
import { OrderStatus } from 'types/OrderStatus';
import { Path } from 'types/Path';
import moment from 'moment-timezone';

// Friday 18 November 2016 00:00:00
jest.spyOn(Date, 'now').mockImplementation(() => 1479427200000);

jest.mock('moment-timezone', () => {
  const moment = jest.requireActual('moment-timezone');
  moment.tz.setDefault('America/New_York');
  return moment;
});

jest.mock('axios', () => {
  const axios = jest.requireActual('axios');
  axios.create = jest.fn().mockImplementation(() => axios);
  axios.put = jest.fn();
  return axios;
});

const buildOrder: (orderStatus: OrderStatus, startDate?: string) => Order = (orderStatus, startDate) => ({
  orderId: 1213,
  orderCode: 'SWT5-1213',
  orderStatus,
  contact: { name: 'fra', phone: '+393466876007', email: 'fra@gmail.com' },
  businessName: 'abc',
  address: 'Corso Magenta, Milano MI, Italy',
  company: { name: 'SweetGuest', organization: { id: 3 }, guidelines: { title: 'sadf', link: 'https://www.gppg.com' } },
  startDate: startDate || null,
  endDate: startDate || null,
  suggestedDate: moment.tz('America/New_York').format(),
  timezone: 'America/New_York',
  orderType: 'REAL_ESTATE',
  details: { photosQuantity: 10, shootingDuration: 10 },
  downloadLink: null,
});

beforeEach(jest.clearAllMocks);

test('close icon is rendered and works fine', async () => {
  const history = createMemoryHistory();

  render(
    <Router history={history}>
      <ScheduleWizard order={buildOrder(OrderStatus.Unscheduled)} />
    </Router>
  );

  const closeIcon = screen.getByText(/close/i);
  fireEvent.click(closeIcon);

  expect(history.location.pathname).toBe(Path.HomePage);
});

test('Unscheduled order - user can navigate with buttons in the panels', async () => {
  const history = createMemoryHistory();

  render(
    <Router history={history}>
      <ScheduleWizard order={buildOrder(OrderStatus.Unscheduled)} />
    </Router>
  );

  const pickersWrapper = within(screen.getByTestId('pickers-wrapper'));

  fireEvent.click(pickersWrapper.getByText('25'));
  fireEvent.click(pickersWrapper.getByText('10:00'));

  fireEvent.click(screen.getByTestId('next-button'));
  await waitFor(() => fireEvent.click(screen.getByTestId('next-button')));

  const bookButton = screen.getByTestId('book-button');
  await waitFor(() => fireEvent.click(bookButton));

  expect(history.location.pathname).toBe(Path.Confirmation);
  expect(axios.put).toHaveBeenCalledWith('/organizations/3/shootings/1213/schedule', { startDate: 1480086000000 });
});

test('Booked order - user can navigate with buttons in the panels', async () => {
  const startDate = moment().add(10, 'days').hour(10).minute(30).second(0).format('YYYY-MM-DDTHH:mm:ss');
  const history = createMemoryHistory();

  render(
    <Router history={history}>
      <ScheduleWizard order={buildOrder(OrderStatus.Booked, startDate)} />
    </Router>
  );

  fireEvent.click(screen.getByTestId('next-button'));
  await waitFor(() => fireEvent.click(screen.getByTestId('next-button')));
  await waitFor(() => fireEvent.click(screen.getByTestId('back-button')));
  await waitFor(() => fireEvent.click(screen.getByTestId('next-button')));
  const bookButton = screen.getByTestId('book-button');

  await waitFor(() => fireEvent.click(bookButton));

  expect(history.location.pathname).toBe(`${Path.Confirmation}`);
  expect(history.location.search).toBe(`?rescheduled`);
  expect(axios.put).toHaveBeenCalledWith('/organizations/3/shootings/1213/reschedule', { startDate: 1480260600000 });
});
