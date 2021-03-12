import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import 'jest-styled-components';

import i18n from 'i18n';

import { MainLayout } from '.';

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: jest.fn(() => 'SWT15-763'),
    },
  });
});

jest.mock('axios', () => {
  const axios = jest.requireActual('axios');
  axios.create = jest.fn().mockImplementation(() => axios);

  axios.get = jest.fn().mockImplementation((url) => {
    switch (url) {
      case `/orders/SWT15-763`:
        return Promise.resolve({
          data: {
            orderCode: 'SWT15-763',
            orderType: 'REAL_ESTATE',
          },
        });
    }
  });

  return axios;
});

test('<MainLayout /> renders correctly saving a snapshot', async () => {
  const { container } = render(
    <MainLayout>
      <div>content here!</div>
    </MainLayout>
  );

  await waitFor(() => expect(screen.getByText(i18n.t('header.aboutUs') as string)).toBeInTheDocument());

  expect(container).toMatchSnapshot();
});
