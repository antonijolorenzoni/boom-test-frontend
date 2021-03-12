import React from 'react';
import { withStoreRender } from 'utils/test-utils';
import { fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import translations from 'translations/i18next';
import { LoginView } from '.';

jest.mock('config/featureFlags', () => ({
  featureFlag: { isFeatureEnabled: () => true },
}));

describe('LoginView', () => {
  test('login selection color change correctly as order code info / password recovery label', () => {
    const history = createMemoryHistory();
    const { queryByText, getByTestId, getByText } = withStoreRender(
      <Router history={history}>
        <LoginView />
      </Router>
    );

    expect(getByTestId('have-account')).toHaveStyle('color: rgb(255,255,255)');
    expect(getByTestId('have-order-code')).toHaveStyle('color: rgb(163, 171, 177)');
    getByText(translations.t('login.passwordRecovery'));
    expect(queryByText(translations.t('login.boOrdeCodeInfo'))).toBeNull();

    fireEvent.click(getByTestId('have-order-code'));

    expect(getByTestId('have-account')).toHaveStyle('color: rgb(163, 171, 177)');
    expect(getByTestId('have-order-code')).toHaveStyle('color: rgb(255,255,255)');
    getByText(translations.t('login.boOrdeCodeInfo'));
    expect(queryByText(translations.t('login.passwordRecovery'))).toBeNull();
  });
});
