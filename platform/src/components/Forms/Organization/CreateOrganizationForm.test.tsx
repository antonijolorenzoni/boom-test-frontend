import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';

import translations from 'translations/i18next';
import { withStoreRender } from 'utils/test-utils';
import { CreateOrganizationForm } from './CreateOrganizationForm';
import { OrganizationTier } from 'config/consts';
import { Segment } from 'types/Segment';

jest.mock('axios', () => {
  const axios = jest.requireActual('axios');
  axios.create = jest.fn().mockImplementation(() => axios);
  axios.get = jest.fn();
  axios.post = jest.fn();

  return axios;
});

jest.mock('config/featureFlags', () => {
  return {
    featureFlag: {
      isFeatureEnabled: () => true,
    },
  };
});

beforeEach(jest.clearAllMocks);

test('form is correctly submitted if I want to create an SMB organization', async () => {
  withStoreRender(<CreateOrganizationForm />, {
    initialState: {},
  });

  const organizationNameTextField = screen.getByLabelText(translations.t('organization.name') as string);
  fireEvent.change(organizationNameTextField, {
    target: { value: 'Cool organization' },
  });

  const enterpriseSegmentOption = screen.getByLabelText(translations.t('organization.smallMediumBusiness') as string);
  fireEvent.click(enterpriseSegmentOption);

  await waitFor(() => fireEvent.click(screen.getByTestId('create-organization-btn')));

  expect(axios.post).toBeCalledWith('/api/v1/organizations', {
    name: 'Cool organization',
    tier: OrganizationTier.SMB,
    segment: Segment.SMB,
  });
});

test('form is correctly submitted if I want to create a Mid Market organization', async () => {
  withStoreRender(<CreateOrganizationForm />, {
    initialState: {},
  });

  const organizationNameTextField = screen.getByLabelText(translations.t('organization.name') as string);
  fireEvent.change(organizationNameTextField, {
    target: { value: 'Mid Market organization' },
  });

  const enterpriseSegmentOption = screen.getByLabelText(translations.t('organization.midMarket') as string);
  fireEvent.click(enterpriseSegmentOption);

  await waitFor(() => fireEvent.click(screen.getByTestId('create-organization-btn')));

  expect(axios.post).toBeCalledWith('/api/v1/organizations', {
    name: 'Mid Market organization',
    tier: OrganizationTier.Enterprise,
    segment: Segment.MID_MARKET,
  });
});

test('form is correctly submitted if I want to create an Enterprise organization', async () => {
  withStoreRender(<CreateOrganizationForm />, {
    initialState: {},
  });

  const organizationNameTextField = screen.getByLabelText(translations.t('organization.name') as string);
  fireEvent.change(organizationNameTextField, {
    target: { value: 'Ent organization' },
  });

  const enterpriseSegmentOption = screen.getByLabelText(translations.t('organization.enterprise') as string);
  fireEvent.click(enterpriseSegmentOption);

  await waitFor(() => fireEvent.click(screen.getByTestId('create-organization-btn')));

  expect(axios.post).toBeCalledWith('/api/v1/organizations', {
    name: 'Ent organization',
    tier: OrganizationTier.Enterprise,
    segment: Segment.ENTERPRISE,
  });
});

test('form is not submitted because of name field is not filled', async () => {
  withStoreRender(<CreateOrganizationForm />, {
    initialState: {},
  });

  const enterpriseSegmentOption = screen.getByLabelText(translations.t('organization.enterprise') as string);
  fireEvent.click(enterpriseSegmentOption);

  await waitFor(() => fireEvent.click(screen.getByTestId('create-organization-btn')));

  expect(axios.post).toBeCalledTimes(0);
});
