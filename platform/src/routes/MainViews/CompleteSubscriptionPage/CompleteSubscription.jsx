import React, { useEffect, useState } from 'react';
import pick from 'lodash/pick';
import { useDispatch } from 'react-redux';
import { Field, Form, Formik } from 'formik';
import { string, object, boolean } from 'yup';
import { Typography, Dropdown, BoomLoadingOverlay, Label } from 'ui-boom-components';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { LineBreak } from 'components/common/LineBreak';
import { LANGUAGE_LOCAL_MAP, FormErrorKey } from 'config/consts';
import * as ModalsActions from 'redux/actions/modals.actions';
import { FormButtons } from 'components/Forms/FormComponents/FormButtons';
import { StripeAddCreditCardPanel } from 'components/AddCreditCardPanel';
import { EmptyCardPlaceholder } from './styles';
import { SubscriptionInfoPanel } from './SubscriptionInfoPanel';
import { cancelCard, confirmAndSubscribe } from 'api/paymentsAPI';
import { SmbCancelInfoLandingPanel } from './SmbCancelInfoLandingPanel';
import { CreditCardInfo } from 'components/CreditCardInfo';
import { FormSectionHeader } from 'components/FormSectionHeader';
import { BillingInfoSection, BillingInfoValidationSchema } from 'components/Forms/common/BillingInfoSection';
import { updateUser } from 'api/userAPI';
import { useSmbProfile } from 'hook/useSmbProfile';
import { usePaymentMethodById } from 'hook/usePaymentMethodById';
import { usePricingPackages } from 'hook/usePricingPackage';
import { useOrganization } from 'hook/useOrganization';
import { showModal } from 'redux/actions/modals.actions';
import { SubscriptionPriceFreeTrail } from './SubscriptionInfoPanel/SubscriptionPriceFreeTrial';
import { DEFAULT_CURRENCY } from 'config/consts';
import { IntentStatus } from 'types/payments/IntentStatus';
import { useStripe } from '@stripe/react-stripe-js';
import { setSmbSubscriptionStatus } from 'redux/actions/user.actions';
import { SubscriptionStatus } from 'types/SubscriptionStatus';
import { handleStripeConfirmation } from 'utils/payments/stripe-payment';
import Logout from 'components/Logout';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';

const ValidationSchema = object({
  language: string().nullable().required(FormErrorKey.REQUIRED),
  phoneNumber: string()
    .nullable()
    .required(FormErrorKey.REQUIRED)
    .test('invalid-format', 'forms.invalidPhone', (p) => p !== null && isValidPhoneNumber(p)),
  creditCard: boolean().oneOf([true], FormErrorKey.REQUIRED),
})
  .concat(BillingInfoValidationSchema(false))
  .required();

export const CompleteSubscription = ({
  AddCreditCardPanelComponent = StripeAddCreditCardPanel,
  PriceComponent = SubscriptionPriceFreeTrail,
  billingInfo,
  showLogout = false,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const stripe = useStripe();
  const [paymentMethodId, setPaymentMethodId] = useState(null);
  const [showCancelLanding, setShowCancelLanding] = useState(false);

  const { smbProfile, error: userInfoError } = useSmbProfile(true);

  const { paymentMethod, error: paymentMethodError, mutate: paymentMethodMutate } = usePaymentMethodById(true, {
    companyId: smbProfile?.companyId,
    paymentMethodId,
  });

  useEffect(() => {
    if (paymentMethodError) {
      dispatch(
        ModalsActions.showModal('RETRIEVE_PAYMENT_METOD_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: t('payments.errorRetrievePaymentMethod'),
          },
        })
      );
    }
  }, [t, dispatch, paymentMethodError]);

  const { pricingPackages } = usePricingPackages(true, smbProfile?.organization);
  const { organization } = useOrganization(true, smbProfile?.organization);

  const { corporateName, vatNumber, country, address, city, zipCode, sdiCode } = billingInfo;

  if (userInfoError) {
    return <>{t(`smb.apiErrors.${userInfoError.response.data?.code}`)}</>;
  }

  const onAddCreditCard = (updateCreditCardField) => {
    dispatch(
      ModalsActions.showModal('ADD_CREDIT_CARD', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          hideCancel: true,
          content: (
            <AddCreditCardPanelComponent
              companyId={smbProfile.companyId}
              onConfirmAdding={(paymentMethodId) => onAddCreditCardConfirm(paymentMethodId, updateCreditCardField)}
            />
          ),
        },
      })
    );
  };

  const onAddCreditCardConfirm = (paymentMethodId, updateCreditCardField) => {
    setPaymentMethodId(paymentMethodId);
    updateCreditCardField();

    dispatch(ModalsActions.hideModal('ADD_CREDIT_CARD'));
    dispatch(
      ModalsActions.showModal('ADD_CREDIT_CARD_SUCCESS', {
        modalType: 'SUCCESS_ALERT',
        modalProps: {
          message: t('smb.addCreditCardSuccess'),
        },
      })
    );
  };

  const getLanguageLabel = (key) => Object.values(LANGUAGE_LOCAL_MAP).find((l) => l.key === key)?.key;

  const handleSubscribeSuccess = (actions) => {
    actions.setSubmitting(false);
    dispatch(setSmbSubscriptionStatus(SubscriptionStatus.TRIALING));
    history.push('/');
  };

  const handleSubscribeFail = () => {
    dispatch(
      showModal('COMPLETE_SUBSCRIPTION_ERROR', {
        modalType: 'ERROR_ALERT',
        modalProps: {
          message: t('smb.errorOnSubscribe'),
        },
      })
    );
  };

  if (smbProfile && pricingPackages && organization) {
    const { firstName, lastName, phoneNumber, email, companyId, languageIsoCode } = smbProfile;

    return (
      <div style={{ margin: '0px auto', paddingBottom: 12, width: '50%' }} data-testid="complete-subscription-page-wrapper">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 23 }}>
          <Typography variantName="title2">{t('smb.subscription')}</Typography>
          {showLogout && <Logout />}
        </div>
        <Typography variantName="body1" style={{ marginTop: 8, marginBottom: 16 }}>
          {t('smb.fillTheForm')}
        </Typography>
        <SubscriptionInfoPanel currency={pricingPackages[0]?.currency.symbol || DEFAULT_CURRENCY.symbol} PriceComponent={PriceComponent} />
        <Typography variantName="overline" style={{ marginBottom: 8 }}>
          {t('smb.organizationName').toUpperCase()}
        </Typography>
        <Typography variantName="title3" textColor="#000000" style={{ marginBottom: 27 }}>
          {organization.name}
        </Typography>
        <LineBreak style={{ marginBottom: 12 }} />
        <FormSectionHeader iconName="person_pin" label={t('smb.profile')} />
        <Formik
          initialValues={{
            language: languageIsoCode,
            phoneNumber,
            corporateName,
            vatNumber,
            country,
            address,
            city,
            zipCode,
            sdiCode,
            creditCard: false,
          }}
          enableReinitialize
          validationSchema={ValidationSchema}
          onSubmit={async (values, actions) => {
            try {
              const requestBody = {
                ...pick(values, ['city', 'corporateName', 'sdiCode', 'vatNumber', 'zipCode']),
                country: values.country,
                address: values.address.label,
              };

              updateUser({
                language: Object.values(LANGUAGE_LOCAL_MAP).find((l) => l.key === values.language)?.backend,
                phoneNumber: values.phoneNumber,
              });

              const {
                data: { clientSecret, status, type },
              } = await confirmAndSubscribe(companyId, requestBody);

              switch (status) {
                case IntentStatus.Succeeded:
                  handleSubscribeSuccess(actions);
                  break;
                case IntentStatus.RequiresAction:
                  if (stripe) {
                    const { error } = await handleStripeConfirmation(stripe, type, clientSecret);
                    error ? handleSubscribeFail() : handleSubscribeSuccess(actions);
                  } else {
                    handleSubscribeFail();
                  }
                  break;
                default:
                  handleSubscribeFail();
                  break;
              }
            } catch (error) {
              handleSubscribeFail();
            }
          }}
        >
          {(props) => (
            <>
              {showCancelLanding && <SmbCancelInfoLandingPanel onBackToForm={() => setShowCancelLanding(false)} />}
              <Form noValidate>
                <div style={{ display: 'flex' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 0.5, marginRight: 40 }}>
                    <Typography variantName="overline" style={{ marginBottom: 10, textTransform: 'uppercase' }}>
                      {t('smb.nameSurname')}
                    </Typography>
                    <Typography variantName="body2">{`${firstName} ${lastName}`}</Typography>
                  </div>
                  <Field name="language">
                    {({ field, meta }) => (
                      <div style={{ flex: 0.5 }}>
                        <Dropdown
                          label={t('smb.language')}
                          {...field}
                          id={field.name}
                          value={
                            field.value
                              ? {
                                  label: t(`languages.${getLanguageLabel(field.value)}`),
                                  value: field.value,
                                }
                              : null
                          }
                          options={Object.values(LANGUAGE_LOCAL_MAP).map((l) => ({
                            label: t(`languages.${l.key}`),
                            value: l.key,
                          }))}
                          onChange={(selected) => props.setFieldValue('language', selected?.value || null)}
                          onBlur={() => props.setFieldTouched('language', true)}
                          error={meta.touched ? t(meta.error) : null}
                          required
                        />
                      </div>
                    )}
                  </Field>
                </div>
                <div style={{ display: 'flex' }}>
                  <div style={{ flex: 0.5, marginRight: 40 }}>
                    <Field name="phoneNumber">
                      {({ field, meta }) => (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <Label htmlFor={field.name} required>
                            {t('smb.phoneNumber')}
                          </Label>
                          <PhoneInput
                            id={field.name}
                            countrySelectProps={{ unicodeFlags: true }}
                            {...field}
                            onChange={(value) => props.setFieldValue('phoneNumber', value)}
                            required
                          />
                          <Typography
                            variantName="error"
                            style={{ visibility: meta.touched && meta.error ? 'visible' : 'hidden', order: 3, minHeight: 18, marginTop: 2 }}
                          >
                            {t(meta.error)}
                          </Typography>
                        </div>
                      )}
                    </Field>
                  </div>
                </div>
                <Typography variantName="overline" style={{ marginBottom: 10 }}>
                  {t('smb.email').toUpperCase()}
                </Typography>
                <Typography variantName="body2" style={{ marginBottom: 18 }}>
                  {email}
                </Typography>
                <LineBreak style={{ marginBottom: 12 }} />
                <FormSectionHeader iconName="credit_card" label={t('smb.creditCard')} />
                {paymentMethod && <CreditCardInfo {...paymentMethod} />}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 30 }} data-testid="no-card-wrapper">
                  {(!paymentMethod || paymentMethodError) && <EmptyCardPlaceholder />}
                  <Typography
                    variantName="textButton"
                    textColor="#5AC0B1"
                    style={{ textDecoration: 'underline', marginLeft: paymentMethod ? 0 : 18 }}
                    onClick={() => {
                      onAddCreditCard(() => props.setFieldValue('creditCard', true));
                    }}
                  >
                    {!paymentMethod ? t('smb.addCreditCard') : t('smb.changeCreditCard')}
                  </Typography>
                  {props.getFieldMeta('creditCard').error && props.getFieldMeta('creditCard').touched && (
                    <Typography variantName="error" style={{ marginLeft: 12 }}>
                      {t(props.errors.creditCard)}
                    </Typography>
                  )}
                </div>
                <LineBreak style={{ marginBottom: 12 }} />
                <BillingInfoSection />
                <div style={{ marginTop: 20, marginBottom: 40 }}>
                  <FormButtons
                    onCancel={() => {
                      if (history.location.pathname === '/subscription') {
                        history.push('/profile');
                      } else {
                        setShowCancelLanding(true);
                        cancelCard(companyId).finally(() => {
                          props.setFieldValue('creditCard', false);
                          paymentMethodMutate(null, false);
                        });
                      }
                    }}
                    submitLabel={t('smb.confirmAndSubscribe')}
                    loading={props.isSubmitting}
                  />
                </div>
              </Form>
            </>
          )}
        </Formik>
      </div>
    );
  } else {
    return <BoomLoadingOverlay />;
  }
};
