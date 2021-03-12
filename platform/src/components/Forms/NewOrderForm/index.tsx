import React, { useState } from 'react';
import styled from 'styled-components';
import { object, InferType, string } from 'yup';
import moment from 'moment-timezone';
import { Formik, Form, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { join } from 'utils/array';
import { FormButtons } from 'components/Forms/FormComponents/FormButtons';
import { CompanyAndPackageSection, CompanyValidationSchema } from './CompanyAndPackageSection';
import { ContactSection, ContactValidationSchema } from 'components/FormSection/ContactSection';
import {
  LocationAndBusinessNameSection,
  LocationAndBusinessNameValidationSchema,
} from 'components/FormSection/LocationAndBusinessNameSection';
import { AppointmentDateSection, AppointmentDateValidationSchema, BoomAppointmentDateValidationSchema } from './AppointmentDateSection';
import { RefundSection, RefundValidationSchema } from './RefundSection';
import { DeliveryMethodValidationSchema } from 'components/FormSection/DeliveryMethodSection';
import { DeliveryMethodSectionWrapper } from './DeliveryMethodSectionWrapper';
import { NotesSectionWrapper } from './NotesSectionWrapper';
import { NotesAndLogisticValidationSchema } from 'components/FormSection/NotesSection';
import { EditingValidationSchema } from 'components/FormSection/EditingSection';
import { EditingSectionWrapper } from './EditingSectionWrapper';
import { SummaryPage } from './Summary/SummaryPage';
import { Typography } from 'ui-boom-components';
import { INTERNAL_EDITING_VALUE, KNOWN_VALUE, SHOOTING_STATUSES_UI_ELEMENTS } from 'config/consts';
import { featureFlag } from 'config/featureFlags';
import { SpacedWrapper, ImportantSpacedWrapper } from '../styles';
import { createShooting } from 'api/shootingsAPI';
import * as ModalsActions from 'redux/actions/modals.actions';
import { buildOrderStartDate } from 'utils/date-utils';
import { OrderNameSection, OrderNameValidationSchema } from './OrderNameSection';
import { LineBreak } from 'components/common/LineBreak';

import { fetchOrganizations } from 'api/organizationsAPI';
import { fetchOrganizationCompanies, fetchCompanyPricingPackage, fetchCompanyDetails } from 'api/companiesAPI';
import { onFetchGooglePlacesOptions, fetchGoogleAddressDetails } from 'api/instances/googlePlacesInstance';
import { Api } from 'components/FormSection/Api';
import { PricingPackage } from 'types/PricingPackage';
import { PackageValidationSchema } from './PackageRow';
import { useWhoAmI } from 'hook/useWhoAmI';
import { neutralLightGrey } from 'components/common/colors';
import { useOrganization } from 'hook/useOrganization';

const getValidationSchema = (isBoom: boolean) =>
  // not compiling if something is not inserted as object here :| to investigate
  object({ _: string().notRequired() })
    .concat(OrderNameValidationSchema)
    .concat(CompanyValidationSchema)
    .concat(PackageValidationSchema)
    .concat(ContactValidationSchema)
    .concat(LocationAndBusinessNameValidationSchema)
    .concat(isBoom ? BoomAppointmentDateValidationSchema : AppointmentDateValidationSchema)
    .concat(DeliveryMethodValidationSchema)
    .concat(EditingValidationSchema)
    .concat(RefundValidationSchema)
    .concat(NotesAndLogisticValidationSchema)
    .required();

type Nullable<T> = { [P in keyof T]: T[P] | null };
type WithNullable<T, K extends keyof T> = Omit<T, K> & Nullable<Pick<T, K>>;
type FinalNewOrderFields = InferType<ReturnType<typeof getValidationSchema>>;

export type NewOrderFields = WithNullable<
  FinalNewOrderFields,
  'knowDateAndTime' | 'fullAddress' | 'organization' | 'company' | 'pricingPackage'
>;

const toShootingDTO = (
  {
    company,
    editingOption,
    date,
    place,
    pricingPackage,
    orderName,
    description,
    logisticInformation,
    deliveryMethodsEmails,
    deliveryMethodsIsDriveSelected,
    driveFolderId,
    driveFolderName,
    contactName,
    contactPhoneNumber,
    additionalContactPhoneNumber,
    contactEmail,
    businessName,
    knowDateAndTime,
  }: NewOrderFields,
  referenceCode?: string
) => {
  return {
    company: company?.value,
    editingOption: editingOption || INTERNAL_EDITING_VALUE,
    startDate: knowDateAndTime === KNOWN_VALUE ? buildOrderStartDate(date) : null,
    pricingPackage: pricingPackage?.id,
    place: place,
    title: orderName,
    description: description,
    logisticInformation: logisticInformation,
    deliveryEmails: deliveryMethodsEmails,
    driveDelivery: deliveryMethodsIsDriveSelected,
    driveFolderId: driveFolderId,
    driveFolderName: driveFolderName,
    mainContact: {
      fullName: contactName,
      email: contactEmail,
      phoneNumber: contactPhoneNumber,
      additionalPhoneNumber: additionalContactPhoneNumber || null,
      businessName: businessName,
    },
    referenceCode,
  };
};

interface Props {
  onCancel: () => void;
  onCreateOrderCompleted: (organizationId: number, orderId: number, refund: number) => void;
  api?: Api;
  referenceCode?: string;
  initialDate?: number;
  initialStartTime?: number;
  initialValues?: NewOrderFields;
}

const ReferenceCodeBadge = styled.div`
  background: ${neutralLightGrey};
  border-radius: 4px;
  margin-left: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px 6px;
`;

export const NewOrderForm: React.FC<Props> = ({
  onCancel,
  onCreateOrderCompleted,
  referenceCode,
  initialDate,
  initialStartTime,
  initialValues,
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
  const [pricingPackages, setPricingPackages] = useState<Array<PricingPackage>>([]);
  const [companyDetails, setCompanyDetails] = useState<{ googleAuthorized: boolean } | null>(null);
  const dispatch = useDispatch();

  const isEditingEnable: boolean = featureFlag.isFeatureEnabled('editing-a1');
  const { isBoom } = useWhoAmI();
  const userOrganizationId: number = useSelector((state: any) => state.user.data.organization);

  const { organization } = useOrganization(!isBoom, userOrganizationId);

  return (
    <Formik
      initialValues={
        initialValues || {
          orderName: '',
          organization: organization
            ? {
                value: organization.id,
                label: organization.name,
                deliverToMainContact: organization.deliverToMainContact,
              }
            : null,
          company: null,
          pricingPackage: null,
          contactName: '',
          contactPhoneNumber: '',
          additionalContactPhoneNumber: '',
          contactEmail: '',
          fullAddress: null,
          place: null,
          businessName: '',
          knowDateAndTime: null,
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
        }
      }
      enableReinitialize
      validationSchema={getValidationSchema(isBoom)}
      onSubmit={(values, actions) => {
        actions.setSubmitting(false);
        setShowSummaryPage(true);
        setCreateOrderLoading(false);
      }}
    >
      {(props: FormikProps<NewOrderFields>) => {
        return showSummaryPage ? (
          <>
            <SummaryPage isBoom={isBoom} isEditingEnable={isEditingEnable} />
            <ImportantSpacedWrapper>
              <FormButtons
                onCancel={() => setShowSummaryPage(false)}
                onSubmit={() => {
                  setCreateOrderLoading(true);
                  api
                    .createShooting(props.values.organization?.value, toShootingDTO(props.values, referenceCode))
                    .then((result: any) => {
                      onCancel();
                      dispatch(
                        ModalsActions.showModal('CREATE_ORDER_SUCCESS', {
                          modalType: 'SUCCESS_ALERT',
                          modalProps: {
                            message: t('calendar.shootingCreationSuccess'),
                          },
                        })
                      );

                      const { company, id } = result.data;
                      onCreateOrderCompleted(company.organization, id, props.values.orderRefund ?? 0);
                    })
                    .catch((error: any) => {
                      if (error.response.data.code === 17003) {
                        const nowTime = moment.tz(moment.utc(), props.values.place?.timezone).add(24, 'hours').format('LLL');
                        // 24h rescheduling error
                        dispatch(
                          ModalsActions.showModal('SHOOTING_CREATION_ERROR_MODAL', {
                            modalType: 'MODAL_DIALOG',
                            modalProps: {
                              title: t('forms.warning'),
                              bodyText: (
                                <div>
                                  <p>{t('forms.reserve24HoursErrorWithTime', { time: nowTime })}</p>
                                  <p>{t('forms.reserve24HoursErrorWithTimeContacts')}</p>
                                </div>
                              ),
                              cancelText: 'Ok',
                            },
                          })
                        );
                      } else {
                        dispatch(
                          ModalsActions.showModal('CREATE_ORDER_ERROR', {
                            modalType: 'ERROR_ALERT',
                            modalProps: {
                              message: t('calendar.shootingCreationError'),
                            },
                          })
                        );
                      }

                      setCreateOrderLoading(false);
                    });
                }}
                cancelLabel={t('general.back')}
                submitLabel={t('general.publish')}
                isSubmitDisabled={createOrderLoading}
              />
            </ImportantSpacedWrapper>
          </>
        ) : (
          <Form style={{ display: 'flex', flexDirection: 'column' }} noValidate>
            <div style={{ display: 'flex' }}>
              <Typography variantName="title2">{t('forms.newOrder.title')}</Typography>
              {referenceCode && (
                <ReferenceCodeBadge>
                  <Typography variantName="caption2" textColor={SHOOTING_STATUSES_UI_ELEMENTS.RESHOOT?.color}>
                    {t('order.fromOrder', { referenceCode: referenceCode })}
                  </Typography>
                </ReferenceCodeBadge>
              )}
            </div>
            {join(
              [
                <OrderNameSection />,
                <CompanyAndPackageSection
                  api={api}
                  pricingPackages={pricingPackages}
                  onSetPricingPackages={setPricingPackages}
                  onSetCompanyDetails={setCompanyDetails}
                  isBoom={isBoom}
                />,
                <ContactSection />,
                <LocationAndBusinessNameSection api={api} />,
                <AppointmentDateSection isBoom={isBoom} />,
                ...(isBoom ? [<RefundSection />] : []),
                <DeliveryMethodSectionWrapper isDriveAuthorized={!!companyDetails?.googleAuthorized} />,
                <NotesSectionWrapper />,
                ...(isEditingEnable && isBoom ? [<EditingSectionWrapper />] : []),
              ],
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
  );
};
