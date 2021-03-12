import React from 'react';
import { render, fireEvent, act, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DeleteReasonPanel } from '.';
import translations from 'translations/i18next';
import { withStoreRender } from 'utils/test-utils';
import { USER_ROLES } from 'config/consts';

jest.mock('axios', () => {
  const axios = jest.requireActual('axios');

  axios.create = jest.fn().mockImplementation(() => axios);

  axios.get = jest.fn().mockImplementation((url) => {
    switch (url) {
      case '/api/v1/reasons/cancellation?orderStatus=ACCEPTED&role=Client':
        return Promise.resolve({
          data: [
            { code: 'BOO-001', requiresText: false },
            { code: 'BOO-002', requiresText: false },
            { code: 'BOO-003', requiresText: true },
          ],
        });
      case '/api/v1/reasons/cancellation?orderStatus=ACCEPTED&role=Administrator':
        return Promise.resolve({
          data: [
            { code: 'BOO-001', requiresText: false },
            { code: 'BOO-002', requiresText: false },
            { code: 'BOO-003', requiresText: true },
          ],
        });
      default:
        return Promise.reject(new Error('not found'));
    }
  });

  return axios;
});

describe('DeleteReasonPanel rendering as Admin', () => {
  test('initially the confirm button is not clickable', async () => {
    const confirmCancellationMock = jest.fn();

    withStoreRender(<DeleteReasonPanel orderStatus="ACCEPTED" onConfirmCancellation={confirmCancellationMock} />, {
      initialState: { user: { data: { organization: 1, isPhotographer: false, roles: [{ id: 1, name: USER_ROLES.ROLE_ADMIN }] } } },
    });

    const confirmButton = await screen.findByTestId('button-confirm');
    expect(confirmButton).toBeDisabled();
  });

  test('if first dropdown has no value the reasons dropdown has no option', async () => {
    const confirmCancellationMock = jest.fn();

    withStoreRender(<DeleteReasonPanel orderStatus="ACCEPTED" onConfirmCancellation={confirmCancellationMock} />, {
      initialState: { user: { data: { organization: 1, isPhotographer: false, roles: [{ id: 1, name: USER_ROLES.ROLE_ADMIN }] } } },
    });

    const arrowsDropdown = await screen.findAllByText(/arrow_drop_down/i);

    fireEvent.keyDown(arrowsDropdown[1], { key: 'ArrowDown', code: 40 });

    expect(screen.queryByText(/Photographer not found/i)).toBeNull();
  });

  test("clicking on first dropdown the actor's options appear", async () => {
    const confirmCancellationMock = jest.fn();

    withStoreRender(<DeleteReasonPanel orderStatus="ACCEPTED" onConfirmCancellation={confirmCancellationMock} />, {
      initialState: { user: { data: { organization: 1, isPhotographer: false, roles: [{ id: 1, name: USER_ROLES.ROLE_ADMIN }] } } },
    });

    const arrowsDropdown = await screen.findAllByText(/arrow_drop_down/i);

    fireEvent.keyDown(arrowsDropdown[0], { key: 'ArrowDown', code: 40 });

    //USE CONSTS
    expect(screen.queryByText(translations.t('cancellationActors.BOO-'))).toBeVisible();
  });

  test('selecting "BOOM" option as actor the canc reasons appears on clicking reason dropdown', async () => {
    const confirmCancellationMock = jest.fn();

    withStoreRender(<DeleteReasonPanel orderStatus="ACCEPTED" onConfirmCancellation={confirmCancellationMock} />, {
      initialState: { user: { data: { organization: 1, isPhotographer: false, roles: [{ id: 1, name: USER_ROLES.ROLE_ADMIN }] } } },
    });

    let arrowsDropdown = await screen.findAllByText(/arrow_drop_down/i);

    await fireEvent.keyDown(arrowsDropdown[0], { key: 'ArrowDown', code: 40 });
    await act(async () => {
      await fireEvent.click(screen.queryByText(translations.t('cancellationActors.BOO-')));
    });

    arrowsDropdown = await screen.findAllByText(/arrow_drop_down/i);

    await fireEvent.focus(arrowsDropdown[1]);
    await fireEvent.keyDown(arrowsDropdown[1], { key: 'ArrowDown', code: 40 });

    expect(screen.queryByText(/Photographer not found/i)).toBeVisible();
    expect(screen.queryByText(/The Scheduling took too long/i)).toBeVisible();
    expect(screen.queryByText(/Other reason/i)).toBeVisible();
  });

  test('selecting "BOOM" option as actor and other reason as canc reasons the callback is called with right dto', async () => {
    const confirmCancellationMock = jest.fn();

    const { container } = withStoreRender(<DeleteReasonPanel orderStatus="ACCEPTED" onConfirmCancellation={confirmCancellationMock} />, {
      initialState: { user: { data: { organization: 1, isPhotographer: false, roles: [{ id: 1, name: USER_ROLES.ROLE_ADMIN }] } } },
    });

    let arrowsDropdown = await screen.findAllByText(/arrow_drop_down/i);

    fireEvent.keyDown(arrowsDropdown[0], { key: 'ArrowDown', code: 40 });

    await act(async () => {
      fireEvent.click(screen.queryByText(translations.t('cancellationActors.BOO-')));
    });

    arrowsDropdown = await screen.findAllByText(/arrow_drop_down/i);

    fireEvent.keyDown(arrowsDropdown[1], { key: 'ArrowDown', code: 40 });

    await act(async () => {
      fireEvent.click(screen.queryByText(/Other reason/i));
    });

    expect(screen.queryByText(/Photographer not found/i)).toBeNull();
    expect(screen.queryByText(/The Scheduling took too long/i)).toBeNull();
    expect(screen.queryByText(/Other reason/i)).toBeVisible();

    const textArea = container.querySelector('textarea');

    fireEvent.change(textArea, { target: { value: 'I was sick' } });

    const confirmButton = screen.queryByTestId('button-confirm');
    fireEvent.click(confirmButton);

    expect(confirmCancellationMock).toHaveBeenCalledTimes(1);
    expect(confirmCancellationMock).toHaveBeenCalledWith('BOO-003', 'I was sick');
  });
});

describe('CancellationReasonPanel rendering as Client', () => {
  test.skip('selecting "The Scheduling took too long" option as canc reasons the callback is called with right dto', async () => {
    const confirmCancellationMock = jest.fn();

    render(<DeleteReasonPanel orderStatus="ACCEPTED" onConfirmCancellation={confirmCancellationMock} />);

    const arrowsDropdown = await screen.findByText(/arrow_drop_down/i);

    await fireEvent.keyDown(arrowsDropdown, { key: 'ArrowDown', code: 40 });

    await act(async () => {
      await fireEvent.click(screen.queryByText(/The Scheduling took too long/i));
    });

    expect(screen.queryByText(/Photographer not found/i)).toBeNull();
    expect(screen.queryByText(/The Scheduling took too long/i)).toBeVisible();
    expect(screen.queryByText(/Other reason/i)).toBeNull();

    const confirmButton = screen.queryByTestId('button-confirm');
    fireEvent.click(confirmButton);

    expect(confirmCancellationMock).toHaveBeenCalledTimes(1);
    expect(confirmCancellationMock).toHaveBeenCalledWith('BOO-002', '');
  });
});
