import React from 'react';
import { render, fireEvent, act, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PhotographerRefusePanel } from '.';

jest.mock('axios', () => {
  const axios = jest.requireActual('axios');

  axios.create = jest.fn().mockImplementation(() => axios);

  axios.get = jest.fn().mockImplementation((url) => {
    switch (url) {
      case '/api/v1/reasons/discard?orderStatus=ASSIGNED&role=Photographer':
        return Promise.resolve({
          data: [
            { code: 'PHO-001', requiresText: false },
            { code: 'PHO-002', requiresText: false },
            { code: 'PHO-003', requiresText: false },
          ],
        });
      default:
        return Promise.reject(new Error('not found'));
    }
  });

  return axios;
});

describe('PhotographerRefusePanel rendering as Admin', () => {
  test('initially the confirm button is not clickable', async () => {
    const confirmCancellationMock = jest.fn();

    render(<PhotographerRefusePanel onConfirmCancellation={confirmCancellationMock} orderStatus={'ASSIGNED'} />);

    const confirmButton = await screen.findByTestId('button-confirm');
    expect(confirmButton).toBeDisabled();
  });

  test('clicking on the dropdown the options appear', async () => {
    const confirmCancellationMock = jest.fn();

    render(<PhotographerRefusePanel onConfirmCancellation={confirmCancellationMock} orderStatus={'ASSIGNED'} />);

    const arrowsDropdown = await screen.findByText(/arrow_drop_down/i);

    fireEvent.keyDown(arrowsDropdown, { key: 'ArrowDown', code: 40 });

    expect(screen.queryByText(/Did not show/i)).toBeVisible();
    expect(screen.queryByText('Human calamity/ Global pandemic/ Strike/ Riot')).toBeVisible();
    expect(screen.queryByText(/Rejected photoshoot less than 6 hours before/i)).toBeVisible();
  });

  test('selecting "Rejected photoshoot less than 6 hours before" option as canc reasons the callback is called with right dto', async () => {
    const confirmCancellationMock = jest.fn();

    render(<PhotographerRefusePanel onConfirmCancellation={confirmCancellationMock} orderStatus={'ASSIGNED'} />);

    const arrowsDropdown = await screen.findByText(/arrow_drop_down/i);

    fireEvent.keyDown(arrowsDropdown, { key: 'ArrowDown', code: 40 });

    await act(async () => {
      fireEvent.click(screen.queryByText(/Rejected photoshoot less than 6 hours before/i));
    });

    expect(screen.queryByText(/Did not show/i)).toBeNull();
    expect(screen.queryByText('Human calamity/ Global pandemic/ Strike/ Riot')).toBeNull();
    expect(screen.queryByText(/Rejected photoshoot less than 6 hours before/i)).toBeVisible();

    const confirmButton = screen.queryByTestId('button-confirm');
    fireEvent.click(confirmButton);

    expect(confirmCancellationMock).toHaveBeenCalledTimes(1);
    expect(confirmCancellationMock).toHaveBeenCalledWith('PHO-003', '');
  });
});
