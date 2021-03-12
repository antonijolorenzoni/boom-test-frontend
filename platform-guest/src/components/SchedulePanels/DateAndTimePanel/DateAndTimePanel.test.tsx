import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { DateAndTimePanel } from '.';
import { Order } from 'types/Order';
import { OrderStatus } from 'types/OrderStatus';
import moment from 'moment';
import i18n from 'i18n';

//1479427200000 === Friday 18 November 2016 00:00:00
jest.spyOn(Date, 'now').mockImplementation(() => 1479427200000);

const startDate = moment.tz('UTC').tz('Europe/Rome').add(10, 'days').format('YYYY-MM-DDTHH:mm:ss')

const order_mock: Order = {
  orderId: 1213,
  orderCode: 'SWT5-1213',
  orderStatus: OrderStatus.Unscheduled,
  contact: { name: 'fra', phone: '+393466876006', email: 'bra@gmail.com' },
  businessName: 'abc',
  address: 'Corso Magenta, Milano MI, Italy',
  company: { name: 'SweetGuest', organization: { id: 3 }, guidelines: { title: 'sadf', link: 'https://www.gppg.com' } },
  startDate,
  endDate: startDate,
  suggestedDate: startDate,
  timezone: 'Europe/Rome',
  orderType: 'REAL_ESTATE',
  details: { photosQuantity: 90, shootingDuration: 10 },
  downloadLink: null,
};

test('content is correctly shown', () => {
  render(<DateAndTimePanel order={order_mock} renderDateAndTimeButtons={() => <></>} />);

  expect(screen.getByText(`${i18n.t('orderInfo.photoshootDuration')}:`)).toBeVisible();
  expect(screen.getByText(/10 m/i)).toBeVisible();

  expect(screen.getByText(i18n.t('general.selectDate'))).toBeVisible();
  expect(screen.getByText(i18n.t('general.selectStartingTime'))).toBeVisible();
  expect(screen.getByText(i18n.t('general.time'))).toBeVisible();
  expect(screen.getByText(i18n.t('general.date'))).toBeVisible();

  expect(screen.queryByText(/calendar_today/i)).toBeVisible();
  expect(screen.queryByText(/access_time/i)).toBeVisible();
});

test('after rendering date selected is 10 days past today', () => {
  render(<DateAndTimePanel order={order_mock} renderDateAndTimeButtons={() => <></>} />);

  const startDate = moment.tz('Europe/Rome').add(10, 'days');
  const startDatePlus10Mins = moment.tz('Europe/Rome').add(10, 'days').add(10, 'minutes');

  const dayOfWeek: number = startDate.isoWeekday();
  const dayOfWeekShort: string = i18n.t(`daysOfWeek.${dayOfWeek - 1}`).substr(0, 3);

  expect(screen.getByTestId('selected-new-date')).toHaveTextContent(
    `calendar_today${dayOfWeekShort} ${startDate.format('DD/MM')}`
  );
  expect(screen.getByTestId('selected-new-time')).toHaveTextContent(
    `access_time${startDate.format('HH:mm')} - ${startDatePlus10Mins.format('HH:mm')}`
  );
});

test('user can choose a new date and review value label change', () => {
  render(<DateAndTimePanel order={order_mock} renderDateAndTimeButtons={() => <></>} />);

  const newDate = screen.getByText('26');

  fireEvent.click(newDate);

  expect(screen.getByTestId('selected-new-date')).toHaveTextContent(`calendar_todaySat 26/11`);

  const newHour = screen.getByText('15:30');

  fireEvent.click(newHour);

  expect(screen.getByTestId('selected-new-time')).toHaveTextContent(`access_time15:30 - 15:40`);
});
