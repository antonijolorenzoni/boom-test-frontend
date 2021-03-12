import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QuickActionIcon } from './QuickActionIcon';
import { OrderStatus } from 'types/OrderStatus';
import { ModalProvider } from 'hook/useModal';
import { withStoreRender } from 'utils/test-utils';
import translations from 'i18next';
import { download } from 'utils/download';
import { confirmShootingPhotosDownload, createCompanyShootingScore } from 'api/shootingsAPI';
import { deleteOrder } from 'api/ordersAPI';

const orderResponse = {
  address: 'corso magenta',
  companyId: 1,
  companyName: 'company',
  countryIsoCode: 'it',
  createdAt: '1111',
  orderCode: 'xxx-0000',
  orderStatus: OrderStatus.Accepted,
  orderTitle: 'order title',
  timezone: 'CET',
  updatedAt: '2222',
};

jest.mock('api/ordersAPI', () => ({
  deleteOrder: jest.fn(),
}));

jest.mock('api/shootingsAPI', () => ({
  confirmShootingPhotosDownload: jest.fn(),
  createCompanyShootingScore: jest.fn(),
}));

jest.mock('utils/download', () => ({
  download: jest.fn(),
}));

const onUpdateOrders = jest.fn();

beforeEach(jest.resetAllMocks);

test('delete quick action', async () => {
  const order = { orderId: 1, startDate: '', companyScore: null, downloadLink: '', originalStatus: OrderStatus.Accepted };

  withStoreRender(
    <ModalProvider>
      <QuickActionIcon
        order={{ ...orderResponse, ...order }}
        onUpdateOrders={onUpdateOrders}
        DeleteModal={({ _, _1, onConfirmCancellation }) => (
          <div data-testid="fake-delete-panel" onClick={() => onConfirmCancellation('reason', 'text')}></div>
        )}
      />
    </ModalProvider>,
    { initialState: { user: { data: { organization: 1 } } } }
  );

  expect(screen.queryByTestId('quick-action-icon')).toBeInTheDocument();

  expect(screen.queryByTestId('delete-icon')).toBeInTheDocument();
  expect(screen.queryByTestId('delete-disabled-icon')).not.toBeInTheDocument();
  expect(screen.queryByTestId('download-icon')).not.toBeInTheDocument();
  expect(screen.queryByTestId('rated-icon')).not.toBeInTheDocument();
  expect(screen.queryByTestId('to-be-rate-icon')).not.toBeInTheDocument();

  expect(screen.queryByTestId('fake-delete-panel')).not.toBeInTheDocument();

  fireEvent.click(screen.getByTestId('quick-action-icon'));

  await waitFor(() => screen.findByTestId('fake-delete-panel'));

  fireEvent.click(screen.getByTestId('fake-delete-panel'));

  await waitFor(() => expect(deleteOrder).toHaveBeenCalledTimes(1));
  expect(deleteOrder).toHaveBeenCalledWith(1, 'reason', 'text');
});

test('delete disabled quick action', async () => {
  const order = { orderId: 1, startDate: '', companyScore: null, downloadLink: '', originalStatus: OrderStatus.Uploaded };

  withStoreRender(
    <ModalProvider>
      <QuickActionIcon order={{ ...orderResponse, ...order }} onUpdateOrders={onUpdateOrders} />
    </ModalProvider>,
    { initialState: { user: { data: { organization: 1 } } } }
  );

  expect(screen.queryByTestId('quick-action-icon')).toBeInTheDocument();

  expect(screen.queryByTestId('delete-disabled-icon')).toBeInTheDocument();
  expect(screen.queryByTestId('delete-icon')).not.toBeInTheDocument();
  expect(screen.queryByTestId('download-icon')).not.toBeInTheDocument();
  expect(screen.queryByTestId('rated-icon')).not.toBeInTheDocument();
  expect(screen.queryByTestId('to-be-rate-icon')).not.toBeInTheDocument();

  fireEvent.mouseOver(screen.getByTestId('delete-disabled-icon'));

  expect(screen.queryByText(translations.t('dashboards.deleteOrderDisabled') as string)).toBeInTheDocument();

  fireEvent.click(screen.getByTestId('quick-action-icon'));

  expect(screen.queryByTestId('cancellation-reasons')).not.toBeInTheDocument();
});

test('download quick action', async () => {
  const order = { orderId: 1, startDate: '', companyScore: null, downloadLink: 'downloadLink', originalStatus: OrderStatus.Done };

  withStoreRender(
    <ModalProvider>
      <QuickActionIcon order={{ ...orderResponse, ...order }} onUpdateOrders={onUpdateOrders} />
    </ModalProvider>,
    { initialState: { user: { data: { organization: 1 } } } }
  );

  expect(screen.queryByTestId('quick-action-icon')).toBeInTheDocument();

  expect(screen.queryByTestId('download-icon')).toBeInTheDocument();
  expect(screen.queryByTestId('delete-icon')).not.toBeInTheDocument();
  expect(screen.queryByTestId('delete-disabled-icon')).not.toBeInTheDocument();
  expect(screen.queryByTestId('rated-icon')).not.toBeInTheDocument();
  expect(screen.queryByTestId('to-be-rate-icon')).not.toBeInTheDocument();

  fireEvent.click(screen.getByTestId('quick-action-icon'));

  await waitFor(() => expect(confirmShootingPhotosDownload).toHaveBeenCalledTimes(1));
  expect(confirmShootingPhotosDownload).toHaveBeenCalledWith(1, 1);

  expect(download).toHaveBeenCalledTimes(1);
  expect(download).toHaveBeenCalledWith('downloadLink', 'xxx-0000.zip');

  await waitFor(() => expect(onUpdateOrders).toHaveBeenCalledTimes(1));
});

test('rated quick action', async () => {
  const order = { orderId: 1, startDate: '', companyScore: 4, downloadLink: '', originalStatus: OrderStatus.Downloaded };

  withStoreRender(
    <ModalProvider>
      <QuickActionIcon order={{ ...orderResponse, ...order }} onUpdateOrders={onUpdateOrders} />
    </ModalProvider>,
    { initialState: { user: { data: { organization: 1 } } } }
  );

  expect(screen.queryByTestId('quick-action-icon')).toBeInTheDocument();

  expect(screen.queryByTestId('delete-icon')).not.toBeInTheDocument();
  expect(screen.queryByTestId('delete-disabled-icon')).not.toBeInTheDocument();
  expect(screen.queryByTestId('download-icon')).not.toBeInTheDocument();
  expect(screen.queryByTestId('rated-icon')).toBeInTheDocument();
  expect(screen.queryByTestId('to-be-rate-icon')).not.toBeInTheDocument();

  expect(screen.queryByTestId('feedback-client-panel')).not.toBeInTheDocument();

  fireEvent.click(screen.getByTestId('quick-action-icon'));

  expect(screen.queryByTestId('feedback-client-panel')).not.toBeInTheDocument();

  screen.findByText('4');
});

test('to be rated quick action', async () => {
  const order = { orderId: 1, startDate: '', companyScore: null, downloadLink: '', originalStatus: OrderStatus.Downloaded };

  withStoreRender(
    <ModalProvider>
      <QuickActionIcon
        order={{ ...orderResponse, ...order }}
        onUpdateOrders={onUpdateOrders}
        FeedbackModal={({ _, onConfirm }) => <div data-testid="fake-feedback-panel" onClick={() => onConfirm(4, 'note')}></div>}
      />
    </ModalProvider>,
    { initialState: { user: { data: { organization: 1 } } } }
  );
  expect(screen.queryByTestId('quick-action-icon')).toBeInTheDocument();

  expect(screen.queryByTestId('delete-icon')).not.toBeInTheDocument();
  expect(screen.queryByTestId('delete-disabled-icon')).not.toBeInTheDocument();
  expect(screen.queryByTestId('download-icon')).not.toBeInTheDocument();
  expect(screen.queryByTestId('rated-icon')).not.toBeInTheDocument();
  expect(screen.queryByTestId('to-be-rate-icon')).toBeInTheDocument();

  expect(screen.queryByTestId('fake-feedback-panel')).not.toBeInTheDocument();

  fireEvent.click(screen.getByTestId('quick-action-icon'));

  await waitFor(() => screen.findByTestId('fake-feedback-panel'));

  fireEvent.click(screen.getByTestId('fake-feedback-panel'));

  await waitFor(() => expect(createCompanyShootingScore).toHaveBeenCalledTimes(1));
  expect(createCompanyShootingScore).toHaveBeenCalledWith(1, 1, {
    companyScore: 4,
    comment: 'note',
  });
});
