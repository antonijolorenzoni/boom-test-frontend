import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { withStoreRender } from 'utils/test-utils';
import { screen } from '@testing-library/react';

import { USER_ROLES } from 'config/consts';
import HeaderMenu from './HeaderMenu';
import translations from 'translations/i18next';
import AbilityProvider from 'utils/AbilityProvider';

const abilityProviderHelper = AbilityProvider.getOrganizationAbilityHelper();

beforeEach(() => {
  abilityProviderHelper.updateAbilities([]);
});

const key = (str) => translations.t(`header.${str}`);

jest.mock('config/featureFlags', () => ({ featureFlag: { isFeatureEnabled: () => true } }));

describe('HeaderMenu', () => {
  test(`should show restricted header menu for ${USER_ROLES.ROLE_SMB}`, () => {
    const { queryByText } = screen;
    withStoreRender(
      <MemoryRouter>
        <HeaderMenu />
      </MemoryRouter>,
      {
        initialState: {
          user: {
            data: {
              authorities: [USER_ROLES.ROLE_SMB],
            },
          },
        },
      }
    );
    expect(queryByText(key('dashboard').toUpperCase())).not.toBeNull();
    expect(queryByText(key('activities').toUpperCase())).toBeNull();
    expect(queryByText(key('shootingsHistory').toUpperCase())).toBeNull();
    expect(queryByText(key('companies').toUpperCase())).toBeNull();
    expect(queryByText(key('organization').toUpperCase())).toBeNull();
    expect(queryByText(key('organizations').toUpperCase())).toBeNull();
    expect(queryByText(key('users').toUpperCase())).toBeNull();
    expect(queryByText(key('photographers').toUpperCase())).toBeNull();
    expect(queryByText(key('accounting').toUpperCase())).toBeNull();
    expect(queryByText(key('calendars').toUpperCase())).toBeNull();
    expect(queryByText(key('orders').toUpperCase())).toBeNull();
  });

  test(`should show restricted header menu for ${USER_ROLES.ROLE_PHOTOGRAPHER}`, () => {
    const { queryByText } = screen;
    withStoreRender(
      <MemoryRouter>
        <HeaderMenu />
      </MemoryRouter>,
      {
        initialState: {
          user: {
            data: {
              authorities: [USER_ROLES.ROLE_PHOTOGRAPHER],
            },
          },
        },
      }
    );

    expect(queryByText(key('dashboard').toUpperCase())).toBeNull();
    expect(queryByText(key('activities').toUpperCase())).toBeNull();
    expect(queryByText(key('shootingsHistory').toUpperCase())).not.toBeNull();
    expect(queryByText(key('companies').toUpperCase())).toBeNull();
    expect(queryByText(key('organization').toUpperCase())).toBeNull();
    expect(queryByText(key('organizations').toUpperCase())).toBeNull();
    expect(queryByText(key('users').toUpperCase())).toBeNull();
    expect(queryByText(key('photographers').toUpperCase())).toBeNull();
    expect(queryByText(key('accounting').toUpperCase())).not.toBeNull();
    expect(queryByText(key('calendars').toUpperCase())).not.toBeNull();
    expect(queryByText(key('orders').toUpperCase())).toBeNull();
  });

  test(`should show restricted header menu for ${USER_ROLES.ROLE_CONTACT_CENTER}`, () => {
    const { queryByText } = screen;
    withStoreRender(
      <MemoryRouter>
        <HeaderMenu />
      </MemoryRouter>,
      {
        initialState: {
          user: {
            data: {
              authorities: [USER_ROLES.ROLE_CONTACT_CENTER],
            },
          },
        },
      }
    );

    expect(queryByText(key('dashboard').toUpperCase())).not.toBeNull();
    expect(queryByText(key('activities').toUpperCase())).toBeNull();
    expect(queryByText(key('shootingsHistory').toUpperCase())).toBeNull();
    expect(queryByText(key('companies').toUpperCase())).toBeNull();
    expect(queryByText(key('organization').toUpperCase())).toBeNull();
    expect(queryByText(key('organizations').toUpperCase())).toBeNull();
    expect(queryByText(key('users').toUpperCase())).not.toBeNull();
    expect(queryByText(key('photographers').toUpperCase())).toBeNull();
    expect(queryByText(key('accounting').toUpperCase())).toBeNull();
    expect(queryByText(key('calendars').toUpperCase())).toBeNull();
    expect(queryByText(key('orders').toUpperCase())).toBeNull();
  });

  test(`should show restricted header menu for ${USER_ROLES.ROLE_MANAGER}`, () => {
    const { queryByText } = screen;
    abilityProviderHelper.updateAbilities([
      { subject: 'COMPANY', action: 'CREATE' },
      { subject: 'COMPANY', action: 'READ' },
      { subject: 'COMPANY', action: 'UPDATE' },
      { subject: 'COMPANY', action: 'DELETE' },
      { subject: 'COMPANY', action: 'ACL' },
    ]);

    withStoreRender(
      <MemoryRouter>
        <HeaderMenu />
      </MemoryRouter>,
      {
        initialState: {
          user: {
            data: {
              authorities: [USER_ROLES.ROLE_MANAGER],
            },
          },
        },
      }
    );

    expect(queryByText(key('dashboard').toUpperCase())).not.toBeNull();
    expect(queryByText(key('activities').toUpperCase())).toBeNull();
    expect(queryByText(key('shootingsHistory').toUpperCase())).toBeNull();
    expect(queryByText(key('companies').toUpperCase())).toBeNull();
    expect(queryByText(key('organizations').toUpperCase())).toBeNull();
    expect(queryByText(key('organization').toUpperCase())).not.toBeNull();
    expect(queryByText(key('photographers').toUpperCase())).toBeNull();
    expect(queryByText(key('accounting').toUpperCase())).toBeNull();
    expect(queryByText(key('calendars').toUpperCase())).toBeNull();
    expect(queryByText(key('orders').toUpperCase())).toBeNull();
  });
});
