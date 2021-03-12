import React from 'react';
import { render } from '@testing-library/react';

import { ContactPanel } from '.';
import { Order } from 'types/Order';
import { OrderStatus } from 'types/OrderStatus';
import i18n from 'i18n';

import moment from 'moment-timezone';

const startDate = moment.tz('Europe/Rome').add(10, 'days').format('YYYY-MM-DDTHH:mm:ss');

const order_mock: Order = {
  orderId: 1213,
  orderCode: 'SWT5-1213',
  orderStatus: OrderStatus.Unscheduled,
  contact: { name: 'fra', phone: '+393466876006', email: 'ale@gmail.com' },
  businessName: 'abc',
  address: 'Corso Magenta, Milano MI, Italy',
  company: { name: 'SweetGuest', organization: { id: 3 }, guidelines: { title: 'sadf', link: 'https://www.gppg.com' } },
  startDate,
  endDate: startDate,
  suggestedDate: startDate,
  timezone: 'Europe/Rome',
  orderType: 'REAL_ESTATE',
  details: { photosQuantity: 10, shootingDuration: 10 },
  downloadLink: null,
};

test('content is correctly shown', () => {
  const { getByText, getByRole } = render(
    <ContactPanel order={order_mock} renderNavigationButtons={() => <div></div>} onAddStep={() => {}} setUpdatedOrder={() => {}} />
  );

  expect(getByText(i18n.t('form.contact'))).toBeVisible();
  expect(getByText(i18n.t('orderInfo.nameSurname').toUpperCase())).toBeVisible();
  expect(getByText(i18n.t('orderInfo.phone').toUpperCase())).toBeVisible();
  expect(getByText(i18n.t('orderInfo.email').toUpperCase())).toBeVisible();
  expect(getByText(i18n.t('form.business'))).toBeVisible();
  expect(getByText(i18n.t('orderInfo.businessName').toUpperCase())).toBeVisible();

  expect(getByText(/fra/i)).toBeVisible();
  expect(getByText('+393466876006')).toBeVisible();
  expect(getByText(/ale@gmail.com/i)).toBeVisible();

  const businessNameField = getByRole('textbox');

  expect(businessNameField).toHaveValue('abc');
});
