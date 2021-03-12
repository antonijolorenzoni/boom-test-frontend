import React from 'react';
import { screen, within } from '@testing-library/react';
import moment from 'moment';
import '@testing-library/jest-dom';

import AbilityProvider from 'utils/AbilityProvider';
import translations from 'translations/i18next';

import { ShootingInfoDetails } from '.';
import { withStoreRender } from 'utils/test-utils';
import { useSubscription } from 'hook/useSubscription';
import { Tier } from 'types/Tier';
import { SHOOTINGS_STATUSES, SHOOTING_STATUSES_UI_ELEMENTS } from 'config/consts';
import { OrderStatus } from 'types/OrderStatus';

const matchedColor = SHOOTING_STATUSES_UI_ELEMENTS[SHOOTINGS_STATUSES.MATCHED].color;

const props = {
  isBoom: false,
  isPhotographer: false,
  isCcUser: false,
  isSMB: false,
  backgroundStyle: { backgroundColor: matchedColor },
  statusColor: matchedColor,
  shooting: {
    id: 762,
    code: 'SWT34-762',
    title: 'Order title',
    company: { id: 34, name: 'SweetGuest Italia', organization: 15, tier: Tier.ENTERPRISE },
    photographerId: null,
    startDate: moment().add('2', 'days'),
    endDate: moment().add('2', 'days'),
    timezone: 'Europe/Rome',
    place: {
      placeId: 'ChIJQQaQDzDEhkcRPXMFktN5Fvg',
      formattedAddress: 'Corso Lodi, Milano MI, Italy',
      city: 'Milano',
      street: 'Corso Lodi',
      timezone: 'Europe/Rome',
      location: { latitude: 45.44565799999999, longitude: 9.2131335 },
    },
    pricingPackageId: 11,
    state: SHOOTINGS_STATUSES.MATCHED,
    createdAt: 1594132634000,
    updatedAt: 1594132671000,
    downloadLink: 'http://localhost:8080/api/v1/public/shootings/images/8f624e787669d5d1164288c81635ac087511122e8cd8755aa7dbbd179b5263a5',
    distance: null,
    travelExpenses: null,
    deliveryMethods: [],
    deliveryStatus: null,
    pricingPackage: {
      id: 11,
      name: 'Pacchetto 1',
      photosQuantity: 100,
      shootingDuration: 120,
      companyPrice: 3000,
      photographerEarning: null,
      photoType: { id: 1, type: 'EVENTS' },
      authorizedCompanies: [
        { id: 34, name: 'SweetGuest Italia', organization: 15, parentCompany: 15, createdAt: 1541672803000, updatedAt: 1594020765000 },
        { id: 15, name: 'SweetGuest', organization: 15, parentCompany: 1, createdAt: 1540904177000, updatedAt: 1570108896000 },
      ],
      organizationId: 15,
      currency: { id: 2, alphabeticCode: 'USD', numericCode: 840, displayName: 'US Dollar', symbol: '$' },
      deleted: false,
    },
    description: null,
    contact: null,
    logisticInformation: null,
    refund: null,
    uploadComments: null,
    stateChangedAt: 1594132671000,
    processing: false,
    completedAt: null,
    mainContact: { fullName: 'asd', email: 'ste@boom.co', phoneNumber: '+393407272724' },
    canBeRescheduled: true,
    events: [],
  },
};

jest.mock('api/userAPI');

jest.mock('hook/useSmbProfile', () => ({
  useSmbProfile: () => ({
    smbProfile: undefined,
    error: undefined,
  }),
}));

jest.mock('hook/useSubscription');

const useSubscriptionMock = useSubscription;

const organizationAbilityProviderHelper = AbilityProvider.getOrganizationAbilityHelper();
const companyAbilityProviderHelper = AbilityProvider.getCompanyAbilityHelper();

const initialState = {
  user: {
    data: {
      id: 1,
      firstName: 'Tek Min',
      lastName: 'cik',
    },
  },
};

beforeEach(() => {
  jest.clearAllMocks();
  organizationAbilityProviderHelper.updateAbilities([]);
  companyAbilityProviderHelper.updateAbilities([]);
});

test('ShootingInfoDetails - client can reschedule an order if flag canBeRescheduled is true and he/she has permission', async () => {
  organizationAbilityProviderHelper.updateAbilities([{ subject: 'SHOOTING', action: 'UPDATE' }]);
  companyAbilityProviderHelper.updateAbilities([{ subject: 'SHOOTING', action: 'UPDATE' }]);

  useSubscriptionMock.mockImplementation(() => ({ subscription: undefined }));

  withStoreRender(<ShootingInfoDetails {...props} />, { initialState });

  screen.getByText(translations.t('shootings.reschedule'));
  expect(screen.queryByText(translations.t('shootings.cloneOrder'))).not.toBeInTheDocument();
});

test('ShootingInfoDetails - client cannot reschedule an order if flag canBeRescheduled is true but he/she has not permissions', async () => {
  withStoreRender(<ShootingInfoDetails {...props} />, { initialState });

  expect(screen.queryByText(translations.t('shootings.reschedule'))).not.toBeInTheDocument();
  expect(screen.queryByText(translations.t('shootings.cloneOrder'))).not.toBeInTheDocument();
});

test('ShootingInfoDetails - client cannot reschedule an order if flag canBeRescheduled is false', async () => {
  organizationAbilityProviderHelper.updateAbilities([{ subject: 'SHOOTING', action: 'UPDATE' }]);
  companyAbilityProviderHelper.updateAbilities([{ subject: 'SHOOTING', action: 'UPDATE' }]);

  useSubscriptionMock.mockImplementation(() => ({ subscription: undefined }));

  withStoreRender(<ShootingInfoDetails {...props} shooting={{ ...props.shooting, canBeRescheduled: false }} />, {
    initialState,
  });

  expect(screen.queryByText(translations.t('shootings.reschedule'))).not.toBeInTheDocument();
  expect(screen.queryByText(translations.t('shootings.cloneOrder'))).not.toBeInTheDocument();
});

test('ShootingInfoDetails - rescheduled disabled if SMB user is in grace period', () => {
  organizationAbilityProviderHelper.updateAbilities([{ subject: 'SHOOTING', action: 'UPDATE' }]);
  companyAbilityProviderHelper.updateAbilities([{ subject: 'SHOOTING', action: 'UPDATE' }]);

  useSubscriptionMock.mockImplementation(() => ({ subscription: { subscriptionStatus: 'UNSUBSCRIBED_GRACE' } }));

  withStoreRender(<ShootingInfoDetails {...props} isSMB />, {
    initialState,
  });

  expect(screen.getByTestId('reschedule-btn')).toBeDisabled();
  expect(screen.queryByText(translations.t('shootings.cloneOrder'))).not.toBeInTheDocument();
});

test('ShootingInfoDetails - rescheduled enabled if SMB user is not in grace period', () => {
  organizationAbilityProviderHelper.updateAbilities([{ subject: 'SHOOTING', action: 'UPDATE' }]);
  companyAbilityProviderHelper.updateAbilities([{ subject: 'SHOOTING', action: 'UPDATE' }]);

  useSubscriptionMock.mockImplementation(() => ({ subscription: { subscriptionStatus: 'FAKE' } }));

  withStoreRender(<ShootingInfoDetails {...props} isSMB />, {
    initialState,
  });

  expect(screen.getByTestId('reschedule-btn')).toBeEnabled();
  expect(screen.queryByText(translations.t('shootings.cloneOrder'))).not.toBeInTheDocument();
});

test('ShootingInfoDetails (SalesInfoMatched) - SMB token should not be visible, tier enterprise', () => {
  organizationAbilityProviderHelper.updateAbilities([{ subject: 'SHOOTING', action: 'UPDATE' }]);
  companyAbilityProviderHelper.updateAbilities([{ subject: 'SHOOTING', action: 'UPDATE' }]);

  useSubscriptionMock.mockImplementation(() => ({ subscription: { subscriptionStatus: 'FAKE' } }));

  withStoreRender(<ShootingInfoDetails {...props} isBoom />, {
    initialState,
  });

  expect(within(screen.getByTestId('sales-info-title')).queryByText('SMB')).not.toBeInTheDocument();
  expect(screen.queryByText(translations.t('shootings.cloneOrder'))).not.toBeInTheDocument();
});

test('ShootingInfoDetails - Clone order button visible in RESHOT state', () => {
  organizationAbilityProviderHelper.updateAbilities([{ subject: 'SHOOTING', action: 'UPDATE' }]);
  companyAbilityProviderHelper.updateAbilities([{ subject: 'SHOOTING', action: 'UPDATE' }]);

  useSubscriptionMock.mockImplementation(() => ({ subscription: { subscriptionStatus: 'FAKE' } }));

  withStoreRender(<ShootingInfoDetails {...props} shooting={{ ...props.shooting, state: OrderStatus.Reshoot }} isBoom />, {
    initialState,
  });

  expect(within(screen.getByTestId('sales-info-title')).queryByText('SMB')).not.toBeInTheDocument();
  expect(screen.getByText(translations.t('shootings.cloneOrder')));
});

test('ShootingInfoDetails - Clone order button visible in RESHOT state for photographer, not visible', () => {
  organizationAbilityProviderHelper.updateAbilities([{ subject: 'SHOOTING', action: 'UPDATE' }]);
  companyAbilityProviderHelper.updateAbilities([{ subject: 'SHOOTING', action: 'UPDATE' }]);

  useSubscriptionMock.mockImplementation(() => ({ subscription: { subscriptionStatus: 'FAKE' } }));

  withStoreRender(<ShootingInfoDetails {...props} shooting={{ ...props.shooting, state: OrderStatus.Reshoot }} isPhotographer />, {
    initialState,
  });

  expect(within(screen.getByTestId('sales-info-title')).queryByText('SMB')).not.toBeInTheDocument();
  expect(screen.queryByText(translations.t('shootings.cloneOrder'))).not.toBeInTheDocument();
});

test('ShootingInfoDetails (SalesInfo) - SMB token should not be visible, photographer', () => {
  organizationAbilityProviderHelper.updateAbilities([{ subject: 'SHOOTING', action: 'UPDATE' }]);
  companyAbilityProviderHelper.updateAbilities([{ subject: 'SHOOTING', action: 'UPDATE' }]);

  useSubscriptionMock.mockImplementation(() => ({ subscription: { subscriptionStatus: 'FAKE' } }));

  withStoreRender(
    <ShootingInfoDetails
      {...props}
      isPhotographer
      shooting={{ ...props.shooting, state: SHOOTINGS_STATUSES.DONE, company: { ...props.shooting.company, tier: Tier.SMB } }}
    />,
    {
      initialState,
    }
  );

  expect(within(screen.getByTestId('sales-info-title')).queryByText('SMB')).not.toBeInTheDocument();
});

test('ShootingInfoDetails (SalesInfoMatched) - SMB token should be visible', () => {
  organizationAbilityProviderHelper.updateAbilities([{ subject: 'SHOOTING', action: 'UPDATE' }]);
  companyAbilityProviderHelper.updateAbilities([{ subject: 'SHOOTING', action: 'UPDATE' }]);

  useSubscriptionMock.mockImplementation(() => ({ subscription: { subscriptionStatus: 'FAKE' } }));

  withStoreRender(
    <ShootingInfoDetails {...props} shooting={{ ...props.shooting, company: { ...props.shooting.company, tier: Tier.SMB } }} isBoom />,
    {
      initialState,
    }
  );

  expect(within(screen.getByTestId('sales-info-title')).getByText('SMB')).toBeInTheDocument();
  expect(within(screen.getByTestId('sales-info-title')).getByText('SMB').parentElement).toHaveStyle(
    `border: 1px solid ${matchedColor}; background-color: rgba(184,134,11,0.2);`
  );
});

test('ShootingInfoDetails (SalesInfo) - SMB token should be visible', () => {
  organizationAbilityProviderHelper.updateAbilities([{ subject: 'SHOOTING', action: 'UPDATE' }]);
  companyAbilityProviderHelper.updateAbilities([{ subject: 'SHOOTING', action: 'UPDATE' }]);

  useSubscriptionMock.mockImplementation(() => ({ subscription: { subscriptionStatus: 'FAKE' } }));

  const doneColor = SHOOTING_STATUSES_UI_ELEMENTS[SHOOTINGS_STATUSES.DONE].color;

  withStoreRender(
    <ShootingInfoDetails
      {...props}
      backgroundStyle={{ backgroundColor: doneColor }}
      statusColor={doneColor}
      shooting={{ ...props.shooting, state: SHOOTINGS_STATUSES.DONE, company: { ...props.shooting.company, tier: Tier.SMB } }}
      isBoom
    />,
    {
      initialState,
    }
  );

  expect(within(screen.getByTestId('sales-info-title')).getByText('SMB')).toBeInTheDocument();
  expect(within(screen.getByTestId('sales-info-title')).getByText('SMB').parentElement).toHaveStyle(
    `border: 1px solid ${doneColor}; background-color: rgba(178, 223, 138, 0.2);`
  );
});
