import React from 'react';
import SmbSubscriptionCard from '.';
import translations from 'translations/i18next';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { withStoreRender } from 'utils/test-utils';
import { SubscriptionStatus } from 'types/SubscriptionStatus';

beforeEach(jest.clearAllMocks);

test('unsubscribed active', async () => {
  withStoreRender(<SmbSubscriptionCard currency={'£'} status={SubscriptionStatus.UNSUBSCRIBED_ACTIVE} remainingDays={17} />, {
    initialState: {},
  });

  screen.getByText(translations.t('smb.planUnsubscribedTitle'));
});

test('subscribed', async () => {
  withStoreRender(<SmbSubscriptionCard currency={'£'} />, {
    initialState: {},
  });

  expect(screen.queryByText(translations.t('smb.planUnsubscribedTitle'))).not.toBeInTheDocument();

  expect(screen.queryByText(translations.t('smb.planTrailingTitle'))).not.toBeInTheDocument();
  expect(screen.queryByText(translations.t('smb.planExpiredTitle'))).not.toBeInTheDocument();
});

test('grace', async () => {
  withStoreRender(<SmbSubscriptionCard currency={'£'} status={SubscriptionStatus.UNSUBSCRIBED_GRACE} />, {
    initialState: {},
  });

  expect(screen.queryByText(translations.t('smb.planExpiredTitle'))).toBeInTheDocument();
  expect(screen.queryByText(translations.t('smb.planExpiredGraceDescription'))).toBeInTheDocument();

  expect(screen.queryByText(translations.t('smb.planUnsubscribedTitle'))).not.toBeInTheDocument();
  expect(screen.queryByText(translations.t('smb.planUnsubscribedDescription'))).not.toBeInTheDocument();
  expect(screen.queryByText(translations.t('smb.planTrailingTitle'))).not.toBeInTheDocument();
});

test('trailing', async () => {
  withStoreRender(<SmbSubscriptionCard currency={'£'} status={SubscriptionStatus.TRIALING} freeTrailRemainingDays={15} />, {
    initialState: {},
  });

  expect(screen.queryByText(translations.t('smb.planTrailingTitle'))).toBeInTheDocument();
  expect(screen.queryByText(translations.t('smb.planTrailingDescription', { remainingDays: 15 }))).toBeInTheDocument();

  expect(screen.queryByText(translations.t('smb.planUnsubscribedTitle'))).not.toBeInTheDocument();
  expect(screen.queryByText(translations.t('smb.planUnsubscribedDescription'))).not.toBeInTheDocument();
  expect(screen.queryByText(translations.t('smb.planExpiredTitle'))).not.toBeInTheDocument();
  expect(screen.queryByText(translations.t('smb.planExpiredGraceDescription'))).not.toBeInTheDocument();
});
