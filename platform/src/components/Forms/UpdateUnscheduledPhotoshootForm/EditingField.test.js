import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EditingField } from './EditingField';

import translations from 'translations/i18next';
import { SHOOTINGS_STATUSES } from 'config/consts';
import { Formik } from 'formik';
import constsWithTranslations from 'config/constsWithTranslations';

describe('Editing panel test', () => {
  test('correctly render Editingfield when order is edited internally and is in status matched', async () => {
    render(
      <Formik
        initialValues={{
          editingOption: 'INTERNAL',
        }}
        onSubmit={() => {}}
      >
        <EditingField disabled={true} orderStatus={SHOOTINGS_STATUSES.MATCHED} />
      </Formik>
    );

    expect(screen.queryByText(translations.t('forms.editingCantChange'))).toBeVisible();
    expect(screen.queryByText(translations.t('forms.editingChangeOnce'))).toBeNull();
    expect(screen.queryByText(constsWithTranslations.optionsRadioGroupEditing[0].labelText)).toBeVisible();
    expect(screen.queryByText(constsWithTranslations.optionsRadioGroupEditing[1].labelText)).toBeVisible();
    expect(screen.getByRole('radio', { name: 'External' })).toBeDisabled();
    expect(screen.getByRole('radio', { name: 'Internal' })).toBeDisabled();

    expect(screen.getByRole('radio', { name: 'Internal' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'External' })).toHaveAttribute('aria-checked', 'false');
  });

  test('correctly render Editingfield when order is edited externally and is in status matched, clicking internal option and render correctly', async () => {
    render(
      <Formik
        initialValues={{
          editingOption: 'EXTERNAL',
        }}
        onSubmit={() => {}}
      >
        <EditingField disabled={false} orderStatus={SHOOTINGS_STATUSES.MATCHED} />
      </Formik>
    );

    expect(screen.queryByText(translations.t('forms.editingCantChange'))).toBeNull();
    expect(screen.queryByText(translations.t('forms.editingChangeOnce'))).toBeVisible();
    expect(screen.queryByText(constsWithTranslations.optionsRadioGroupEditing[0].labelText)).toBeVisible();
    expect(screen.queryByText(constsWithTranslations.optionsRadioGroupEditing[1].labelText)).toBeVisible();
    expect(screen.getByRole('radio', { name: 'External' })).toBeValid();
    expect(screen.getByRole('radio', { name: 'Internal' })).toBeValid();

    expect(screen.getByRole('radio', { name: 'Internal' })).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByRole('radio', { name: 'External' })).toHaveAttribute('aria-checked', 'true');

    await waitFor(() => fireEvent.click(screen.getByRole('radio', { name: 'Internal' })));

    expect(screen.getByRole('radio', { name: 'Internal' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'External' })).toHaveAttribute('aria-checked', 'false');
  });

  test('correctly render Editingfield when order is in status done', async () => {
    render(
      <Formik
        initialValues={{
          editingOption: 'EXTERNAL',
        }}
        onSubmit={() => {}}
      >
        <EditingField disabled={true} orderStatus={SHOOTINGS_STATUSES.DONE} />
      </Formik>
    );

    expect(screen.queryByText(translations.t('forms.editingCantChange'))).toBeNull();
    expect(screen.queryByText(translations.t('forms.editingChangeOnce'))).toBeNull();
    expect(screen.queryByText(constsWithTranslations.optionsRadioGroupEditing[0].labelText)).toBeVisible();
    expect(screen.queryByText(constsWithTranslations.optionsRadioGroupEditing[1].labelText)).toBeVisible();

    expect(screen.getByRole('radio', { name: 'External' })).toBeDisabled();
    expect(screen.getByRole('radio', { name: 'Internal' })).toBeDisabled();

    expect(screen.getByRole('radio', { name: 'Internal' })).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByRole('radio', { name: 'External' })).toHaveAttribute('aria-checked', 'true');
  });
});
