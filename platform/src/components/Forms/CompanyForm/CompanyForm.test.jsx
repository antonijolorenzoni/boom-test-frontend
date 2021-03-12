import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import translations from 'translations/i18next';
import { CompanyForm } from '.';
import { LANGUAGE_LOCAL_MAP } from 'config/consts';
import { withStoreRender } from 'utils/test-utils';

beforeEach(jest.clearAllMocks);

const photoTypesList = [
  { id: 1, type: 'FOOD' },
  { id: 2, type: 'PRODUCTS' },
  { id: 3, type: 'REAL_ESTATE' },
  { id: 4, type: 'EVENTS' },
];

const company = {
  createdAt: 1606314944000,
  id: 2,
  company: 2,
  name: 'company',
  tier: 'enterprise',
  updatedAt: 1606354944000,
  organization: 2,
  parentCompany: 1,
  address: null,
  email: null,
  language: 'en',
  phoneNumber: '+393333333333',
  photoTypes: [{ id: 3, type: 'REAL_ESTATE' }],
  googleAuthorized: true,
  logo: null,
};

const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();

translations.changeLanguage(LANGUAGE_LOCAL_MAP.ENGLISH.key);

test('required fields submitting empty form', async () => {
  withStoreRender(<CompanyForm company={{}} photoTypesList={photoTypesList} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />, {
    initialState: { user: { data: { organization: 1 } } },
  });

  expect(screen.queryByTestId('company-form')).toBeInTheDocument();

  await waitFor(() => fireEvent.click(screen.getByText(translations.t('forms.save'))));

  expect(screen.getByText(translations.t('forms.companyName'))?.parentElement?.parentElement?.lastElementChild?.textContent).toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('forms.phone'))?.parentElement?.lastElementChild?.textContent).toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('languages.language'))?.parentElement?.lastElementChild?.textContent).toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('forms.photoTypes'))?.parentElement?.lastElementChild?.textContent).toBe(
    translations.t('forms.error.required')
  );

  expect(mockOnSubmit).not.toBeCalled();
});

test('submit form without errors', async () => {
  withStoreRender(
    <CompanyForm
      company={company}
      photoTypesList={photoTypesList}
      deliverToMainContact={false}
      subCompany={false}
      onSubmit={mockOnSubmit}
      onCancel={mockOnCancel}
    />,
    {
      initialState: { user: { data: { organization: 1 } } },
    }
  );

  await waitFor(() => screen.findByTestId('company-form'));

  fireEvent.change(screen.getByLabelText(translations.t('forms.phone')), { target: { value: '+393393334433' } });

  expect(screen.getByText(translations.t('forms.companyName'))?.parentElement?.lastElementChild?.textContent).not.toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('forms.phone'))?.parentElement?.lastElementChild?.textContent).not.toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('languages.language'))?.parentElement?.lastElementChild?.textContent).not.toBe(
    translations.t('forms.error.required')
  );

  expect(screen.getByText(translations.t('forms.photoTypes'))?.parentElement?.lastElementChild?.textContent).not.toBe(
    translations.t('forms.error.required')
  );

  expect(screen.queryByText(translations.t('forms.save'))).toBeInTheDocument();

  await waitFor(() => fireEvent.click(screen.getByText(translations.t('forms.save'))));

  expect(mockOnSubmit).toBeCalledTimes(1);
  expect(mockOnSubmit).toBeCalledWith(
    {
      ...company,
      name: 'company',
      phoneNumber: '+393393334433',
      photoTypes: [3],
      language: 'ENGLISH',
      logo: '',
    },
    false
  );
});
