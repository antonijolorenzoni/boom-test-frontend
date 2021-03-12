import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { OperationNotes } from '.';

import translations from '../../translations/i18next';
import * as OrdersAPI from '../../api/ordersAPI';
import { act } from 'react-dom/test-utils';

jest.mock('axios', () => {
  const axios = jest.requireActual('axios');

  axios.create = jest.fn().mockImplementation(() => axios);

  axios.get = jest.fn().mockImplementation((url) => {
    switch (url) {
      case '/api/v1/orders/815/operation-notes':
        return Promise.resolve({
          data: [
            { userName: 'Alessia Rossi', text: 'First operation notes', creationDate: '2020-08-11T14:52:01.000+0000' },
            { userName: 'Alessia Neri', text: 'Second operation notes', creationDate: '2020-08-11T14:51:01.000+0000' },
            { userName: 'Alessia Verdi', text: 'Third operation notes', creationDate: '2020-08-11T14:50:01.000+0000' },
          ],
        });
      case '/api/v1/orders/230/operation-notes':
        return Promise.resolve({
          data: [],
        });
      default:
        return Promise.reject();
    }
  });

  return axios;
});

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('moment-timezone', () => {
  const moment = jest.requireActual('moment-timezone');
  moment.tz.setDefault('Europe/Rome');
  return moment;
});

describe('Operation notes panel tests', () => {
  test('on opening operation notes panel only first operation note is visible, clicking on icon show more', async () => {
    const { container, queryByText } = render(<OperationNotes color="red" shootingId={815} onSubmitNote={() => {}} />);

    await waitFor(() => container);

    expect(container).toBeVisible();

    expect(queryByText(/First operation notes/i)).toBeVisible();
    expect(queryByText(/11.08.20 - 16:52 - Alessia Rossi/i)).toBeVisible();

    expect(queryByText(/Second operation notes/i)).toBeNull();
    expect(queryByText(/11.08.20 - 16:51 - Alessia Neri/i)).toBeNull();

    expect(queryByText(/Third operation notes/i)).toBeNull();
    expect(queryByText(/11.08.20 - 16:50 - Alessia Verdi/i)).toBeNull();

    await act(async () => {
      await fireEvent.click(queryByText('arrow_drop_down'));
    });

    expect(queryByText(/First operation notes/i)).toBeVisible();
    expect(queryByText(/11.08.20 - 16:52 - Alessia Rossi/i)).toBeVisible();

    expect(queryByText(/Second operation notes/i)).toBeVisible();
    expect(queryByText(/11.08.20 - 16:51 - Alessia Neri/i)).toBeVisible();

    expect(queryByText(/Third operation notes/i)).toBeVisible();
    expect(queryByText(/11.08.20 - 16:50 - Alessia Verdi/i)).toBeVisible();

    await act(async () => {
      await fireEvent.click(queryByText('arrow_drop_up'));
    });

    expect(queryByText(/First operation notes/i)).toBeVisible();
    expect(queryByText(/11.08.20 - 16:52 - Alessia Rossi/i)).toBeVisible();

    expect(queryByText(/Second operation notes/i)).toBeNull();
    expect(queryByText(/11.08.20 - 16:51 - Alessia Neri/i)).toBeNull();

    expect(queryByText(/Third operation notes/i)).toBeNull();
    expect(queryByText(/11.08.20 - 16:50 - Alessia Verdi/i)).toBeNull();
  });

  test('on typing in operation notes free text icon change color ', async () => {
    const postMethodSpy = jest.spyOn(OrdersAPI, 'submitOperationNote').mockImplementation(() => {});

    const { container, getAllByLabelText, queryByText } = render(<OperationNotes color="red" shootingId={815} onSubmitNote={() => {}} />);

    await waitFor(() => container);

    expect(queryByText('send')).toHaveStyle({ color: '#A3ABB1' });

    const freeText = getAllByLabelText(translations.t('shootings.operationNotes'))[0];
    freeText.focus();
    await act(async () => {
      await waitFor(() => fireEvent.change(freeText, { target: { value: 'new comment' } }));
    });
    expect(freeText).toHaveValue('new comment');
    freeText.blur();

    expect(queryByText('send')).toHaveStyle({ color: 'red' });

    await act(async () => {
      await fireEvent.click(queryByText('send'));
    });

    expect(postMethodSpy).toHaveBeenCalled();
    expect(postMethodSpy).toHaveBeenCalledWith(815, 'new comment');
    expect(freeText).toHaveValue('');
  });

  test('on opening operation notes if there are no notes I can see message of no operation notes', async () => {
    const { container, queryByText } = render(<OperationNotes color="red" shootingId={230} onSubmitNote={() => {}} />);

    await waitFor(() => container);

    expect(queryByText(translations.t('shootings.noOperationNotes'))).toBeVisible();
  });
});
