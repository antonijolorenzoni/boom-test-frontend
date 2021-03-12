import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import 'jest-styled-components';

import { Order } from 'types/Order';
import { OrderStatus } from 'types/OrderStatus';

import { OrderPanel } from '.';

jest.mock('moment-timezone', () => {
  const moment = jest.requireActual('moment-timezone');
  moment.tz.setDefault('Europe/Rome');
  return moment;
});

test('<OrderPanel /> renders correctly saving a snapshot', () => {
  const order: Order = {
    orderId: 828,
    orderCode: 'SWT34-828',
    orderStatus: OrderStatus.Unscheduled,
    contact: { name: 'Ste', phone: '+393407272724', email: 'ste@boom.co' },
    businessName: 'Ciaone SRL',
    address: 'Corso Magenta, Milano MI, Italy',
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

  const { container } = render(
    <MemoryRouter>
      <OrderPanel order={order} rescheduleCount={0} editMode={false} onSetEditMode={() => {}} />
    </MemoryRouter>
  );
  expect(container).toMatchSnapshot();
});

test('<OrderPanel /> renders overlays if status is CANCELED ', () => {
  const order: Order = {
    orderId: 828,
    orderCode: 'SWT34-828',
    orderStatus: OrderStatus.Canceled,
    contact: { name: 'Ste', phone: '+393407272724', email: 'ste@boom.co' },
    businessName: 'Ciaone SRL',
    address: 'Corso Magenta, Milano MI, Italy',
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

  const { getAllByTestId } = render(
    <MemoryRouter>
      <OrderPanel order={order} rescheduleCount={0} editMode={false} onSetEditMode={() => {}} />
    </MemoryRouter>
  );

  const overlays = getAllByTestId('order-panel-overlay');
  expect(overlays.length).toBe(6);
});

test('<OrderPanel /> renders overlays if status is RESHOOT ', () => {
  const order: Order = {
    orderId: 828,
    orderCode: 'SWT34-828',
    orderStatus: OrderStatus.Reshoot,
    contact: { name: 'Ste', phone: '+393407272724', email: 'ste@boom.co' },
    businessName: 'Ciaone SRL',
    address: 'Corso Magenta, Milano MI, Italy',
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

  const { getAllByTestId } = render(
    <MemoryRouter>
      <OrderPanel order={order} rescheduleCount={0} editMode={false} onSetEditMode={() => {}} />
    </MemoryRouter>
  );

  const overlays = getAllByTestId('order-panel-overlay');
  expect(overlays.length).toBe(6);
});

test('<OrderPanel /> renders overlays if status is UNSCHEDULED ', () => {
  const order: Order = {
    orderId: 828,
    orderCode: 'SWT34-828',
    orderStatus: OrderStatus.Unscheduled,
    contact: { name: 'Ste', phone: '+393407272724', email: 'ste@boom.co' },
    businessName: 'Ciaone SRL',
    address: 'Corso Magenta, Milano MI, Italy',
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

  const { queryAllByTestId } = render(
    <MemoryRouter>
      <OrderPanel order={order} rescheduleCount={0} editMode={false} onSetEditMode={() => {}} />
    </MemoryRouter>
  );

  const overlays = queryAllByTestId('order-panel-overlay');
  expect(overlays.length).toBe(0);
});
