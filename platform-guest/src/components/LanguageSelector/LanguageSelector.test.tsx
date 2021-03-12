import React from 'react';
import { screen, render, fireEvent, waitFor } from '@testing-library/react';

import i18n from 'i18n';
import { LanguageSelector } from '.';
import { languagesIcon } from 'utils/lang';

jest.mock('axios', () => {
  const axios = jest.requireActual('axios');
  axios.create = jest.fn().mockImplementation(() => axios);
  axios.put = jest.fn();
  return axios;
});

test('correct languages is showed to user', () => {
  const onClose = jest.fn();
  render(<LanguageSelector onClose={onClose} />);

  Object.keys(languagesIcon).forEach((lang) => {
    screen.getByAltText(`flag-${lang}`);
    screen.getByText(i18n.t(`languages.${lang}`) as string);
  });

  fireEvent.click(screen.getByText('close'));
  expect(onClose).toBeCalled();
});

test('change languages work', async () => {
  const onClose = jest.fn();
  render(<LanguageSelector onClose={onClose} />);

  screen.getByText('Choose your language');
  fireEvent.click(screen.getByText(i18n.t('languages.it') as string));
  await waitFor(() => screen.getByText('Seleziona la tua lingua'));
});
