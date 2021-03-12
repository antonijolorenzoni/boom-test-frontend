import React from 'react';
import { useDashboardAllColumns } from './useDashboardAllColumns';
import { Column } from 'react-table';
import { DashboardAllOrder } from 'types/DashboardAllOrderResponse';
import { withStoreRender } from 'utils/test-utils';
import AbilityProvider from 'utils/AbilityProvider';

const TestComponent = ({ children }: { children: (columns: Array<Column<DashboardAllOrder>>) => JSX.Element }) => {
  const columns = useDashboardAllColumns(
    () => {},
    () => {},
    () => {},
    null,
    null,
    null
  );

  return children(columns);
};

const abilityProviderHelper = AbilityProvider.getOrganizationAbilityHelper();

beforeEach(() => {
  abilityProviderHelper.updateAbilities([]);
});

test('hook returns admin columns in dashboard all', () => {
  abilityProviderHelper.updateAbilities([{ subject: 'SHOOTING', actions: 'CREATE' }]);

  withStoreRender(
    <TestComponent>
      {(columns) => {
        expect(columns.length).toBe(12);
        expect(columns.map((c) => c.accessor)).toStrictEqual([
          'orderCode',
          'orderStatus',
          'orderTitle',
          'companyName',
          'packet',
          'countryIsoCode',
          'address',
          'startDate',
          'startDate',
          'photographer',
          'updatedAt',
          'createdAt',
        ]);

        return <>Nothing</>;
      }}
    </TestComponent>,
    { initialState: { user: { data: { organization: 1 } } } }
  );
});

test('hook returns client columns in dashboard all', () => {
  abilityProviderHelper.updateAbilities([{ subject: 'SHOOTING', actions: 'CREATE' }]);

  withStoreRender(
    <TestComponent>
      {(columns) => {
        expect(columns.length).toBe(12);
        expect(columns.map((c) => c.accessor)).toStrictEqual([
          'orderCode',
          'orderStatus',
          'orderTitle',
          'packet',
          'packet',
          'countryIsoCode',
          'address',
          'startDate',
          'startDate',
          'orderId',
          'updatedAt',
          'createdAt',
        ]);

        expect(columns[9].id).toBe('actions');

        return <>Nothing</>;
      }}
    </TestComponent>,
    { initialState: { user: { data: { organization: 123 } } } }
  );
});

test('hook returns client (with no permission) columns in dashboard all: no quick actions', () => {
  withStoreRender(
    <TestComponent>
      {(columns) => {
        expect(columns.length).toBe(11);
        expect(columns.map((c) => c.accessor)).toStrictEqual([
          'orderCode',
          'orderStatus',
          'orderTitle',
          'packet',
          'packet',
          'countryIsoCode',
          'address',
          'startDate',
          'startDate',
          'updatedAt',
          'createdAt',
        ]);

        expect(columns.some((c) => c.id === 'actions')).toBeFalsy();

        return <>Nothing</>;
      }}
    </TestComponent>,
    { initialState: { user: { data: { organization: 123 } } } }
  );
});
