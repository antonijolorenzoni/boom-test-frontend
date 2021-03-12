import React from 'react';
import { string, object, InferType } from 'yup';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { FormSectionHeader } from 'components/FormSectionHeader';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { Typography, TextField, Label } from 'ui-boom-components';
import { RowWrapper, FieldWrapper } from './styles';
import { EmailValidation, requiredMessageKey } from 'utils/validations';
import { getTypedField } from 'components/TypedFields';
import { featureFlag } from 'config/featureFlags';

interface Props {
  isIconTitle?: boolean;
  disabled?: boolean;
  showAdditionalPhoneNumber?: boolean;
}

export const ContactValidationSchema = object({
  contactName: string().trim().required(requiredMessageKey),
  contactPhoneNumber: string()
    .required(requiredMessageKey)
    .test('invalid-format', 'forms.invalidPhone', (p) => p !== null && isValidPhoneNumber(p)),
  additionalContactPhoneNumber: string().test('invalid-format', 'forms.invalidPhone', (p) =>
    p !== null || p !== '' ? true : isValidPhoneNumber(p)
  ),
  contactEmail: EmailValidation(false).required(requiredMessageKey),
  organization: object(),
}).required();

type FormFields = InferType<typeof ContactValidationSchema>;
const Field = getTypedField<FormFields>();

export const ContactSection: React.FC<Props> = ({ isIconTitle = true, disabled = false, showAdditionalPhoneNumber = true }) => {
  const { values, setFieldValue } = useFormikContext<FormFields>();
  const { t } = useTranslation();

  const isM2DBoAdditionalContactEnabled: boolean = featureFlag.isFeatureEnabled('m2d-bo-additional-contact');

  const deliverToMainContact: boolean = values.organization?.deliverToMainContact;

  const additionalLabel = deliverToMainContact ? (
    <Typography variantName="caption">{t('forms.deliverToMainContact')}</Typography>
  ) : undefined;

  return (
    <>
      {isIconTitle ? (
        <FormSectionHeader iconName="person_pin" label={t('forms.contact')} />
      ) : (
        <Typography variantName="title3" style={{ marginBottom: 10 }}>
          {t('forms.contact')}
        </Typography>
      )}
      <RowWrapper>
        <FieldWrapper>
          <Field name="contactName">
            {({ field, meta }) => (
              <TextField
                label={t('forms.contactName')}
                {...field}
                error={meta.touched ? t(meta.error!) : undefined}
                required
                disabled={disabled}
              />
            )}
          </Field>
        </FieldWrapper>
        <FieldWrapper>
          <Field name="contactEmail">
            {({ field, meta }) => (
              <TextField
                label={t('forms.contactEmail')}
                additionalLabel={additionalLabel}
                {...field}
                id={field.name}
                value={field.value}
                error={meta.touched ? t(meta.error!) : undefined}
                required
                disabled={disabled}
              />
            )}
          </Field>
        </FieldWrapper>
      </RowWrapper>
      <RowWrapper>
        <FieldWrapper>
          <Field name="contactPhoneNumber">
            {({ field, meta }) => (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Label htmlFor={field.name} required>
                  {t('forms.contactPhone')}
                </Label>
                <PhoneInput
                  id={field.name}
                  countrySelectProps={{ unicodeFlags: true }}
                  {...field}
                  onChange={(value) => setFieldValue('contactPhoneNumber', value)}
                  required
                  disabled={disabled}
                />
                <Typography
                  variantName="error"
                  style={{ visibility: meta.touched && meta.error ? 'visible' : 'hidden', order: 3, minHeight: 18, marginTop: 2 }}
                >
                  {t(meta.error!)}
                </Typography>
              </div>
            )}
          </Field>
        </FieldWrapper>
        {isM2DBoAdditionalContactEnabled && showAdditionalPhoneNumber && (
          <FieldWrapper>
            <Field name="additionalContactPhoneNumber">
              {({ field, meta }) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Label htmlFor={field.name}>{t('forms.additionalContactPhone')}</Label>
                  <PhoneInput
                    id={field.name}
                    countrySelectProps={{ unicodeFlags: true }}
                    {...field}
                    value={field.value!}
                    onChange={(value) => setFieldValue('additionalContactPhoneNumber', value)}
                    required
                    disabled={disabled}
                  />
                  <Typography
                    variantName="error"
                    style={{ visibility: meta.touched && meta.error ? 'visible' : 'hidden', order: 3, minHeight: 18, marginTop: 2 }}
                  >
                    {t(meta.error!)}
                  </Typography>
                </div>
              )}
            </Field>
          </FieldWrapper>
        )}
      </RowWrapper>
    </>
  );
};
