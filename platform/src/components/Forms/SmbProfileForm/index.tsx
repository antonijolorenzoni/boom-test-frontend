import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { object, string } from 'yup';
import { TextField, Typography } from 'ui-boom-components';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { FormErrorKey, LANGUAGE_LOCAL_MAP } from 'config/consts';
import { EmailValidation } from 'utils/validations';
import { UserPersonalInfoSection } from './UserPersonalInfoSection';
import { join } from 'utils/array';
import { LineBreak, SpacedWrapper, FieldWrapper, ImportantSpacedWrapper } from '../styles';
import { FormSectionHeader } from 'components/FormSectionHeader';
import { CreditCardInfo } from 'components/CreditCardInfo';
import { CreditCardData } from 'types/CreditCardData';
import { BillingInfoSection, BillingInfoValidationSchema } from 'components/Forms/common/BillingInfoSection';
import { useDispatch } from 'react-redux';
import { hideModal, showModal } from 'redux/actions/modals.actions';
import { StripeAddCreditCardPanel } from 'components/AddCreditCardPanel';
import { BillingInfoDto } from 'types/SubscriptionResponse';
import { fetchGoogleAddressDetails } from 'api/instances/googlePlacesInstance';
import { AddressDto } from 'types/AddressDto';
import { FormButtons } from 'components/Forms/FormComponents/FormButtons';
import { updateUser } from 'api/userAPI';
import { updateSubscription } from 'api/paymentsAPI';
import { SmbUserData } from 'types/SmbUserData';
import { usePaymentMethodById } from 'hook/usePaymentMethodById';

interface Props {
  organizationName: string;
  userData: SmbUserData;
  creditCardData: CreditCardData;
  billingInfo: BillingInfoDto;
  subscriptionId: string;
  onClose: () => void;
  onSubmitComplete: () => void;
  isPaymentRefused: boolean;
  AddCreditCardPanelComponent?: React.FC<{ companyId: number; onConfirmAdding: (paymentMethod: string) => void }>;
}

export const ValidationSchema = object()
  .shape({
    firstName: string().required(FormErrorKey.REQUIRED),
    lastName: string().required(FormErrorKey.REQUIRED),
    language: string().nullable().required(FormErrorKey.REQUIRED),
    phoneNumber: string()
      .required(FormErrorKey.REQUIRED)
      .test('invalid-format', FormErrorKey.INVALID_PHONE, (value) => isValidPhoneNumber(value!)),
    email: EmailValidation(false).required(FormErrorKey.REQUIRED),
  })
  .concat(BillingInfoValidationSchema(false))
  .required();

export const SmbProfileForm: React.FC<Props> = ({
  organizationName,
  userData,
  creditCardData,
  billingInfo,
  subscriptionId,
  onClose,
  onSubmitComplete,
  isPaymentRefused,
  AddCreditCardPanelComponent = StripeAddCreditCardPanel,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [paymentMethodId, setPaymentMethodId] = useState<string>();
  const { paymentMethod, error } = usePaymentMethodById(true, { ...userData, paymentMethodId });
  const [isOptimisticPaymentRefused, setPaymentRefused] = useState(isPaymentRefused);

  useEffect(() => {
    if (error) {
      dispatch(
        showModal('GET_PAYMENTS_SUBSCRIPTION_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: t('smb.getPaymentsSubscriptionError'),
          },
        })
      );
    }
  }, [dispatch, t, error]);

  const onChangeCreditCard = () => {
    dispatch(
      showModal('CHANGE_CREDIT_CARD', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          hideCancel: true,
          content: <AddCreditCardPanelComponent companyId={userData.companyId} onConfirmAdding={onChangeCreditCardConfirm} />,
        },
      })
    );
  };

  const onChangeCreditCardConfirm = (paymentMethodId: string) => {
    setPaymentMethodId(paymentMethodId);
    setPaymentRefused(false);

    dispatch(hideModal('CHANGE_CREDIT_CARD'));
    dispatch(
      showModal('CHANGE_CREDIT_CARD_SUCCESS', {
        modalType: 'SUCCESS_ALERT',
        modalProps: {
          message: t('smb.changeCreditCardSuccess'),
        },
      })
    );
  };

  const { firstName, lastName, email, phoneNumber, language } = userData;
  const { corporateName, vatNumber, country, address, city, zipCode, sdiCode, vatRate } = billingInfo;

  const [initialFullAddress, setInitialFullAddress] = useState<{ value: AddressDto; label: string }>();

  useEffect(() => {
    // to be complaint to the current fetchGoogleAddressDetails implementation we need to pass the object :|
    fetchGoogleAddressDetails({ label: address }).then((result) => {
      if (result) {
        const street = result.street ?? '';
        const streetNumber = result.street_number ?? '';
        setInitialFullAddress({ value: result, label: `${street} ${streetNumber}`.trim() });
      }
    });
  }, [address]);

  const updatedCreditCardData = paymentMethod || creditCardData;

  return (
    <Formik
      initialValues={{
        firstName,
        lastName,
        language,
        phoneNumber,
        email,
        corporateName,
        vatNumber,
        vatRate,
        country,
        address: initialFullAddress,
        city,
        zipCode,
        sdiCode,
      }}
      validationSchema={ValidationSchema}
      onSubmit={async (values, actions) => {
        const userProfileDto = {
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          language: Object.values(LANGUAGE_LOCAL_MAP).find((l) => l.key === values.language)?.backend,
          phoneNumber: values.phoneNumber,
        };

        const billingInfoDto: BillingInfoDto = {
          address: values.address!.label,
          city: values.city,
          corporateName: values.corporateName,
          country: values.country,
          sdiCode: values.sdiCode,
          vatNumber: values.vatNumber,
          zipCode: values.zipCode,
          vatRate: values.vatRate,
        };

        try {
          await updateUser(userProfileDto);
          await updateSubscription(userData.companyId, subscriptionId, { billingInfo: billingInfoDto });

          i18next.changeLanguage(values.language);

          dispatch(
            showModal('EDIT_PROFILE_SUCCESS', {
              modalType: 'SUCCESS_ALERT',
              modalProps: {
                message: t('smb.editProfileSuccess'),
              },
            })
          );

          onSubmitComplete();
          onClose();
        } catch (err) {
          dispatch(
            showModal('EDIT_PROFILE_ERROR', {
              modalType: 'ERROR_ALERT',
              modalProps: {
                message: t('smb.editProfileError'),
              },
            })
          );
        } finally {
          actions.setSubmitting(false);
        }
      }}
      enableReinitialize
    >
      {(props) => {
        return (
          <Form data-testid="smb-profile-form">
            <Typography variantName="title2">{t('general.editProfile')}</Typography>
            {join(
              [
                <ImportantSpacedWrapper>
                  <FieldWrapper>
                    <TextField label={t('forms.smbProfile.organizationName')} value={organizationName} showError={false} disabled />
                  </FieldWrapper>
                </ImportantSpacedWrapper>,
                <UserPersonalInfoSection />,
                <ImportantSpacedWrapper>
                  <FormSectionHeader iconName="credit_card" label={t('smb.creditCard')} />
                  <CreditCardInfo {...updatedCreditCardData} isPaymentRefused={isOptimisticPaymentRefused} />
                  <Typography
                    variantName="textButton"
                    textColor="#5AC0B1"
                    style={{ textDecoration: 'underline', marginLeft: 0 }}
                    onClick={() => onChangeCreditCard()}
                  >
                    {t('smb.changeCreditCard')}
                  </Typography>
                </ImportantSpacedWrapper>,
                <ImportantSpacedWrapper>
                  <BillingInfoSection />
                </ImportantSpacedWrapper>,
              ],
              <SpacedWrapper>
                <LineBreak />
              </SpacedWrapper>
            )}
            <FormButtons loading={props.isSubmitting} onCancel={onClose} />
          </Form>
        );
      }}
    </Formik>
  );
};
