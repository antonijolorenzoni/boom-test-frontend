import React from 'react';
import moment from 'moment';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { CalendarEvent } from './CalendarEvent';
import { OrderStatus } from 'types/OrderStatus';
import { OrderEvent } from 'types/OrderEvent';

const orderEvent: OrderEvent = {
  orderId: 2862,
  orderCode: 'SWT5-2862',
  orderTitle: 'ASDZOR',
  orderStatus: OrderStatus.Accepted,
  companyId: 5,
  companyName: 'SweetGuest',
  startDate: moment('2021-01-20T14:30:00.000+0000').toDate(),
  endDate: moment('2021-01-20T16:30:00.000+0000').toDate(),
  address: 'Via Brunati, 25087 Salò BS, Italy',
  latitude: 45.6079258,
  longitude: 10.5289213,
};

test('calendar event renders correctly, normal statuses', () => {
  render(<CalendarEvent title="Order title" event={orderEvent} isOrderSelected={false} onToggle={() => {}} onSelectEvent={() => {}} />);

  expect(screen.getByText('ASDZOR').parentElement).toHaveStyle('box-shadow: inset 0px 8px #3F80DB;');
  expect(screen.getByText('ASDZOR').parentElement).toHaveStyle('opacity: 1;');
});

test('calendar event renders correctly, reshoot statuses', () => {
  render(
    <CalendarEvent
      title={''}
      event={{ ...orderEvent, orderStatus: OrderStatus.Reshoot }}
      isOrderSelected={false}
      onToggle={() => {}}
      onSelectEvent={() => {}}
    />
  );

  expect(screen.getByText('ASDZOR').parentElement).toHaveStyle('box-shadow: inset 0px 8px #cc0033;');
  expect(screen.getByText('ASDZOR').parentElement).toHaveStyle('opacity: 0.5;');
});

test('calendar event renders correctly, canceled statuses', () => {
  render(
    <CalendarEvent
      title={''}
      event={{ ...orderEvent, orderStatus: OrderStatus.Canceled }}
      isOrderSelected={false}
      onToggle={() => {}}
      onSelectEvent={() => {}}
    />
  );

  expect(screen.getByText('ASDZOR').parentElement).toHaveStyle('box-shadow: inset 0px 8px #9932CC;');
  expect(screen.getByText('ASDZOR').parentElement).toHaveStyle('opacity: 0.5;');
});
