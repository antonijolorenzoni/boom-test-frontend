import React from 'react';
import { render, screen } from '@testing-library/react';

import { ReviewPanel } from '.';
import { OrderStatus } from 'types/OrderStatus';
import i18n from 'i18n';

import moment from 'moment-timezone';
import { Order } from 'types/Order';

const startDate = moment.utc().tz('America/New_York').add(10, 'days').format('YYYY-MM-DDTHH:mm:ss');

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
  timezone: 'America/New_York',
  orderType: 'REAL_ESTATE',
  details: { photosQuantity: 90, shootingDuration: 115 },
  downloadLink: null,
};

test('content is correctly shown', () => {
  render(<ReviewPanel order={order_mock} navigationButtons={<div></div>} />);

  const startDate = moment.tz('America/New_York').add(10, 'days');

  const date: string = startDate.format('DD/MM');
  const dayOfWeek: number = startDate.isoWeekday();
  const dayOfWeekShort = i18n.t(`daysOfWeek.${dayOfWeek - 1}`).substr(0, 3);

  const gapTime = `${moment.tz('America/New_York').format('HH:mm')} - ${moment.tz('America/New_York').add(115, 'minute').format('HH:mm')}`;

  console.log('gapTime', gapTime);

  expect(screen.queryByText(i18n.t('orderInfo.photosNumber').toUpperCase())).toBeVisible();
  expect(screen.queryByText(i18n.t('orderInfo.duration').toUpperCase())).toBeVisible();
  expect(screen.queryByText(i18n.t('orderInfo.guidelines').toUpperCase())).toBeVisible();
  expect(screen.queryByText(i18n.t('general.date').toUpperCase())).toBeVisible();
  expect(screen.queryByText(i18n.t('general.time').toUpperCase())).toBeVisible();
  expect(screen.queryByText(i18n.t('form.contactOnSite'))).toBeVisible();
  expect(screen.queryByText(i18n.t('orderInfo.nameSurname').toUpperCase())).toBeVisible();
  expect(screen.queryByText(i18n.t('orderInfo.phone').toUpperCase())).toBeVisible();
  expect(screen.queryByText(i18n.t('orderInfo.email').toUpperCase())).toBeVisible();
  expect(screen.queryByText(i18n.t('orderInfo.address'))).toBeVisible();
  expect(screen.queryByText(i18n.t('form.address').toUpperCase())).toBeVisible();
  expect(screen.queryByText(i18n.t('orderInfo.businessName').toUpperCase())).toBeVisible();

  expect(screen.queryByText(/calendar_today/i)).toBeVisible();
  expect(screen.queryByText(/access_time/i)).toBeVisible();

  expect(screen.queryByText(/90/i)).toBeVisible();
  expect(screen.queryByText(/1 h 55 m/i)).toBeVisible();
  expect(screen.queryByText(i18n.t('general.read')));
  expect(screen.queryByText(`${dayOfWeekShort} ${date}`)).toBeVisible();
  expect(screen.queryByText(gapTime)).toBeVisible();
  expect(screen.queryByText(/fra/i)).toBeVisible();
  expect(screen.queryByText('+393466876006')).toBeVisible();
  expect(screen.queryByText(/bra@gmail.com/i)).toBeVisible();
  expect(screen.queryByText(/Corso Magenta, Milano MI, Italy/i)).toBeVisible();
  expect(screen.queryByText(/abc/i)).toBeVisible();
});
