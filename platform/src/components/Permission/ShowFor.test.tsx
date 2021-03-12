import React from 'react';
import { withStoreRender } from 'utils/test-utils';
import { screen } from '@testing-library/react';
import { ShowForRoles } from 'components/Permission/ShowFor';

describe('ShowFor', () => {
  test('should work correctly whe children is undefined', () => {
    const { queryByText } = screen;
    withStoreRender(
      <>
        {'A'}
        <ShowForRoles></ShowForRoles>
        {'C'}
      </>,
      {
        initialState: {
          user: {
            data: {
              authorities: ['Admin', 'User', 'Moderator'],
            },
          },
        },
      }
    );

    expect(queryByText(/A/i)).not.toBeNull();
    expect(queryByText(/B/i)).toBeNull();
    expect(queryByText(/C/i)).not.toBeNull();
  });
  test('should do not show children when no roles passed', () => {
    const { queryByText } = screen;
    withStoreRender(
      <>
        {'A'}
        <ShowForRoles>{'B'}</ShowForRoles>
        {'C'}
      </>,
      {
        initialState: {
          user: {
            data: {
              authorities: ['Admin', 'User', 'Moderator'],
            },
          },
        },
      }
    );

    expect(queryByText(/A/i)).not.toBeNull();
    expect(queryByText(/B/i)).toBeNull();
    expect(queryByText(/C/i)).not.toBeNull();
  });

  test('should do not show children when user has undefined roles', () => {
    const { queryByText } = screen;
    withStoreRender(
      <>
        {'A'}
        <ShowForRoles roles={['Admin', 'User', 'Moderator']}>{'B'}</ShowForRoles>
        {'C'}
      </>,
      {
        initialState: {},
      }
    );

    expect(queryByText(/A/i)).not.toBeNull();
    expect(queryByText(/B/i)).toBeNull();
    expect(queryByText(/C/i)).not.toBeNull();
  });

  test('should do not show children when user has no roles', () => {
    const { queryByText } = screen;
    withStoreRender(
      <>
        {'A'}
        <ShowForRoles roles={['Admin', 'User', 'Moderator']}>{'B'}</ShowForRoles>
        {'C'}
      </>,
      {
        initialState: {
          user: {
            data: {
              authorities: [],
            },
          },
        },
      }
    );

    expect(queryByText(/A/i)).not.toBeNull();
    expect(queryByText(/B/i)).toBeNull();
    expect(queryByText(/C/i)).not.toBeNull();
  });

  test('should do not show children when user has role that does not match restriction', () => {
    const { queryByText } = screen;
    withStoreRender(
      <>
        {'A'}
        <ShowForRoles roles={['Admin', 'User', 'Moderator']}>{'B'}</ShowForRoles>
        {'C'}
      </>,
      {
        initialState: {
          user: {
            data: {
              authorities: ['Super Admin'],
            },
          },
        },
      }
    );

    expect(queryByText(/A/i)).not.toBeNull();
    expect(queryByText(/B/i)).toBeNull();
    expect(queryByText(/C/i)).not.toBeNull();
  });

  test('should show children when user has role that match restriction', () => {
    const { queryByText } = screen;
    withStoreRender(
      <>
        {'A'}
        <ShowForRoles roles={['Admin', 'User', 'Moderator']}>{'B'}</ShowForRoles>
        {'C'}
      </>,
      {
        initialState: {
          user: {
            data: {
              authorities: ['Admin', 'Super Admin'],
            },
          },
        },
      }
    );

    expect(queryByText(/A/i)).not.toBeNull();
    expect(queryByText(/B/i)).not.toBeNull();
    expect(queryByText(/C/i)).not.toBeNull();
  });
});
