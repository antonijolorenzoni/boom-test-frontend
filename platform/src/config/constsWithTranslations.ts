import { getCompleteName } from './utils';
import translations from '../translations/i18next';
import { UNASSIGNED, KNOWN_VALUE, UNKNOWN_VALUE, INTERNAL_EDITING_VALUE, EXTERNAL_EDITING_VALUE } from './consts';

const constsWithTranslations: { [key: string]: any } = {};

// We used this method to solve translation bug (constants that used translations object outside a React component)
// Check the links to know more
// https://github.com/i18next/react-i18next/issues/909
// https://github.com/i18next/react-i18next/issues/835

const fillTranslations = () => {
  constsWithTranslations.meSuffix = `(${translations.t('shootings.me')})`;

  constsWithTranslations.getAssigneeDefaultOptions = (userData: any) => [
    { value: UNASSIGNED, label: translations.t('shootings.unassigned') },
    { value: userData.id, label: `${getCompleteName(userData)} ${constsWithTranslations.meSuffix}` },
  ];

  constsWithTranslations.optionsRadioGroupDate = [
    { value: KNOWN_VALUE, labelText: translations.t('forms.dateAndTimeKnown') },
    { value: UNKNOWN_VALUE, labelText: translations.t('forms.dateAndTimeUnknown') },
  ];

  constsWithTranslations.DELIVERY_STATUS_UI = {
    WAITING: { label: translations.t('shootings.deliveryStatusWaiting'), color: '#80888D' },
    DELIVERED: { label: translations.t('shootings.deliveryStatusSuccess'), color: '#5AC0B1' },
    FAILED: { label: translations.t('shootings.deliveryStatusFailed'), color: '#D84315' },
  };

  constsWithTranslations.optionsRadioGroupEditing = [
    { value: EXTERNAL_EDITING_VALUE, labelText: translations.t('forms.externalEditing') },
    { value: INTERNAL_EDITING_VALUE, labelText: translations.t('forms.internalEditing') },
  ];

  constsWithTranslations.STRIPE_ERROR_MESSAGES = {
    incomplete_number: translations.t('smb.incompleteNumber'),
    invalid_number: translations.t('smb.invalid_number'),
    incomplete_expiry: translations.t('smb.incomplete_expiry'),
    incomplete_cvc: translations.t('smb.incomplete_cvc'),
    invalid_expiry_year: translations.t('smb.invalid_expiry_year'),
    incomplete_zip: translations.t('smb.incomplete_zip'),
    setup_intent_authentication_failure: translations.t('smb.setup_intent_authentication_failure'),
    unknown_error: translations.t('smb.unknown_error'),
  };
};

fillTranslations();

translations.on('languageChanged init', fillTranslations);

export default constsWithTranslations;
