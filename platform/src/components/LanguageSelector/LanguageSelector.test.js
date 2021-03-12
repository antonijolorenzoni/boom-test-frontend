import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { useSelector, useDispatch } from 'react-redux';
import '@testing-library/jest-dom';
import { LanguageSelector } from '.';
import translations from '../../translations/i18next';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

useSelector.mockImplementation((selector) =>
  selector({
    utils: {
      selectedLanguage: 'en',
    },
  })
);

useDispatch.mockImplementation((_) => {
  return () => {};
});

describe('testing LanguageSelector', () => {
  test('dropdown is rendered correctly', async () => {
    const selectLanguage = jest.fn();

    const { queryByText } = render(<LanguageSelector onSelectLanguage={selectLanguage} />);

    const languageSelected = queryByText(/en/i);

    expect(languageSelected).toBeVisible();
    expect(queryByText(/it/i)).toBeNull();

    await fireEvent.click(languageSelected);

    expect(queryByText(translations.t(`languages.en`))).toBeVisible();
    expect(queryByText(translations.t(`languages.it`))).toBeVisible();
  });

  test('function selectLanguage is called when click on languageSelector', async () => {
    const selectLanguage = jest.fn();

    const { queryByText } = render(<LanguageSelector onSelectLanguage={selectLanguage} />);

    const languageSelected = queryByText(/en/i);

    await fireEvent.click(languageSelected);

    const italianLanguageItem = queryByText(translations.t(`languages.it`));

    await fireEvent.click(italianLanguageItem);

    expect(selectLanguage).toHaveBeenCalledTimes(1);
    expect(selectLanguage).toHaveBeenCalledWith('it');
  });
});
