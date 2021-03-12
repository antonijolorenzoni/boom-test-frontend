import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import i18n from 'i18n';

import { Header } from '.';

beforeAll(() => {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: jest.fn(),
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
      case `/orders/SWT15-764`:
        return Promise.resolve({
          data: {
            orderCode: 'SWT15-764',
            orderType: 'FOOD',
          },
        });
      default:
        return Promise.reject('error');
    }
  });

  return axios;
});

test('all labels and icons appear correctly', async () => {
  window.localStorage.getItem = jest.fn().mockImplementation(() => 'SWT15-763');

  render(<Header />);

  await waitFor(() => screen.getByText(i18n.t('header.aboutUs') as string));

  expect(screen.getByText(i18n.t('header.aboutUs') as string)).toBeInTheDocument();
  expect(screen.getByText(i18n.t('header.faq').toUpperCase())).toBeInTheDocument();
  expect(screen.getByText(i18n.t('header.logOut') as string)).toBeInTheDocument();

  expect(screen.getByText(/camera_alt/i)).toBeInTheDocument();
  expect(screen.getByText(/chat_bubble_outline/i)).toBeInTheDocument();
  expect(screen.getByText(/power_settings_new/i)).toBeInTheDocument();

  expect(screen.getByTestId('faq-link').getAttribute('href')).toBe(i18n.t(`faq.REAL_ESTATE`));
});

test('all labels and icons appear correctly', async () => {
  window.localStorage.getItem = jest.fn().mockImplementation(() => 'SWT15-764');

  render(<Header />);

  await waitFor(() => screen.getByText(i18n.t('header.aboutUs') as string));

  expect(screen.getByText(i18n.t('header.faq').toUpperCase())).toBeInTheDocument();
  expect(screen.getByText(i18n.t('header.logOut') as string)).toBeInTheDocument();
  expect(screen.getByTestId('faq-link').getAttribute('href')).toBe(i18n.t(`faq.FOOD`));
});
