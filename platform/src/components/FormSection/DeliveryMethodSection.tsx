import React from 'react';
import { array, boolean, object, string, InferType } from 'yup';
import { useFormikContext } from 'formik';
import { Typography, Label, Checkbox } from 'ui-boom-components';
import MDChipInputField from 'components/Forms/FormComponents/MDChipInputField';
import { GoogleDriveSelector } from 'components/GoogleDriveSelector';
import { useTranslation } from 'react-i18next';
import { EmailValidation, emailValidationRegexp, requiredMessageKey } from 'utils/validations';
import { getTypedField } from 'components/TypedFields';
import { USER_ROLES } from 'config/consts';
import { useSelector } from 'react-redux';
import { Roles } from 'types/Roles';

interface Props {
  isDriveAuthorized: boolean;
  companyId?: number;
  organizationId?: number;
}

export const DeliveryMethodValidationSchema = object({
  deliveryMethodsEmails: array().of(EmailValidation(false).required(requiredMessageKey)).notRequired(),
  deliveryMethodsIsDriveSelected: boolean().required(requiredMessageKey),
  driveFolderId: string().nullable(),
  driveFolderName: string().nullable(),
}).required();

type FormField = InferType<typeof DeliveryMethodValidationSchema>;
const Field = getTypedField<FormField>();

export const DeliveryMethodSection: React.FC<Props> = ({ isDriveAuthorized, companyId, organizationId }) => {
  const { t } = useTranslation();
  const { values, setFieldTouched, setFieldValue } = useFormikContext<FormField>();

  const { isBoom, isContactCenter } = useSelector((state: any) => ({
    isBoom: state.user.data.isBoom,
    isContactCenter: state.user.data.roles.some((roles: Roles) => roles.name === USER_ROLES.ROLE_CONTACT_CENTER),
  }));

  const onPickCustomFolder = (id: string, name: string) => {
    setFieldValue('driveFolderId', id);
    setFieldValue('driveFolderName', name);
  };

  const onRemoveCustomFolder = () => {
    setFieldValue('driveFolderId', null);
    setFieldValue('driveFolderName', null);
  };

  return (
    <>
      <Field name="deliveryMethodsEmails">
        {({ field, meta }) => (
          <>
            <Label htmlFor={field.name} style={{ marginBottom: 5 }}>
              {t('shootings.deliveryMethodsType.email')}
            </Label>
            <MDChipInputField
              id={field.name}
              value={field.value || undefined}
              handleAddChip={(email?: string | null) =>
                setFieldValue('deliveryMethodsEmails', [
                  ...(field?.value || []),
                  ...[email].filter((e) => !!e && emailValidationRegexp.test(e)),
                ])
              }
              handleDeleteChip={(email?: string | null) =>
                setFieldValue(
                  'deliveryMethodsEmails',
                  field.value?.filter((e: string) => e !== email)
                )
              }
              onBlur={() => setFieldTouched('deliveryMethodsEmails', true)}
              deliveryError={false}
              fullWidth={true}
              disableUnderline={true}
              disabled={isContactCenter}
              variant="outlined"
            />
            <Typography
              variantName="error"
              style={{ visibility: meta.touched && meta.error ? 'visible' : 'hidden', minHeight: 18, marginTop: 3 }}
            >
              {t(meta.error!)}
            </Typography>
          </>
        )}
      </Field>

      <Typography variantName="overline">{t('shootings.yourDriveFolder')}</Typography>
      {isDriveAuthorized && (
        <div style={{ marginBottom: 14, width: '100%' }}>
          <Typography variantName="caption">{t('shootings.defaultFolderDrive')}</Typography>
          <Typography variantName="caption">{t('shootings.indicateAnotherFolder')}</Typography>
        </div>
      )}
      {isDriveAuthorized !== null && !isDriveAuthorized && (
        <Typography variantName="caption">{t('company.clientNotConnectedDriveFolder')}</Typography>
      )}
      {isDriveAuthorized && (
        <GoogleDriveSelector
          customFolderInfo={
            values.driveFolderId && values.driveFolderName ? { id: values.driveFolderId, name: values.driveFolderName } : undefined
          }
          company={companyId && organizationId ? { id: companyId, organization: organizationId } : undefined}
          showPicker={!isBoom}
          showRemoveCustomFolder={!isBoom}
          onPickCustomFolder={onPickCustomFolder}
          onRemoveCustomFolder={onRemoveCustomFolder}
          driveDeliveryFormField={
            <Field name="deliveryMethodsIsDriveSelected">
              {({ field, meta }) => (
                <div style={{ display: 'flex', flexDirection: 'column', margin: '0px 18px 0px 0px' }}>
                  <Checkbox
                    checked={field.value}
                    onChange={() => setFieldValue('deliveryMethodsIsDriveSelected', !values.deliveryMethodsIsDriveSelected)}
                    variantName="classic"
                  />
                </div>
              )}
            </Field>
          }
        />
      )}
    </>
  );
};
