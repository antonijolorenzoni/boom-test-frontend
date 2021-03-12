import React, { useState } from 'react';
import { render, waitFor, within, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UnscheduledOrdersTable } from './UnscheduledOrdersTable';
import translations from 'translations/i18next';
import { SHOOTINGS_STATUSES } from 'config/consts';
import _ from 'lodash';
import { useSelector } from 'react-redux';

const orders = [
  {
    orderId: 1,
    orderCode: 'bl00012345',
    orderStatus: SHOOTINGS_STATUSES.UNSCHEDULED,
    contactName: 'Mariano Giovanni Giovanni Giovanni',
    businessName: 'Pizza kebab instanbul falafel',
    notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    updatedAt: '2020-07-17T10:00:00.000+0000',
    createdAt: '2020-07-16T10:00:00.000+0000',
    assignee: 'Mario',
    countryCode: 'IT',
    companyName: 'SweetGuest',
  },
  {
    orderId: 2,
    orderCode: 'bl00034567',
    orderStatus: SHOOTINGS_STATUSES.UNSCHEDULED,
    contactName: 'Marco Rossi',
    businessName: 'La brace accesa',
    notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    updatedAt: '2020-07-17T10:00:00.000+0000',
    createdAt: '2020-07-16T10:00:00.000+0000',
    assignee: 'Giovanni',
    countryCode: 'IT',
    companyName: 'SweetGuest',
  },
  {
    orderId: 3,
    orderCode: 'ch00032',
    orderStatus: SHOOTINGS_STATUSES.UNSCHEDULED,
    contactName: 'Francesco Filippini',
    businessName: 'Ciaone',
    notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    updatedAt: '2020-07-17T10:00:00.000+0000',
    createdAt: '2020-07-16T10:00:00.000+0000',
    assignee: 'Stefano',
    countryCode: 'IT',
    companyName: 'SweetGuest',
  },
  {
    orderId: 4,
    orderCode: 'ch00032',
    orderStatus: SHOOTINGS_STATUSES.UNSCHEDULED,
    contactName: 'Francesco Filippini',
    businessName: 'Ciaone',
    notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    updatedAt: '2020-07-17T10:00:00.000+0000',
    createdAt: '2020-07-16T10:00:00.000+0000',
    assignee: 'Stefano',
    countryCode: 'IT',
    companyName: 'SweetGuest',
  },
];

jest.mock('axios', () => {
  const axios = jest.requireActual('axios');

  axios.create = jest.fn().mockImplementation(() => axios);

  axios.get = jest.fn().mockImplementation((url) => {
    return Promise.resolve([]);
  });

  return axios;
});

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('moment', () => ({
  __esModule: true,
  ...jest.requireActual('moment'),
  default: jest.fn().mockImplementation((date) => jest.requireActual('moment')(date || '2020-07-20T10:00:00.000+0000')),
}));

useSelector.mockImplementation((selector) =>
  selector({
    user: {
      data: {
        id: 1,
        firstName: 'Tek Min',
        lastName: 'cik',
        language: 'ENGLISH',
      },
    },
  })
);

test('table is rendered correctly', async () => {
  const { container } = render(
    <UnscheduledOrdersTable
      isBoom={true}
      data={orders}
      onSetUpdatedFilter={() => {}}
      onSetCreatedFilter={() => {}}
      onSelectRow={() => {}}
      pageIndex={0}
      onUpdatePageIndex={() => {}}
      updatedFilter={null}
      createdFilter={null}
      groupedSelectedOrder={{}}
      updatedAtOrder={null}
      createdAtOrder="DESC"
      onSelectOrder={() => {}}
      onChangeAssignee={() => {}}
      onBulkAssignOperators={() => {}}
      onSelectAllOrders={() => {}}
      totalPages={2}
      pageSize={20}
      onSetPageSize={() => {}}
    />
  );

  await waitFor(() => container);

  expect(container).toBeVisible();
});

test('headers are rendered correctly', async () => {
  const { container } = render(
    <UnscheduledOrdersTable
      isBoom={true}
      data={orders}
      onSetUpdatedFilter={() => {}}
      onSetCreatedFilter={() => {}}
      onSelectRow={() => {}}
      pageIndex={0}
      onUpdatePageIndex={() => {}}
      updatedFilter={null}
      createdFilter={null}
      groupedSelectedOrder={{}}
      updatedAtOrder={null}
      createdAtOrder="DESC"
      onSelectOrder={() => {}}
      onChangeAssignee={() => {}}
      onBulkAssignOperators={() => {}}
      onSelectAllOrders={() => {}}
      totalPages={2}
      pageSize={20}
      onSetPageSize={() => {}}
    />
  );

  await waitFor(() => container);

  const ths = container.querySelectorAll('thead > tr th');
  expect(ths.length).toBe(10);
  expect(ths.item(0).textContent).toEqual(translations.t('order.code'));
  expect(ths.item(1).textContent).toEqual(translations.t('order.status'));
  expect(ths.item(2).textContent).toEqual(translations.t('order.contact'));
  expect(ths.item(3).textContent).toEqual(translations.t('general.businessName'));
  expect(ths.item(4).textContent).toEqual(translations.t('order.country'));
  expect(ths.item(5).textContent).toEqual(translations.t('order.company'));
  expect(ths.item(6).textContent).toEqual(translations.t('order.notes'));
  expect(ths.item(7).textContent).toEqual(`${translations.t('general.modified')}import_export`);
  expect(ths.item(8).textContent).toEqual(`${translations.t('general.created')}arrow_downward`);
  expect(ths.item(9).textContent).toEqual(translations.t('general.assignee'));
});

test('rows are rendered correctly', async () => {
  const { container, getByText } = render(
    <UnscheduledOrdersTable
      isBoom={true}
      data={orders}
      onSetUpdatedFilter={() => {}}
      onSetCreatedFilter={() => {}}
      onSelectRow={() => {}}
      pageIndex={0}
      onUpdatePageIndex={() => {}}
      updatedFilter={null}
      createdFilter={null}
      groupedSelectedOrder={{}}
      updatedAtOrder={null}
      createdAtOrder="DESC"
      onSelectOrder={() => {}}
      onChangeAssignee={() => {}}
      onBulkAssignOperators={() => {}}
      onSelectAllOrders={() => {}}
      totalPages={2}
      pageSize={20}
      onSetPageSize={() => {}}
    />
  );

  await waitFor(() => container);

  const tds = container.querySelectorAll('tbody > tr:first-child td');
  const contactCell = container.querySelector('tbody > tr td:nth-child(3) p');
  const businessNameCell = container.querySelector('tbody > tr td:nth-child(4) p');

  await waitFor(() => getByText(/Mario/i));

  expect(tds.length).toBe(10);
  expect(tds.item(0).textContent).toEqual('bl00012345');
  expect(tds.item(1).textContent).toEqual(_.capitalize(SHOOTINGS_STATUSES.UNSCHEDULED));
  expect(tds.item(4).textContent).toEqual('Italy');
  expect(tds.item(5).textContent).toEqual('SweetGuest');
  expect(tds.item(6).textContent).toEqual('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
  expect(tds.item(7).textContent).toEqual('3d');
  expect(tds.item(8).textContent).toEqual('4d');
  expect(tds.item(9).children.item(0).children.item(0).children.item(1).textContent).toEqual('Mario');
  expect(contactCell.textContent).toEqual('Mariano Giovanni Giovanni Giovanni');
  expect(businessNameCell.textContent).toEqual('Pizza kebab instanbul falafel');
});

test('rows have correct color when selected', async () => {
  const { container } = render(
    <UnscheduledOrdersTable
      isBoom={true}
      data={orders}
      updatedAtOrder={null}
      createdAtOrder="DESC"
      onSetUpdatedAtOrder={() => {}}
      onSetCreatedAtOrder={() => {}}
      onSelectOrder={() => {}}
      onSelectRow={() => {}}
      onBulkAssignOperators={() => {}}
      onChangeAssignee={() => {}}
      onSelectAllOrders={() => {}}
      pageIndex={0}
      onUpdatePageIndex={() => {}}
      totalPages={2}
      pageSize={20}
      onSetPageSize={() => {}}
      groupedSelectedOrder={{ 0: { orders: [1, 2], selectedAll: false } }}
    />
  );

  await waitFor(() => container);
  const trs = container.querySelectorAll('tbody > tr');

  expect(trs.item(0)).toHaveStyle('background-color: #e2efef');
  expect(trs.item(1)).toHaveStyle('background-color: #edf8f6');
  expect(trs.item(2)).toHaveStyle('background-color: #f4f5f6');
  expect(trs.item(3)).toHaveStyle('background-color: #ffffff');
});

test('user can change page and find correct data', async () => {
  const pageSize = 20;

  const buildOrderPage = (codeFrom) =>
    Array(pageSize)
      .fill()
      .map((_, i) => ({
        orderId: i + codeFrom,
        orderCode: `code-${i + codeFrom}`,
        orderStatus: SHOOTINGS_STATUSES.UNSCHEDULED,
        contactName: 'Mariano Giovanni Giovanni Giovanni',
        businessName: 'Pizza kebab instanbul falafel',
        notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        updatedAt: '2020-07-17T10:00:00.000+0000',
        createdAt: '2020-07-16T10:00:00.000+0000',
        assignee: 'Mario',
        countryCode: 'IT',
        companyName: 'SweetGuest',
      }));

  const FakeDashboard = () => {
    const [page, setPage] = useState(0);

    const orders = buildOrderPage(page * 20);

    return (
      <UnscheduledOrdersTable
        isBoom={true}
        data={orders}
        onSetUpdatedFilter={() => {}}
        onSetCreatedFilter={() => {}}
        onSelectRow={() => {}}
        pageIndex={page}
        onUpdatePageIndex={setPage}
        updatedFilter={null}
        createdFilter={null}
        groupedSelectedOrder={{ 0: { orders: [1, 2], selectedAll: false } }}
        updatedAtOrder="DESC"
        createdAtOrder="DESC"
        onSelectOrder={() => {}}
        onChangeAssignee={() => {}}
        onBulkAssignOperators={() => {}}
        onSelectAllOrders={() => {}}
        totalPages={2}
        pageSize={pageSize}
        onSetPageSize={() => {}}
      />
    );
  };

  const { container } = render(<FakeDashboard />);

  await waitFor(() => container);

  const withinPaginator = within(screen.getByTestId('table-paginator'));

  screen.getByText('Page 1 of 2');

  within(container.querySelector('tbody > tr:first-child')).getByText('code-0');

  fireEvent.click(withinPaginator.getByText('navigate_next'));
  screen.getByText('Page 2 of 2');

  within(container.querySelector('tbody > tr:first-child')).getByText('code-20');

  fireEvent.click(withinPaginator.getByText('navigate_before'));
  within(container.querySelector('tbody > tr:first-child')).getByText('code-0');
});
