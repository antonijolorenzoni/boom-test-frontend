import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import translations from 'translations/i18next';
import { LoginForm } from '.';

test('login using username and password', async () => {
  const fakeSubmit = jest.fn();
  const fakeBoSubmit = jest.fn();

  const { container, getByText, getByLabelText, getByTestId } = render(
    <LoginForm boLogin={false} onLoginSubmit={fakeSubmit} onBoLoginSubmit={fakeBoSubmit} />
  );

  const emailInput = getByLabelText(translations.t('login.email'));
  await waitFor(() => fireEvent.change(emailInput, { target: { value: 'steboom.co' } }));
  expect(getByTestId('username-error').textContent).toBe(translations.t('forms.invalidEmail'));

  const passwordInput = getByLabelText(translations.t('login.password'));
  await waitFor(() => fireEvent.change(passwordInput, { target: { value: '' } }));
  expect(getByTestId('password-error').textContent).toBe(translations.t('forms.required'));

  fireEvent.click(getByText(translations.t('login.login'), { exact: false }));
  expect(fakeSubmit).not.toBeCalled();

  await waitFor(() => fireEvent.change(emailInput, { target: { value: 'stefano@boom.co' } }));
  expect(getByTestId('username-error')).not.toBeVisible();

  await waitFor(() => fireEvent.change(passwordInput, { target: { value: 'supersecretpassword' } }));
  expect(getByTestId('password-error')).not.toBeVisible();

  const submitButton = container.querySelector('button[type="submit"]');
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(fakeSubmit).toBeCalledTimes(1);
    expect(fakeSubmit).toBeCalledWith('stefano@boom.co', 'supersecretpassword');
    expect(fakeBoSubmit).toBeCalledTimes(0);
  });
});

test('login using username and order code', async () => {
  const fakeSubmit = jest.fn();
  const fakeBoSubmit = jest.fn();

  const { container, getByText, getByLabelText, getByTestId } = render(
    <LoginForm boLogin onLoginSubmit={fakeSubmit} onBoLoginSubmit={fakeBoSubmit} />
  );

  const emailInput = getByLabelText(translations.t('login.email'));
  await waitFor(() => fireEvent.change(emailInput, { target: { value: 'steboom.co' } }));
  expect(getByTestId('username-error').textContent).toBe(translations.t('forms.invalidEmail'));

  const orderCodeInput = getByLabelText(`${translations.t('login.orderCode')} *`);
  await waitFor(() => fireEvent.change(orderCodeInput, { target: { value: '' } }));
  expect(getByTestId('order-code-error').textContent).toBe(translations.t('forms.required'));

  fireEvent.click(getByText(translations.t('login.login'), { exact: false }));
  expect(fakeSubmit).not.toBeCalled();

  await waitFor(() => fireEvent.change(emailInput, { target: { value: 'stefano@boom.co' } }));
  expect(getByTestId('username-error')).not.toBeVisible();

  await waitFor(() => fireEvent.change(orderCodeInput, { target: { value: 'SWT-12345' } }));
  expect(getByTestId('order-code-error')).not.toBeVisible();

  const submitButton = container.querySelector('button[type="submit"]');
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(fakeBoSubmit).toBeCalledTimes(1);
    expect(fakeBoSubmit).toBeCalledWith('stefano@boom.co', 'SWT-12345');
    expect(fakeSubmit).toBeCalledTimes(0);
  });
});
