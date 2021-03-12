import React from 'react';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { Dropdown, TextField, Label, Typography } from 'ui-boom-components';
import { InferType } from 'yup';
import PhoneInput from 'react-phone-number-input';

import { FormSectionHeader } from 'components/FormSectionHeader';
import { getTypedField } from 'components/TypedFields';
import { ValidationSchema } from './';
import { FieldWrapper, RowWrapper } from '../styles';
import { LANGUAGE_LOCAL_MAP } from 'config/consts';

interface Props {}

type FormFields = InferType<typeof ValidationSchema>;
const Field = getTypedField<FormFields>();

const getLanguageLabel = (key: string): string | undefined => Object.values(LANGUAGE_LOCAL_MAP).find((l) => l.key === key)?.key;

export const UserPersonalInfoSection: React.FC<Props> = () => {
  const { t } = useTranslation();
  const { setFieldTouched, setFieldValue } = useFormikContext<FormFields>();

  return (
    <div>
      <FormSectionHeader iconName="person_pin" label={t('forms.smbProfile.profile')} />
      <RowWrapper>
        <FieldWrapper>
          <Field name="firstName">
            {({ field, meta }) => (
              <TextField label={t('forms.smbProfile.name')} {...field} error={meta.touched ? t(meta.error!) : undefined} required />
            )}
          </Field>
        </FieldWrapper>
        <FieldWrapper>
          <Field name="lastName">
            {({ field, meta }) => (
              <TextField label={t('forms.smbProfile.surname')} {...field} error={meta.touched ? t(meta.error!) : undefined} required />
            )}
          </Field>
        </FieldWrapper>
      </RowWrapper>
      <RowWrapper>
        <FieldWrapper>
          <Field name="phoneNumber">
            {({ field, meta }) => (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Label htmlFor={field.name} required>
                  {t('forms.smbProfile.phoneNumber')}
                </Label>
                <PhoneInput
                  id={field.name}
                  countrySelectProps={{ unicodeFlags: true }}
                  {...field}
                  onChange={(value) => setFieldValue('phoneNumber', value)}
                  required
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
        <FieldWrapper>
          <Field name="language">
            {({ field, meta }) => {
              return (
                <div style={{ flex: 0.5 }}>
                  <Dropdown
                    label={t('forms.smbProfile.language')}
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
                    onChange={(selected) => setFieldValue('language', selected?.value || null)}
                    onBlur={() => setFieldTouched('language', true)}
                    error={meta.touched ? t(meta.error!) : null}
                    required
                  />
                </div>
              );
            }}
          </Field>
        </FieldWrapper>
      </RowWrapper>
      <RowWrapper>
        <FieldWrapper>
          <Field name="email">
            {({ field, meta }) => (
              <TextField
                label={t('forms.smbProfile.email')}
                id={field.name}
                {...field}
                error={meta.touched ? t(meta.error!) : undefined}
                required
              />
            )}
          </Field>
        </FieldWrapper>
      </RowWrapper>
    </div>
  );
};
