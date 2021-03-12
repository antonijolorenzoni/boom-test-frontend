import React from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ShootingPostProcessingView from '.';
import { withStoreRender } from 'utils/test-utils';
import translations from 'translations/i18next';

jest.mock('config/featureFlags', () => ({ featureFlag: { isFeatureEnabled: () => true } }));

jest.mock('hook/useModal', () => ({
  useModal: () => ({ isModalOpen: jest.fn(), onClose: jest.fn(), openModal: jest.fn() }),
}));

const order = {
  id: 1442,
  code: 'RGN35-1442',
  title: 'Prova Pipeline N',
  company: { id: 35, name: 'Organizzazione Prova Italia', organization: 17 },
  photographerId: 2,
  startDate: 1605974400000,
  endDate: 1605978000000,
  timezone: 'Europe/Rome',
  place: {
    placeId: 'ChIJmcQkaN_DhkcR5FXNvvh-vyY',
    formattedAddress: 'Via Giorgio Washington, Milano MI, Italy',
    city: 'Milano',
    street: 'Via Giorgio Washington',
    timezone: 'Europe/Rome',
    location: { latitude: 45.4599657, longitude: 9.1549035 },
    countryCode: 'IT',
  },
  pricingPackageId: 23,
  state: 'POST_PROCESSING',
  createdAt: 1605092190000,
  updatedAt: 1605092826000,
  downloadLink:
    'https://staging-api.boom.co/api/v1/public/shootings/images/dd338bccc19d8968fe2bb78671acba9d8eb86ba7a678b175c260839d70caece3',
  distance: null,
  travelExpenses: 10.0,
  deliveryMethods: [],
  deliveryStatus: null,
  releaseFormDownloadLink: 'www..',
  pricingPackage: {
    id: 23,
    name: 'S PACK',
    photosQuantity: 15,
    shootingDuration: 60,
    companyPrice: 79.0,
    photographerEarning: 40.0,
    photoType: { id: 3, type: 'REAL_ESTATE' },
    authorizedCompanies: [
      {
        id: 35,
        name: 'Organizzazione Prova Italia',
        organization: 17,
        parentCompany: 34,
        createdAt: 1549440065000,
        updatedAt: 1551460750000,
        tier: 'enterprise',
      },
    ],
    organizationId: 17,
    currency: { id: 1, alphabeticCode: 'EUR', numericCode: 978, displayName: 'Euro', symbol: '€' },
    deleted: false,
    editingOption: 'EXTERNAL',
    canChangeEditingOption: true,
  },
  description: null,
  contact: null,
  logisticInformation: null,
  refund: 10.0,
  uploadComments: 'This is an upload comment',
  stateChangedAt: 1605092826000,
  processing: false,
  completedAt: null,
  mainContact: { fullName: 'asd', email: 'enricocortese1@gmai.com', phoneNumber: '+33123123132', businessName: null },
  canBeRescheduled: true,
  assignee: null,
  editingOption: 'EXTERNAL',
  canChangeEditingOption: true,
  editorName: 'ESOFT',
  editingStatus: 'PROCESSING',
  editorStatusError: false,
};

test("Ph's content is visible", async () => {
  withStoreRender(
    <ShootingPostProcessingView
      onMarkShootingCompleted={() => {}}
      onDownloadShootingPhotosToReview={() => {}}
      isPhotographer={true}
      isBoom={false}
      shooting={order}
      onClose={() => {}}
    />,
    {
      initialState: {},
    }
  );

  expect(screen.queryByText(translations.t('shootings.reward').toUpperCase())).toBeVisible();
  expect(screen.queryByText(translations.t('forms.refund').toUpperCase())).toBeVisible();
  expect(screen.queryByText(translations.t('forms.photosQuantity').toUpperCase())).toBeVisible();
  expect(screen.queryByText(translations.t('shootings.postProcessingPendingPhotographer'))).toBeVisible();
  expect(screen.queryByText(/€ 40/i)).toBeVisible();
  expect(screen.queryByText(/€ 10/i)).toBeVisible();
  expect(screen.queryByText(/15/i)).toBeVisible();
});

test("Admin's content is visible", async () => {
  withStoreRender(
    <ShootingPostProcessingView
      onMarkShootingCompleted={() => {}}
      onDownloadShootingPhotosToReview={() => {}}
      isPhotographer={false}
      isBoom={true}
      shooting={order}
      onClose={() => {}}
    />,
    {
      initialState: {},
    }
  );

  expect(screen.queryByText(translations.t('shootings.photographerPhotos'))).toBeVisible();
  expect(screen.queryByText(translations.t('shootings.refuse'))).toBeVisible();
  expect(screen.queryByText(translations.t('shootings.reshoot'))).toBeVisible();
  expect(screen.queryByText(translations.t('shootings.uploadComments'))).toBeVisible();
  expect(screen.queryByText(`${order.code}.zip`)).toBeVisible();
  expect(screen.queryByText(`${order.code}_release_form.zip`)).toBeVisible();
  expect(screen.queryByText(/This is an upload comment/i)).toBeVisible();
});

test('As admin when order has editing option internal everything is correctly rendered', async () => {
  withStoreRender(
    <ShootingPostProcessingView
      onMarkShootingCompleted={() => {}}
      onDownloadShootingPhotosToReview={() => {}}
      isPhotographer={false}
      isBoom={true}
      shooting={{ ...order, editingOption: 'INTERNAL' }}
      onClose={() => {}}
    />,
    {
      initialState: {},
    }
  );

  expect(screen.queryByText(translations.t('shootings.sendingPhotosToEditor', { editorName: 'Esoft' }))).toBeNull();

  expect(screen.queryByText(/warning/i)).toBeNull();
  expect(screen.queryByText(translations.t('shootings.errorSendingPhotosToEditor', { editorName: 'Esoft' }))).toBeNull();

  expect(screen.queryByText(translations.t('shootings.externalEditorIsProcessing', { editorName: 'Esoft' }))).toBeNull();

  expect(screen.queryByText(translations.t('shootings.errorProcessingPhotosEditor', { editorName: 'Esoft' }))).toBeNull();

  expect(screen.queryByText(translations.t('shootings.externalEditorEnded', { editorName: 'Esoft' }))).toBeNull();
  expect(screen.queryByText(translations.t('shootings.externalEditorEndedCaption'))).toBeNull();

  expect(screen.getByRole('button', { name: translations.t('shootings.refuse') })).not.toBeDisabled();
  expect(screen.getByRole('button', { name: translations.t('shootings.reshoot') })).not.toBeDisabled();
});

test('As admin when order has editing option external and no editing status everything is correctly rendered', async () => {
  withStoreRender(
    <ShootingPostProcessingView
      onMarkShootingCompleted={() => {}}
      onDownloadShootingPhotosToReview={() => {}}
      isPhotographer={false}
      isBoom={true}
      shooting={{ ...order, editingOption: 'EXTERNAL', editingStatus: null }}
      onClose={() => {}}
    />,
    {
      initialState: {},
    }
  );

  expect(screen.queryByText(translations.t('shootings.sendingPhotosToEditor', { editorName: 'Esoft' }))).toBeNull();

  expect(screen.queryByText(/warning/i)).toBeNull();
  expect(screen.queryByText(translations.t('shootings.errorSendingPhotosToEditor', { editorName: 'Esoft' }))).toBeNull();

  expect(screen.queryByText(translations.t('shootings.externalEditorIsProcessing', { editorName: 'Esoft' }))).toBeNull();

  expect(screen.queryByText(translations.t('shootings.errorProcessingPhotosEditor', { editorName: 'Esoft' }))).toBeNull();

  expect(screen.queryByText(translations.t('shootings.externalEditorEnded', { editorName: 'Esoft' }))).toBeNull();
  expect(screen.queryByText(translations.t('shootings.externalEditorEndedCaption'))).toBeNull();

  expect(screen.getByRole('button', { name: translations.t('shootings.refuse') })).toBeDisabled();
  expect(screen.getByRole('button', { name: translations.t('shootings.reshoot') })).toBeDisabled();
});

test('As admin when order has editing option external and editing status CREATING everything is correctly rendered', async () => {
  withStoreRender(
    <ShootingPostProcessingView
      onMarkShootingCompleted={() => {}}
      onDownloadShootingPhotosToReview={() => {}}
      isPhotographer={false}
      isBoom={true}
      shooting={{ ...order, editingOption: 'EXTERNAL', editingStatus: 'CREATING' }}
      onClose={() => {}}
    />,
    {
      initialState: {},
    }
  );

  expect(screen.queryByText(translations.t('shootings.sendingPhotosToEditor', { editorName: 'Esoft' }))).toBeVisible();

  expect(screen.queryByText(/warning/i)).toBeNull();
  expect(screen.queryByText(translations.t('shootings.errorSendingPhotosToEditor', { editorName: 'Esoft' }))).toBeNull();
  expect(screen.queryByText(translations.t('shootings.errorSendingPhotosSubTitle'))).toBeNull();

  expect(screen.queryByText(translations.t('shootings.externalEditorIsProcessing', { editorName: 'Esoft' }))).toBeNull();

  expect(screen.queryByText(translations.t('shootings.errorProcessingPhotosEditor', { editorName: 'Esoft' }))).toBeNull();

  expect(screen.queryByText(translations.t('shootings.externalEditorEnded', { editorName: 'Esoft' }))).toBeNull();
  expect(screen.queryByText(translations.t('shootings.externalEditorEndedCaption'))).toBeNull();
  expect(screen.queryByText(/check/i)).toBeNull();

  expect(screen.getByRole('button', { name: translations.t('shootings.refuse') })).toBeDisabled();
  expect(screen.getByRole('button', { name: translations.t('shootings.reshoot') })).toBeDisabled();
});

test('As admin when order has editing option external and editing status FAILED_TO_CREATE everything is correctly rendered', async () => {
  withStoreRender(
    <ShootingPostProcessingView
      onMarkShootingCompleted={() => {}}
      onDownloadShootingPhotosToReview={() => {}}
      isPhotographer={false}
      isBoom={true}
      shooting={{ ...order, editingOption: 'EXTERNAL', editingStatus: 'FAILED_TO_CREATE' }}
      onClose={() => {}}
    />,
    {
      initialState: {},
    }
  );

  expect(screen.queryByText(translations.t('shootings.sendingPhotosToEditor', { editorName: 'Esoft' }))).toBeNull();

  expect(screen.queryByText(/warning/i)).toBeVisible();
  expect(screen.queryByText(translations.t('shootings.errorSendingPhotosToEditor', { editorName: 'Esoft' }))).toBeVisible();
  expect(screen.queryByText(translations.t('shootings.errorSendingPhotosSubTitle'))).toBeVisible();

  expect(screen.queryByText(translations.t('shootings.externalEditorIsProcessing', { editorName: 'Esoft' }))).toBeNull();

  expect(screen.queryByText(translations.t('shootings.errorProcessingPhotosEditor', { editorName: 'Esoft' }))).toBeNull();

  expect(screen.queryByText(translations.t('shootings.externalEditorEnded', { editorName: 'Esoft' }))).toBeNull();
  expect(screen.queryByText(translations.t('shootings.externalEditorEndedCaption'))).toBeNull();
  expect(screen.queryByText(/check/i)).toBeNull();

  expect(screen.getByRole('button', { name: translations.t('shootings.refuse') })).not.toBeDisabled();
  expect(screen.getByRole('button', { name: translations.t('shootings.reshoot') })).not.toBeDisabled();
});

test('As admin when order has editing option external and editing status PROCESSING everything is correctly rendered', async () => {
  withStoreRender(
    <ShootingPostProcessingView
      onMarkShootingCompleted={() => {}}
      onDownloadShootingPhotosToReview={() => {}}
      isPhotographer={false}
      isBoom={true}
      shooting={{ ...order, editingOption: 'EXTERNAL', editingStatus: 'PROCESSING' }}
      onClose={() => {}}
    />,
    {
      initialState: {},
    }
  );

  expect(screen.queryByText(translations.t('shootings.sendingPhotosToEditor', { editorName: 'Esoft' }))).toBeNull();

  expect(screen.queryByText(/warning/i)).toBeNull();
  expect(screen.queryByText(translations.t('shootings.errorSendingPhotosToEditor', { editorName: 'Esoft' }))).toBeNull();
  expect(screen.queryByText(translations.t('shootings.errorSendingPhotosSubTitle'))).toBeNull();

  expect(screen.queryByText(translations.t('shootings.externalEditorIsProcessing', { editorName: 'Esoft' }))).toBeVisible();

  expect(screen.queryByText(translations.t('shootings.errorProcessingPhotosEditor', { editorName: 'Esoft' }))).toBeNull();

  expect(screen.queryByText(translations.t('shootings.externalEditorEnded', { editorName: 'Esoft' }))).toBeNull();
  expect(screen.queryByText(translations.t('shootings.externalEditorEndedCaption'))).toBeNull();
  expect(screen.queryByText(/check/i)).toBeNull();

  expect(screen.getByRole('button', { name: translations.t('shootings.refuse') })).not.toBeDisabled();
  expect(screen.getByRole('button', { name: translations.t('shootings.reshoot') })).not.toBeDisabled();
});

test('As admin when order has editing option external and editing status PROCESSING_FAILED everything is correctly rendered', async () => {
  withStoreRender(
    <ShootingPostProcessingView
      onMarkShootingCompleted={() => {}}
      onDownloadShootingPhotosToReview={() => {}}
      isPhotographer={false}
      isBoom={true}
      shooting={{ ...order, editingOption: 'EXTERNAL', editingStatus: 'PROCESSING_FAILED' }}
      onClose={() => {}}
    />,
    {
      initialState: {},
    }
  );

  expect(screen.queryByText(translations.t('shootings.sendingPhotosToEditor', { editorName: 'Esoft' }))).toBeNull();

  expect(screen.queryByText(/warning/i)).toBeVisible();
  expect(screen.queryByText(translations.t('shootings.errorSendingPhotosToEditor', { editorName: 'Esoft' }))).toBeNull();
  expect(screen.queryByText(translations.t('shootings.errorSendingPhotosSubTitle'))).toBeNull();

  expect(screen.queryByText(translations.t('shootings.externalEditorIsProcessing', { editorName: 'Esoft' }))).toBeVisible();
  expect(screen.queryByText(translations.t('shootings.errorProcessingPhotosEditor', { editorName: 'Esoft' }))).toBeVisible();

  expect(screen.queryByText(translations.t('shootings.externalEditorEnded', { editorName: 'Esoft' }))).toBeNull();
  expect(screen.queryByText(translations.t('shootings.externalEditorEndedCaption'))).toBeNull();
  expect(screen.queryByText(/check/i)).toBeNull();

  expect(screen.getByRole('button', { name: translations.t('shootings.refuse') })).not.toBeDisabled();
  expect(screen.getByRole('button', { name: translations.t('shootings.reshoot') })).not.toBeDisabled();
});

test('As admin when order has editing option external and editing status DONE everything is correctly rendered', async () => {
  withStoreRender(
    <ShootingPostProcessingView
      onMarkShootingCompleted={() => {}}
      onDownloadShootingPhotosToReview={() => {}}
      isPhotographer={false}
      isBoom={true}
      shooting={{ ...order, editingOption: 'EXTERNAL', editingStatus: 'DONE' }}
      onClose={() => {}}
    />,
    {
      initialState: {},
    }
  );

  expect(screen.queryByText(translations.t('shootings.sendingPhotosToEditor', { editorName: 'Esoft' }))).toBeNull();

  expect(screen.queryByText(/warning/i)).toBeNull();
  expect(screen.queryByText(translations.t('shootings.errorSendingPhotosToEditor', { editorName: 'Esoft' }))).toBeNull();
  expect(screen.queryByText(translations.t('shootings.errorSendingPhotosSubTitle'))).toBeNull();

  expect(screen.queryByText(translations.t('shootings.externalEditorIsProcessing', { editorName: 'Esoft' }))).toBeNull();

  expect(screen.queryByText(translations.t('shootings.errorProcessingPhotosEditor', { editorName: 'Esoft' }))).toBeNull();

  expect(screen.queryByText(translations.t('shootings.externalEditorEnded', { editorName: 'Esoft' }))).toBeVisible();
  expect(screen.queryByText(translations.t('shootings.externalEditorEndedCaption'))).toBeVisible();
  expect(screen.queryByText(/check/i)).toBeVisible();

  expect(screen.getByRole('button', { name: translations.t('shootings.refuse') })).not.toBeDisabled();
  expect(screen.getByRole('button', { name: translations.t('shootings.reshoot') })).not.toBeDisabled();
});
