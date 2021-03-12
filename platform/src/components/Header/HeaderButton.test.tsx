import React from 'react';
import '@testing-library/jest-dom';
import { withStoreRender } from 'utils/test-utils';
import HeaderButton from './HeaderButton';
import { USER_ROLES } from 'config/consts';
import { SubscriptionStatus } from 'types/SubscriptionStatus';
import { MemoryRouter } from 'react-router-dom';

describe('HeaderButton', () => {
  test('style when user is not a subscriber', () => {
    const { container } = withStoreRender(
      <MemoryRouter>
        <HeaderButton title="my path" paths={['/']} icon={null} iconSelected={null} />
      </MemoryRouter>,
      {
        initialState: {
          user: {
            data: { roles: [{ id: 1, name: USER_ROLES.ROLE_ADMIN }] },
          },
        },
      }
    );

    expect(container.querySelector('a')).toHaveStyle({
      opacity: 1,
      cursor: 'pointer',
    });
  });

  test('style when user is a subscriber', () => {
    const { container } = withStoreRender(
      <MemoryRouter>
        <HeaderButton title="my path" paths={['/']} icon={null} iconSelected={null} />
      </MemoryRouter>,
      {
        initialState: {
          user: {
            data: { roles: [{ id: 11, name: USER_ROLES.ROLE_SMB }] },
            subscriptionStatus: SubscriptionStatus.UNSUBSCRIBED,
          },
        },
      }
    );

    expect(container.querySelector('a')).toHaveStyle({
      opacity: 0.5,
      cursor: 'not-allowed',
    });
  });
});
