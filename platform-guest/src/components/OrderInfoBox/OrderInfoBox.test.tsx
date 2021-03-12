import React from 'react';
import { render } from '@testing-library/react';

import i18n from 'i18n';

import { OrderInfoBox } from '.';
import { OrderStatus } from 'types/OrderStatus';

jest.mock('moment-timezone', () => {
  const moment = jest.requireActual('moment-timezone');
  moment.tz.setDefault('Europe/Rome');
  return (input: moment.MomentInput) => moment(input || '2020-09-01T10:00:00.000+0000');
});

test('all labels appear and date are correctly show', () => {
  const { queryByText } = render(
    <OrderInfoBox
      status={OrderStatus.Unscheduled}
      type="REAL_ESTATE"
      photos={4}
      duration={90}
      companyName="fake_company"
      startDate="2020-08-31T12:00:00.000+0000"
      timezone="Europe/Rome"
      onScheduleOrder={() => {}}
      downloadLink={null}
    />
  );

  expect(queryByText(i18n.t('orderInfo.shootingStatus').toUpperCase())).toBeVisible();
  expect(queryByText(i18n.t(`orderInfo.foodTip.${OrderStatus.Unscheduled}`))).toBeNull();
  expect(queryByText(i18n.t(`orderInfo.realEstateTip.${OrderStatus.Unscheduled}`))).toBeVisible();
  expect(queryByText(i18n.t('orderInfo.guidelines').toUpperCase())).toBeVisible();
  expect(queryByText(i18n.t('orderInfo.download'))).toBeNull();
  expect(queryByText(i18n.t('general.read'))).toBeVisible();
  expect(queryByText(i18n.t('orderInfo.photosNumber').toUpperCase())).toBeVisible();
  expect(queryByText(i18n.t('orderInfo.duration').toUpperCase())).toBeVisible();
  expect(queryByText(i18n.t('orderInfo.dishesNumber').toUpperCase())).toBeNull();
  expect(queryByText(i18n.t('general.date').toUpperCase())).toBeVisible();
  expect(queryByText(i18n.t('general.time').toUpperCase())).toBeVisible();
  expect(queryByText(i18n.t('orderInfo.chooseAnotherDate'))).toBeVisible();
  expect(queryByText(i18n.t('general.confirm').toUpperCase())).toHaveStyle('visibility: visible');
  expect(queryByText(i18n.t('orderInfo.rescheduleTip'))).toBeNull();
  expect(queryByText(i18n.t('orderInfo.cannotRescheduleTip'))).toBeNull();

  expect(queryByText(i18n.t(`orderStatus.${OrderStatus.Unscheduled}`))).toBeVisible();
  expect(queryByText('4')).toBeVisible();
  expect(queryByText('1 h 30 m')).toBeVisible();
  expect(queryByText('20')).toBeNull();
  const dateString = 'Mon 31/08';
  expect(queryByText(dateString)).toBeVisible();
  expect(queryByText(/14:00/i)).toBeVisible();
});

test('visibility of Confirm button and Download button when order status is not UNSCHEDULED', () => {
  const { queryByText } = render(
    <OrderInfoBox
      status={OrderStatus.Booked}
      type="FOOD"
      photos={4}
      duration={60}
      companyName="fake_company"
      startDate="2020-09-05T14:00:00.000+0000"
      onScheduleOrder={() => {}}
      timezone="Europe/Rome"
      downloadLink=""
    />
  );

  expect(queryByText(i18n.t('orderInfo.download'))).toBeNull();
  expect(queryByText(i18n.t('general.confirm').toUpperCase())).toHaveStyle('visibility: hidden');
});

test('visibility of date tips in BOOKED order, no rescheduled yet', () => {
  const { queryByText } = render(
    <OrderInfoBox
      status={OrderStatus.Booked}
      type="FOOD"
      photos={4}
      duration={60}
      companyName="fake_company"
      startDate="2020-09-05T14:00:00.000+0000"
      yetRescheduled={false}
      onScheduleOrder={() => {}}
      timezone="Europe/Rome"
      downloadLink={null}
    />
  );

  expect(queryByText(i18n.t('orderInfo.rescheduleTip'))).toBeVisible();
  expect(queryByText(i18n.t('orderInfo.cannotRescheduleTip'))).toBeNull();
});

test('no visibility of date tips in BOOKED order, it is in the past', () => {
  const { queryByText } = render(
    <OrderInfoBox
      status={OrderStatus.Booked}
      type="FOOD"
      photos={4}
      duration={60}
      companyName="fake_company"
      startDate="2020-08-05T14:00:00.000+0000"
      yetRescheduled={false}
      onScheduleOrder={() => {}}
      timezone="Europe/Rome"
      downloadLink={null}
    />
  );

  expect(queryByText(i18n.t('orderInfo.rescheduleTip'))).toBeNull();
  expect(queryByText(i18n.t('orderInfo.cannotRescheduleTip'))).toBeNull();
});

test('visibility of date tips in BOOKED order within 24h from start date', () => {
  const { queryByText } = render(
    <OrderInfoBox
      status={OrderStatus.Booked}
      type="FOOD"
      photos={4}
      duration={60}
      companyName="fake_company"
      startDate="2020-09-02T09:30:00.000+0000"
      yetRescheduled={false}
      timezone="Europe/Rome"
      onScheduleOrder={() => {}}
      downloadLink={null}
    />
  );

  expect(queryByText(i18n.t('orderInfo.almostStart'))).toBeVisible();
});

test('order within 25h from start date', () => {
  const { queryByText } = render(
    <OrderInfoBox
      status={OrderStatus.Booked}
      type="FOOD"
      photos={4}
      duration={60}
      companyName="fake_company"
      startDate="2020-09-02T11:00:00.000+0000"
      timezone="Europe/Rome"
      yetRescheduled={false}
      onScheduleOrder={() => {}}
      downloadLink={null}
    />
  );

  expect(queryByText(i18n.t('orderInfo.almostStart'))).toBeNull();
});

test('visibility of date tips and download button in BOOKED order, rescheduled', () => {
  const { queryByText } = render(
    <OrderInfoBox
      status={OrderStatus.Booked}
      type="FOOD"
      photos={4}
      duration={60}
      companyName="fake_company"
      startDate="2020-09-05T14:00:00.000+0000"
      timezone="Europe/Rome"
      yetRescheduled
      onScheduleOrder={() => {}}
      downloadLink={null}
    />
  );

  expect(queryByText(i18n.t('orderInfo.download'))).toBeNull();
  expect(queryByText(i18n.t('orderInfo.rescheduleTip'))).toBeNull();
  expect(queryByText(i18n.t('orderInfo.cannotRescheduleTip'))).toBeVisible();
});

test('visibility of download button tips in COMPLETED order', () => {
  const { queryByText } = render(
    <OrderInfoBox
      status={OrderStatus.Completed}
      type="FOOD"
      photos={4}
      duration={60}
      companyName="fake_company"
      startDate="2020-09-05T14:00:00.000+0000"
      timezone="Europe/Rome"
      downloadLink={'fake_link'}
      onScheduleOrder={() => {}}
    />
  );

  expect(queryByText(i18n.t('orderInfo.download'))).toBeNull();
});

test('action label content with order in status UNSCHEDULED', () => {
  const { queryByText } = render(
    <OrderInfoBox
      status={OrderStatus.Unscheduled}
      type="FOOD"
      photos={4}
      duration={60}
      companyName="fake_company"
      startDate="2020-09-05T14:00:00.000+0000"
      timezone="Europe/Rome"
      downloadLink={'fake_link'}
      onScheduleOrder={() => {}}
    />
  );

  expect(queryByText(i18n.t('orderInfo.chooseAnotherDate'))).toBeVisible();
});

test('action label content with order in status BOOKED but not yet rescheduled', () => {
  const { queryByText } = render(
    <OrderInfoBox
      status={OrderStatus.Booked}
      type="FOOD"
      photos={4}
      duration={60}
      companyName="fake_company"
      startDate="2020-09-05T14:00:00.000+0000"
      timezone="Europe/Rome"
      downloadLink={'fake_link'}
      yetRescheduled={false}
      onScheduleOrder={() => {}}
    />
  );

  expect(queryByText(i18n.t('orderInfo.reschedule'))).toBeVisible();
});

test('action label content with order in status BOOKED but and yet rescheduled', () => {
  const { queryByText } = render(
    <OrderInfoBox
      status={OrderStatus.Booked}
      type="FOOD"
      photos={4}
      duration={60}
      companyName="fake_company"
      startDate="2020-09-05T14:00:00.000+0000"
      timezone="Europe/Rome"
      downloadLink={'fake_link'}
      yetRescheduled
      onScheduleOrder={() => {}}
    />
  );

  expect(queryByText(i18n.t('orderInfo.chooseAnotherDate'))).toBeNull();
  expect(queryByText(i18n.t('orderInfo.needHelp'))).toBeNull();
});

test('action label content with order in status COMPLETED', () => {
  const { queryByText } = render(
    <OrderInfoBox
      status={OrderStatus.Completed}
      type="FOOD"
      photos={4}
      duration={60}
      companyName="fake_company"
      startDate="2020-09-05T14:00:00.000+0000"
      timezone="Europe/Rome"
      downloadLink={'fake_link'}
      onScheduleOrder={() => {}}
    />
  );

  expect(queryByText(i18n.t('orderInfo.chooseAnotherDate'))).toBeNull();
  expect(queryByText(i18n.t('orderInfo.needHelp'))).toBeNull();
});
