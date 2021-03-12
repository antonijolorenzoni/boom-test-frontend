import React from 'react';
import { SubscriptionInfoPanel } from '.';
import translations from 'translations/i18next';
import { fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { withStoreRender } from 'utils/test-utils';
import { SubscriptionStatus } from 'types/SubscriptionStatus';
import { SMB_SUBSCRIPTIONS_PRICE } from 'config/consts';

import moment from 'moment';

beforeEach(jest.clearAllMocks);

const onUnsubscribe = jest.fn();

test('subscribed', () => {
  withStoreRender(<SubscriptionInfoPanel subscriptionStatus={SubscriptionStatus.SUBSCRIBED} />, {
    initialState: {},
  });

  expect(screen.queryByText(translations.t('smb.noActiveSubscription'))).toBeInTheDocument();

  expect(screen.queryByText(translations.t('smb.clientInGracePeriod'))).not.toBeInTheDocument();
  expect(screen.queryByText(translations.t('smb.customerSupportResponse'))).not.toBeInTheDocument();
  expect(screen.queryByText(translations.t('smb.creditCardHasBeenRefused'))).not.toBeInTheDocument();
  expect(screen.queryByText(translations.t('smb.wasNotPossibleToChargeSubscription'))).not.toBeInTheDocument();
});

test('trialing', () => {
  withStoreRender(
    <SubscriptionInfoPanel
      onUnsubscribe={onUnsubscribe}
      subscriptionStatus={SubscriptionStatus.TRIALING}
      currency={'£'}
      subscriptionEndDate={'2021-01-15T16:54:57.000+0000'}
    />,
    {
      initialState: {},
    }
  );

  expect(screen.queryByText(translations.t('smb.free30DaysTrial'))).toBeInTheDocument();
  expect(screen.queryByText(`${SMB_SUBSCRIPTIONS_PRICE.MONTHLY}£`)).toBeInTheDocument();

  expect(screen.queryByText(translations.t('smb.editingAndGuidelines'))).toBeInTheDocument();
  expect(screen.queryByText(translations.t('smb.freeCancellationRescheduling'))).toBeInTheDocument();

  expect(screen.queryByText(translations.t('smb.unsubscribe'))).toBeInTheDocument();

  fireEvent.click(screen.getByText(translations.t('smb.unsubscribe')));

  expect(onUnsubscribe).toBeCalledTimes(1);

  expect(screen.queryByText(translations.t('smb.noActiveSubscription'))).not.toBeInTheDocument();
  expect(screen.queryByText(translations.t('smb.clientInGracePeriod'))).not.toBeInTheDocument();
  expect(screen.queryByText(translations.t('smb.creditCardHasBeenRefused'))).not.toBeInTheDocument();
  expect(screen.queryByText(translations.t('smb.wasNotPossibleToChargeSubscription'))).not.toBeInTheDocument();
});

test('active', () => {
  withStoreRender(
    <SubscriptionInfoPanel
      onUnsubscribe={onUnsubscribe}
      subscriptionStatus={SubscriptionStatus.ACTIVE}
      currency={'£'}
      subscriptionEndDate={'2021-01-15T16:54:57.000+0000'}
    />,
    {
      initialState: {},
    }
  );

  expect(screen.queryByText(translations.t('smb.free30DaysTrial'))).not.toBeInTheDocument();
  expect(screen.queryByText(`${SMB_SUBSCRIPTIONS_PRICE.MONTHLY}£`)).toBeInTheDocument();

  expect(screen.queryByText(translations.t('smb.editingAndGuidelines'))).toBeInTheDocument();
  expect(screen.queryByText(translations.t('smb.freeCancellationRescheduling'))).toBeInTheDocument();

  expect(screen.queryByText(translations.t('smb.unsubscribe'))).toBeInTheDocument();

  fireEvent.click(screen.getByText(translations.t('smb.unsubscribe')));

  expect(onUnsubscribe).toBeCalledTimes(1);

  expect(screen.queryByText(translations.t('smb.noActiveSubscription'))).not.toBeInTheDocument();
  expect(screen.queryByText(translations.t('smb.clientInGracePeriod'))).not.toBeInTheDocument();
  expect(screen.queryByText(translations.t('smb.creditCardHasBeenRefused'))).not.toBeInTheDocument();
  expect(screen.queryByText(translations.t('smb.wasNotPossibleToChargeSubscription'))).not.toBeInTheDocument();
});

// // FIXME when payment_failed status will be handle
test('payment_failed', () => {
  withStoreRender(
    <SubscriptionInfoPanel subscriptionStatus={SubscriptionStatus.PAYMENT_FAILED} subscriptionEndDate={'2021-01-15T16:54:57.000+0000'} />,
    {
      initialState: {},
    }
  );

  expect(screen.queryByText(translations.t('smb.creditCardHasBeenRefused'))).toBeInTheDocument();
  expect(screen.queryByText(translations.t('smb.wasNotPossibleToChargeSubscription'))).toBeInTheDocument();
  expect(screen.queryByText(translations.t('smb.clientInGracePeriod'))).not.toBeInTheDocument();
});

test('unsubscribed active', () => {
  withStoreRender(
    <SubscriptionInfoPanel
      onUnsubscribe={onUnsubscribe}
      subscriptionStatus={SubscriptionStatus.UNSUBSCRIBED_ACTIVE}
      currency={'$'}
      subscriptionEndDate={'2020-12-15T16:54:57.000+0000'}
    />,
    {
      initialState: {},
    }
  );

  expect(screen.queryByText(translations.t('smb.free30DaysTrial'))).not.toBeInTheDocument();
  expect(screen.queryByText(`${SMB_SUBSCRIPTIONS_PRICE.MONTHLY}$`)).toBeInTheDocument();

  expect(screen.queryByText(translations.t('smb.editingAndGuidelines'))).toBeInTheDocument();
  expect(screen.queryByText(translations.t('smb.freeCancellationRescheduling'))).toBeInTheDocument();

  expect(screen.queryByText(translations.t('smb.unsubscribe'))).not.toBeInTheDocument();

  expect(onUnsubscribe).not.toBeCalled();

  expect(screen.queryByText(translations.t('smb.noActiveSubscription'))).not.toBeInTheDocument();
  expect(screen.queryByText(translations.t('smb.clientInGracePeriod'))).not.toBeInTheDocument();
  expect(screen.queryByText(translations.t('smb.creditCardHasBeenRefused'))).not.toBeInTheDocument();
  expect(screen.queryByText(translations.t('smb.wasNotPossibleToChargeSubscription'))).not.toBeInTheDocument();
});

test('unsubscribed grace', () => {
  withStoreRender(
    <SubscriptionInfoPanel
      subscriptionStatus={SubscriptionStatus.UNSUBSCRIBED_GRACE}
      subscriptionEndDate={'2020-01-15T16:54:57.000+0000'}
    />,
    {
      initialState: {},
    }
  );

  expect(screen.queryByText(translations.t('smb.noActiveSubscription'))).toBeInTheDocument();

  expect(screen.queryByText(translations.t('smb.clientInGracePeriod'))).toBeInTheDocument();
  expect(screen.queryByText(translations.t('smb.customerSupportResponse'))).not.toBeInTheDocument();
  expect(screen.queryByText(translations.t('smb.unsubscribe'))).not.toBeInTheDocument();
  expect(screen.queryByText(translations.t('smb.creditCardHasBeenRefused'))).not.toBeInTheDocument();
  expect(screen.queryByText(translations.t('smb.wasNotPossibleToChargeSubscription'))).not.toBeInTheDocument();
});

test('unsubscribed', () => {
  withStoreRender(
    <SubscriptionInfoPanel subscriptionStatus={SubscriptionStatus.UNSUBSCRIBED} subscriptionEndDate={'2020-01-15T16:54:57.000+0000'} />,
    {
      initialState: {},
    }
  );

  expect(screen.queryByText(translations.t('smb.noActiveSubscription'))).toBeInTheDocument();

  expect(
    screen.queryByText(translations.t('smb.unsubscribedAt', { at: moment('2020-01-15T16:54:57.000+0000').format('MMMM DD YYYY') }))
  ).toBeInTheDocument();

  expect(screen.queryByText(translations.t('smb.clientInGracePeriod'))).not.toBeInTheDocument();
  expect(screen.queryByText(translations.t('smb.customerSupportResponse'))).not.toBeInTheDocument();
  expect(screen.queryByText(translations.t('smb.unsubscribe'))).not.toBeInTheDocument();
  expect(screen.queryByText(translations.t('smb.creditCardHasBeenRefused'))).not.toBeInTheDocument();
  expect(screen.queryByText(translations.t('smb.wasNotPossibleToChargeSubscription'))).not.toBeInTheDocument();
});

test('only info (no status passed)', () => {
  withStoreRender(<SubscriptionInfoPanel currency={'€'} />, {
    initialState: {},
  });

  expect(screen.queryByText(`${SMB_SUBSCRIPTIONS_PRICE.MONTHLY}€`)).toBeInTheDocument();

  expect(screen.queryByText(translations.t('smb.editingAndGuidelines'))).toBeInTheDocument();
  expect(screen.queryByText(translations.t('smb.freeCancellationRescheduling'))).toBeInTheDocument();

  expect(screen.queryByText(translations.t('smb.unsubscribe'))).not.toBeInTheDocument();
});
