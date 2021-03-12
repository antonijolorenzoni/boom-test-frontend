import React, { useEffect, useState } from 'react';
import { ContactSection, ContactValidationSchema } from 'components/FormSection/ContactSection';
import { Form, Formik } from 'formik';
import { object, InferType, string } from 'yup';
import { DateAndLocationPanel } from './DateAndLocationPanel';
import { NotesSection, NotesAndLogisticValidationSchema } from 'components/FormSection/NotesSection';
import { EditingSection, EditingValidationSchema } from 'components/FormSection/EditingSection';
import { TextField, Typography } from 'ui-boom-components';
import { useTranslation } from 'react-i18next';
import { FormButtons } from 'components/Forms/FormComponents/FormButtons';
import { featureFlag } from 'config/featureFlags';
import {
  DELIVERY_METHOD_TYPE,
  EXTERNAL_EDITING_VALUE,
  MAP_DATA_PIPELINE_TO_FE_STATUS,
  ORDER_EDITING_FE_STATUSES,
  SHOOTINGS_STATUSES,
} from 'config/consts';
import { fetchCompanyDetails } from 'api/companiesAPI';
import { requiredMessageKey } from 'utils/validations';
import { getTypedField } from 'components/TypedFields';
import _ from 'lodash';
import { DeliveryMethod } from 'types/DeliveryMethod';
import { DeliveryMethodWrapper } from './DeliveryMethodWrapper';
import { DeliveryMethodValidationSchema } from 'components/FormSection/DeliveryMethodSection';
import { useWhoAmI } from 'hook/useWhoAmI';
import { ShowForPermissions } from 'components/Permission/ShowFor';
import { Permission } from 'types/Permission';

const OldAdditionalInfoValidationSchema =
  // not compiling if something is not inserted as object here :| to investigate
  object({ _: string().notRequired() })
    .concat(object({ contact: string().trim().required(requiredMessageKey) }).required())
    .concat(NotesAndLogisticValidationSchema)
    .concat(EditingValidationSchema)
    .concat(DeliveryMethodValidationSchema)
    .required();

const AdditionalInfoValidationSchema =
  // not compiling if something is not inserted as object here :| to investigate
  object({ _: string().notRequired() })
    .concat(ContactValidationSchema)
    .concat(NotesAndLogisticValidationSchema)
    .concat(EditingValidationSchema)
    .concat(DeliveryMethodValidationSchema)
    .required();

type OldAdditionalInfoFields = InferType<typeof OldAdditionalInfoValidationSchema>;
const OldField = getTypedField<OldAdditionalInfoFields>();

type AdditionalInfoFields = InferType<typeof AdditionalInfoValidationSchema>;

interface Props {
  onCancel: () => void;
  order: any;
  onSubmit: (values: OldAdditionalInfoFields | AdditionalInfoFields, deliveryDataChange: boolean) => void;
}

const getContactValues = (mainContact: any, contact: string) =>
  mainContact
    ? {
        contactName: mainContact.fullName,
        contactPhoneNumber: mainContact.phoneNumber,
        additionalContactPhoneNumber: mainContact.additionalPhoneNumber || '',
        contactEmail: mainContact.email,
      }
    : { contact };

export const OrderAdditionalInfoForm: React.FC<Props> = ({ onCancel, order, onSubmit }) => {
  const {
    canChangeEditingOption,
    mainContact,
    description,
    logisticInformation,
    editingOption,
    contact,
    editingStatus,
    state,
    deliveryMethods,
    company: { id: companyId, organization: organizationId },
    id,
  } = order;

  const [companyDetails, setCompanyDetails] = useState<{ googleAuthorized: boolean } | null>(null);
  const [deliveryDataChange, setDeliveryDataChange] = useState<boolean>(false);

  const { isBoom, isSMB } = useWhoAmI();
  const { t } = useTranslation();

  const isEditingEnable: boolean = featureFlag.isFeatureEnabled('editing-a1');
  const editingState: string = MAP_DATA_PIPELINE_TO_FE_STATUS[editingStatus];

  const isEditingOptionExternal = editingOption === EXTERNAL_EDITING_VALUE;
  const isEditingExtStarting = isEditingOptionExternal && (!editingState || editingState === ORDER_EDITING_FE_STATUSES.CREATING);
  const isEditingExtEnded = isEditingOptionExternal && editingState === ORDER_EDITING_FE_STATUSES.DONE;
  const isEditingFieldDisabled =
    !canChangeEditingOption || (state === SHOOTINGS_STATUSES.POST_PROCESSING && (isEditingExtStarting || isEditingExtEnded));

  const deliveryEmails = deliveryMethods
    .filter((method: DeliveryMethod) => method.type === DELIVERY_METHOD_TYPE.EMAIL)
    .map(({ contact }: { contact: string }) => contact);
  const driveDeliveryMethod = deliveryMethods.find((method: any) => method.type === DELIVERY_METHOD_TYPE.DRIVE);

  useEffect(() => {
    if (organizationId !== null && companyId !== null) {
      fetchCompanyDetails(organizationId, companyId).then((response: any) => {
        setCompanyDetails(response.data);
      });
    }
  }, [companyId, organizationId]);

  return (
    <Formik
      initialValues={{
        ...getContactValues(mainContact, contact),
        deliveryMethodsEmails: deliveryEmails,
        deliveryMethodsIsDriveSelected: Boolean(driveDeliveryMethod),
        description,
        logisticInformation,
        editingOption,
        driveFolderId: _.get(driveDeliveryMethod, 'contact', null),
        driveFolderName: _.get(driveDeliveryMethod, 'alias', null),
      }}
      enableReinitialize
      validationSchema={mainContact ? AdditionalInfoValidationSchema : OldAdditionalInfoValidationSchema}
      onSubmit={(values) => {
        onSubmit(values, deliveryDataChange);
      }}
    >
      {({ isSubmitting }) => (
        <Form style={{ display: 'flex', flexDirection: 'column' }}>
          <DateAndLocationPanel order={order} />
          <ShowForPermissions permissions={[Permission.OrderBoInfoRead]}>
            {mainContact ? (
              <ContactSection
                isIconTitle={false}
                disabled={!isBoom}
                showAdditionalPhoneNumber={getContactValues(mainContact, contact).additionalContactPhoneNumber}
              />
            ) : (
              <>
                <Typography variantName="title3" style={{ marginBottom: 10 }}>
                  {t('forms.contact')}
                </Typography>
                <OldField name="contact">
                  {({ field, meta }) => (
                    <TextField
                      label={t('forms.contact')}
                      {...field}
                      id={field.name}
                      value={field.value}
                      error={meta.touched ? t(meta.error!) : undefined}
                      required
                      disabled={!isBoom}
                    />
                  )}
                </OldField>
              </>
            )}
          </ShowForPermissions>
          <Typography variantName="title3" style={{ marginBottom: 10 }}>
            {t('forms.additionalInfo.notes')}
          </Typography>
          <NotesSection />
          {!isSMB && (
            <Typography variantName="title3" style={{ marginBottom: 10 }}>
              {t('forms.additionalInfo.deliveryMethod')}
            </Typography>
          )}
          <div style={{ marginBottom: 26 }}>
            <DeliveryMethodWrapper
              isDriveAuthorized={!!companyDetails?.googleAuthorized}
              companyId={companyId}
              organizationId={organizationId}
              state={state}
              id={id}
              setDeliveryDataChange={setDeliveryDataChange}
              deliveryDataChange={deliveryDataChange}
            />
          </div>
          {isBoom && isEditingEnable && editingOption && (
            <>
              <Typography variantName="title3" style={{ marginBottom: 10 }}>
                {t('forms.additionalInfo.editing')}
              </Typography>
              <EditingSection isPricingPackageSelected={true} canChangeEditingOption={!isEditingFieldDisabled} />
            </>
          )}
          <div style={{ marginTop: 28 }}>
            <FormButtons onCancel={onCancel} loading={isSubmitting} />
          </div>
        </Form>
      )}
    </Formik>
  );
};
