import React from 'react';
import { updateUser } from 'api/userAPI';
import { updateSubscription } from 'api/paymentsAPI';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { SmbProfileForm } from '.';
import { withStoreRender } from 'utils/test-utils';
import translations from 'translations/i18next';

beforeEach(jest.clearAllMocks);

jest.mock('api/userAPI', () => ({
  updateUser: jest.fn(),
}));

jest.mock('api/paymentsAPI', () => ({
  updateSubscription: jest.fn(),
}));

jest.mock('api/instances/googlePlacesInstance', () => ({
  fetchGoogleAddressDetails: () =>
    Promise.resolve({
      placeId: 'ChIJ4edudVzBhkcRHP7WsU-4aSM',
      street: 'Straße des 17. Juni',
      street_number: undefined,
      city: 'Berlin',
      timezone: 'Europe/Berlin',
    }),
}));

test('submit form without errors', async () => {
  // to avoid verbose stuff using Bottega's modal lol :>
  window.console.warn = jest.fn();
  window.console.error = jest.fn();

  const onClose = jest.fn();
  const onSubmitComplete = jest.fn();

  updateUser.mockImplementation(() => Promise.resolve({}));
  updateSubscription.mockImplementation(() => Promise.resolve({}));

  withStoreRender(
    <SmbProfileForm
      organizationName={'prova srl'}
      userData={{
        email: 'email@email.com',
        firstName: 'Mario',
        lastName: 'Rossi',
        language: 'it',
        phoneNumber: '+393331234567',
        companyId: 1002,
      }}
      creditCardData={{
        expMonth: 12,
        expYear: 2022,
        lastFour: '4242',
        brand: 'visa',
      }}
      billingInfo={{
        address: 'Straße des 17. Juni',
        city: 'Berlin',
        corporateName: 'My corporate name',
        sdiCode: '',
        vatNumber: '0000000000000',
        zipCode: 'XXXXXX',
        country: 'de',
      }}
      subscriptionId={'xxxx1'}
      onClose={onClose}
      onSubmitComplete={onSubmitComplete}
      isPaymentRefused={false}
      AddCreditCardPanelComponent={() => <div>fake</div>}
    />,
    { initialState: {}, container: document.body }
  );

  await waitFor(() => screen.findByTestId('smb-profile-form'));

  fireEvent.click(screen.getByText(translations.t('general.confirm')));

  await waitFor(() => {
    expect(updateUser).toBeCalledTimes(1);
    expect(updateUser).toBeCalledWith({
      email: 'email@email.com',
      firstName: 'Mario',
      lastName: 'Rossi',
      language: 'ITALIAN',
      phoneNumber: '+393331234567',
    });
  });

  await waitFor(() => {
    expect(updateSubscription).toBeCalledTimes(1);
    expect(updateSubscription).toBeCalledWith(1002, 'xxxx1', {
      billingInfo: {
        address: 'Straße des 17. Juni',
        city: 'Berlin',
        corporateName: 'My corporate name',
        country: 'de',
        sdiCode: '',
        vatNumber: '0000000000000',
        zipCode: 'XXXXXX',
      },
    });
  });

  expect(onClose).toBeCalledTimes(1);
  expect(onSubmitComplete).toBeCalledTimes(1);
});

test('required fields submitting some empty fields', async () => {
  // to avoid verbose stuff using Bottega's modal lol :>
  window.console.warn = jest.fn();
  window.console.error = jest.fn();

  withStoreRender(
    <SmbProfileForm
      organizationName={'prova srl'}
      userData={{
        email: 'email@email.com',
        firstName: 'Mario',
        lastName: 'Rossi',
        language: 'it',
        phoneNumber: '+393331234567',
      }}
      creditCardData={{
        expMonth: 12,
        expYear: 2022,
        lastFour: '4242',
        brand: 'visa',
      }}
      billingInfo={{
        address: 'Straße des 17. Juni',
        city: 'Berlin',
        corporateName: 'My corporate name',
        sdiCode: '',
        vatNumber: '0000000000000',
        zipCode: 'XXXXXX',
        country: 'de',
      }}
      subscriptionId={'xxxx1'}
      isPaymentRefused={false}
      onClose={() => {}}
      AddCreditCardPanelComponent={() => <div>fake</div>}
    />,
    { initialState: {}, container: document.body }
  );

  await waitFor(() => screen.findByTestId('smb-profile-form'));

  fireEvent.change(screen.getByLabelText(translations.t('forms.smbProfile.email')), { target: { value: '' } });

  await waitFor(() => fireEvent.click(screen.getByText(translations.t('general.confirm'))));

  expect(screen.getByText(translations.t('forms.smbProfile.email'))?.parentElement?.parentElement?.lastElementChild?.textContent).toBe(
    translations.t('forms.error.required')
  );
  expect(updateUser).not.toBeCalled();
  expect(updateSubscription).not.toBeCalled();
});
