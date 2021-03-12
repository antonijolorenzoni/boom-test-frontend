import React, { useState } from 'react';
import { object, string, number, array, boolean, NumberSchema, InferType } from 'yup';
import moment from 'moment-timezone';
import _ from 'lodash';
import { Formik, Form, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { useStripe } from '@stripe/react-stripe-js';
import { useDispatch, useSelector } from 'react-redux';
import { TFunction } from 'i18next';
import { Typography } from 'ui-boom-components';
import { isValidPhoneNumber } from 'react-phone-number-input';

import { usePricingPackages } from 'hook/usePricingPackage';
import { useSmbProfile } from 'hook/useSmbProfile';
import { PricingPackage } from 'types/PricingPackage';
import { Api } from 'components/FormSection/Api';
import { LineBreak } from 'components/common/LineBreak';
import { EmailValidation } from 'utils/validations';
import { join } from 'utils/array';
import { FormButtons } from 'components/Forms/FormComponents/FormButtons';
import { ContactSection } from 'components/FormSection/ContactSection';
import { LocationAndBusinessNameSection } from 'components/FormSection/LocationAndBusinessNameSection';
import { AppointmentDateSection } from './AppointmentDateSection';
import { NotesSectionWrapper } from './NotesSectionWrapper';
import { KNOWN_VALUE } from 'config/consts';
import { SpacedWrapper, ImportantSpacedWrapper } from '../styles';
import { createShooting } from 'api/shootingsAPI';
import * as ModalsActions from 'redux/actions/modals.actions';
import { buildOrderStartDate } from 'utils/date-utils';
import { OrderNameSection } from './OrderNameSection';
import { fetchOrganizations } from 'api/organizationsAPI';
import { fetchOrganizationCompanies, fetchCompanyPricingPackage, fetchCompanyDetails } from 'api/companiesAPI';
import { onFetchGooglePlacesOptions, fetchGoogleAddressDetails } from 'api/instances/googlePlacesInstance';
import { Option } from 'types/Option';
import { MyCreditCardSection } from './MyCreditCardSection';
import { PackageSection } from './PackageSection';
import { TotalPriceSection } from './TotalPriceSection';
import { SmbSummaryPage } from './Summary/SmbSummaryPage';
import { calcuteOrderPrice, createOrderPaymentIntent } from 'api/paymentsAPI';
import { OrderPaymentIntentRequest, PlaceRequest } from 'types/OrderPaymentIntentRequest';
import { IntentStatus } from 'types/payments/IntentStatus';
import { InfoModal } from 'components/Modals/InfoModal';
import { VatAmountResponse } from 'types/VatAmountResponse';

interface Props {
  onCancel: () => void;
  onCreateOrderCompleted: () => void;
  api?: Api;
}

const requiredMessageKey = 'forms.required';

const getValidationSchema = (t: TFunction) =>
  object()
    .shape({
      orderName: string().trim().required(t(requiredMessageKey)),
      pricingPackage: object<PricingPackage, PricingPackage>().nullable().required(t(requiredMessageKey)),
      contactName: string().trim().required(t(requiredMessageKey)),
      contactPhoneNumber: string()
        .required(t(requiredMessageKey))
        .test('invalid-format', t('forms.invalidPhone'), (p) => p !== null && isValidPhoneNumber(p)),
      additionalContactPhoneNumber: string().test('invalid-format', 'forms.invalidPhone', (p) =>
        p !== null || p !== '' ? true : isValidPhoneNumber(p)
      ),
      contactEmail: EmailValidation(false).required(t(requiredMessageKey)),
      fullAddress: object<Option, Option>().nullable().required(t(requiredMessageKey)),
      businessName: string().trim(),
      knowDateAndTime: string().trim().nullable().required(t(requiredMessageKey)),
      date: number()
        .nullable()
        .when('knowDateAndTime', {
          is: KNOWN_VALUE,
          then: number().required(t(requiredMessageKey)),
        }),
      startTime: number()
        .nullable()
        .when('knowDateAndTime', {
          is: KNOWN_VALUE,
          then: number().required(t(requiredMessageKey)),
        })
        .when('date', (date: number, schema: NumberSchema) => {
          return schema
            .test('dateFilledNoTime', t('forms.fillTime'), (startTime) => !(date && !startTime))
            .test('workingHours', t('forms.workingHours'), (startTime) => _.inRange(Number(moment(startTime).format('HH')), 8, 20));
        }),
      deliveryMethodsEmails: array()
        .of(EmailValidation(false).required(t(requiredMessageKey)))
        .notRequired(),
      deliveryMethodsIsDriveSelected: boolean().required(t(requiredMessageKey)),
      orderRefund: number().nullable().moreThan(-1),
      description: string().trim().max(240).nullable(),
      logisticInformation: string().trim().max(240).nullable(),
      editingOption: string().trim().nullable(),
      driveFolderId: string().nullable(),
      driveFolderName: string().nullable(),
      place: object<PlaceRequest>().required(),
    })
    .required();

type Nullable<T> = { [P in keyof T]: T[P] | null };
type WithNullable<T, K extends keyof T> = Omit<T, K> & Nullable<Pick<T, K>>;
type FinalNewOrderFields = InferType<ReturnType<typeof getValidationSchema>>;

export type NewOrderForSubscribersFields = WithNullable<
  FinalNewOrderFields,
  'knowDateAndTime' | 'fullAddress' | 'pricingPackage' | 'place'
>;

const toOrderPaymentIntentRequest = ({
  date,
  startTime,
  place,
  pricingPackage,
  orderName,
  description,
  logisticInformation,
  contactName,
  contactPhoneNumber,
  additionalContactPhoneNumber,
  contactEmail,
  businessName,
}: NewOrderForSubscribersFields): OrderPaymentIntentRequest => {
  return {
    startDate: buildOrderStartDate(date),
    pricingPackage: pricingPackage?.id!,
    place: place!,
    title: orderName,
    description: description ?? '',
    logisticInformation: logisticInformation ?? '',
    mainContact: {
      fullName: contactName,
      email: contactEmail,
      phoneNumber: contactPhoneNumber,
      additionalPhoneNumber: additionalContactPhoneNumber || null,
      businessName: businessName ?? '',
    },
  };
};

export const NewOrderFormForSubscribers: React.FC<Props> = ({
  onCancel,
  onCreateOrderCompleted,
  api = {
    fetchOrganizations,
    fetchOrganizationCompanies,
    fetchCompanyPricingPackage,
    fetchCompanyDetails,
    onFetchGooglePlacesOptions,
    fetchGoogleAddressDetails,
    createShooting,
  },
}) => {
  const { t } = useTranslation();
  const [showSummaryPage, setShowSummaryPage] = useState(false);
  const [createOrderLoading, setCreateOrderLoading] = useState(true);
  const [orderPrice, setOrderPrice] = useState<number>();
  const dispatch = useDispatch();

  const { smbProfile } = useSmbProfile(true);
  const { pricingPackages } = usePricingPackages(true, smbProfile?.organization);

  const initialDate: number = useSelector((state: any) => state.form?.NewShootingForm?.initial?.date);
  const initialStartTime: number = useSelector((state: any) => state.form?.NewShootingForm?.initial?.startTime);

  const stripe = useStripe();

  const onOrderCreationFailed = () => {
    dispatch(
      ModalsActions.showModal('CREATE_ORDER_ERROR', {
        modalType: 'ERROR_ALERT',
        modalProps: {
          message: t('calendar.shootingCreationError'),
        },
      })
    );
  };

  const handleSelectPP = async (pricingPackage: PricingPackage) => {
    const { data }: { data: VatAmountResponse } = await calcuteOrderPrice(smbProfile!.companyId, pricingPackage.id);
    setOrderPrice(data.totalAmount / 100);
  };

  return (
    <>
      <Formik
        initialValues={{
          orderName: '',
          pricingPackage: null,
          contactName: `${smbProfile?.firstName ?? ''} ${smbProfile?.lastName ?? ''}`.trim(),
          contactPhoneNumber: smbProfile?.phoneNumber ?? '',
          additionalContactPhoneNumber: '',
          contactEmail: smbProfile?.email ?? '',
          fullAddress: null,
          place: null,
          businessName: '',
          knowDateAndTime: KNOWN_VALUE,
          date: initialDate || null,
          startTime: initialStartTime || null,
          deliveryMethodsEmails: [],
          deliveryMethodsIsDriveSelected: false,
          orderRefund: 0,
          description: '',
          logisticInformation: '',
          editingOption: null,
          driveFolderId: null,
          driveFolderName: null,
        }}
        enableReinitialize
        validationSchema={getValidationSchema(t)}
        onSubmit={(values, actions) => {
          actions.setSubmitting(false);
          setShowSummaryPage(true);
          setCreateOrderLoading(false);
        }}
      >
        {(props: FormikProps<NewOrderForSubscribersFields>) => {
          const selectedPricingPackage = pricingPackages.find((p) => p.id === props.values?.pricingPackage?.id);

          return showSummaryPage ? (
            <>
              <SmbSummaryPage totalAmount={orderPrice} />
              <ImportantSpacedWrapper>
                <FormButtons
                  onCancel={() => setShowSummaryPage(false)}
                  onSubmit={async () => {
                    if (smbProfile?.companyId && stripe) {
                      setCreateOrderLoading(true);

                      try {
                        const {
                          data: { status, clientSecret },
                        } = await createOrderPaymentIntent(smbProfile?.companyId, toOrderPaymentIntentRequest(props.values));

                        switch (status) {
                          case IntentStatus.Succeeded:
                            return onCreateOrderCompleted();
                          case IntentStatus.RequiresAction:
                            const { error } = await stripe.confirmCardPayment(clientSecret);
                            return error ? onOrderCreationFailed() : onCreateOrderCompleted();
                          default:
                            return onOrderCreationFailed();
                        }
                      } catch {
                        onOrderCreationFailed();
                      } finally {
                        setCreateOrderLoading(false);
                      }
                    }
                  }}
                  cancelLabel={t('general.back')}
                  submitLabel={t('smb.confirmAndCheckout')}
                  loading={createOrderLoading}
                />
              </ImportantSpacedWrapper>
            </>
          ) : (
            <Form style={{ display: 'flex', flexDirection: 'column' }} noValidate>
              <Typography variantName="title2">{t('forms.newOrder.title')}</Typography>
              {join(
                [
                  <OrderNameSection />,
                  <PackageSection pricingPackages={pricingPackages} onSelectPP={handleSelectPP} />,
                  <ContactSection />,
                  <LocationAndBusinessNameSection api={api} businessNameLabelKey={'forms.newOrder.smbBusinessName'} />,
                  <AppointmentDateSection isBoom={false} />,
                  <NotesSectionWrapper />,
                  <MyCreditCardSection />,
                  <TotalPriceSection price={orderPrice} currency={selectedPricingPackage?.currency.symbol} />,
                ].filter((e) => e !== null),
                <SpacedWrapper>
                  <LineBreak />
                </SpacedWrapper>
              ).map((item: React.ReactNode, index: number) => (
                <div key={`new-order-item-${index}`}>{item}</div>
              ))}
              <ImportantSpacedWrapper>
                <FormButtons onCancel={onCancel} isSubmitDisabled={props.isSubmitting} />
              </ImportantSpacedWrapper>
            </Form>
          );
        }}
      </Formik>
      <InfoModal
        id="onGoingPayment"
        title={t('forms.newOrder.payment.onGoingTitle')}
        body={t('forms.newOrder.payment.onGoingDescription')}
        style={{ width: 450 }}
      />
    </>
  );
};
