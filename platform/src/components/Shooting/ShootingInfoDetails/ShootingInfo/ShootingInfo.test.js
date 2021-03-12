import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ShootingInfo } from '.';
import { OrderStatus } from 'types/OrderStatus';

const shooting = {
  id: 792,
  code: 'SWT34-792',
  title: 'Fix missing date',
  company: { id: 34, name: 'SweetGuest Italia', organization: 15 },
  photographerId: null,
  startDate: null,
  endDate: null,
  timezone: 'Europe/Rome',
  place: {
    placeId: 'ChIJLfawmlDBhkcRX8dY63xh_1w',
    formattedAddress: 'Corso Magenta, Milano MI, Italy',
    city: 'Milano',
    street: 'Corso Magenta',
    timezone: 'Europe/Rome',
    location: { latitude: 45.4657262, longitude: 9.173159199999999 },
  },
  pricingPackageId: 16,
  state: 'UNSCHEDULED',
  createdAt: 1596012768000,
  updatedAt: 1596012769000,
  downloadLink: 'http://localhost:8080/api/v1/public/shootings/images/ce5a27ead95a8d6017b72091ab0615d126424bcebb7b815219d493be3bee0c0e',
  distance: null,
  travelExpenses: null,
  deliveryMethods: [],
  deliveryStatus: null,
  pricingPackage: {
    id: 16,
    name: 'Common',
    photosQuantity: 100,
    shootingDuration: 60,
    companyPrice: 2222,
    photographerEarning: 3333,
    photoType: { id: 1, type: 'EVENTS' },
    authorizedCompanies: [
      { id: 34, name: 'SweetGuest Italia', organization: 15, parentCompany: 15, createdAt: 1541672803000, updatedAt: 1594020765000 },
      { id: 35, name: 'Sweet Guest Milano', organization: 15, parentCompany: 34, createdAt: 1541672840000, updatedAt: 1594892972000 },
    ],
    organizationId: 15,
    currency: { id: 1, alphabeticCode: 'EUR', numericCode: 978, displayName: 'Euro', symbol: '€' },
    deleted: false,
  },
  description: null,
  contact: null,
  logisticInformation: null,
  refund: null,
  uploadComments: null,
  stateChangedAt: null,
  processing: false,
  completedAt: null,
  mainContact: { fullName: 'Ste Arm', email: 'ste@boom.co', phoneNumber: '+393407272724', businessName: 'businessName' },
  canBeRescheduled: true,
  assignee: null,
  score: null,
  items: [],
  checklist: {
    id: 16,
    organizationId: 15,
    title: '20180820_Brandbook_video',
    checklistUrl: '15/checklists/16/20180820_Brandbook_video.pdf',
    authorizedCompanies: [{ id: 34, name: 'SweetGuest Italia', organization: 15 }],
    createdAt: 1569936715000,
    updatedAt: 1569936715000,
  },
  events: [],
};

jest.mock('moment-timezone', () => {
  const moment = jest.requireActual('moment-timezone');
  moment.tz.setDefault('Europe/Rome');
  return moment;
});

test.skip('date correct rendering', () => {
  const { getByTestId } = render(
    <ShootingInfo
      shooting={{
        ...shooting,
        startDate: new Date(1595671200000).getTime(),
        endDate: new Date(1595673000000).getTime(),
      }}
      onShowShootingInfoForm={() => {}}
    />
  );
  expect(getByTestId('start-date').children.item(1)).toHaveTextContent(/^July 25, 2020$/);
  expect(getByTestId('start-time').children.item(1)).toHaveTextContent(/^12:00 PM - 12.30 PM$/);
  expect(getByTestId('start-time').children.item(2)).toBeNull();
});

test.skip('date correct rendering with different timezone', () => {
  const { getByTestId } = render(
    <ShootingInfo
      shooting={{
        ...shooting,
        startDate: new Date(1595671200000).getTime(),
        endDate: new Date(1595673000000).getTime(),
        timezone: 'Asia/Dhaka',
      }}
      onShowShootingInfoForm={() => {}}
    />
  );
  expect(getByTestId('start-date').children.item(1)).toHaveTextContent(/^July 25, 2020$/);
  expect(getByTestId('start-time').children.item(1)).toHaveTextContent(/^12:00 PM - 12.30 PM$/);
  expect(getByTestId('start-time').children.item(2)).toHaveTextContent(/^\+06 4:00 PM - 4:30 PM$/);
});

test('missing date correct rendering', () => {
  const { getByTestId } = render(<ShootingInfo shooting={shooting} onShowShootingInfoForm={() => {}} />);
  expect(getByTestId('start-date')).toHaveTextContent('-');
  expect(getByTestId('start-time')).toHaveTextContent('-');
});

test('photographer does not see businessName if he still did not accepted the shooting', () => {
  const { queryByTestId } = render(
    <ShootingInfo
      shooting={{
        ...shooting,
        state: OrderStatus.Assigned,
      }}
      isPhotographer
    />
  );
  expect(queryByTestId('businessName')).not.toBeInTheDocument();
});
