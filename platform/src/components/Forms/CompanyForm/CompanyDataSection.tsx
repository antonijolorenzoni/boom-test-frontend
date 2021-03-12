import React from 'react';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { array, object, string } from 'yup';
import { Dropdown, TextField, Label, Typography, Checkbox } from 'ui-boom-components';
import { InferType } from 'yup';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';

import { getTypedField } from 'components/TypedFields';
import { FieldInlineWrapper, RowWrapper, FieldWrapper } from '../styles';
import { FormErrorKey, LANGUAGE_LOCAL_MAP } from 'config/consts';
import { requiredMessageKey } from 'utils/validations';
import { Phototype } from 'types/Phototype';
import { UploadComponent } from '../FormComponents/FileDropZone/UploadComponent';

export const CompanyDataValidationSchema = object({
  businessName: string().nullable().required(requiredMessageKey),
  logo: string().nullable(),
  phoneNumber: string()
    .nullable()
    .required(requiredMessageKey)
    .test('invalid-format', FormErrorKey.INVALID_PHONE, (value) => isValidPhoneNumber(value!)),
  language: string().nullable().required(requiredMessageKey),
  photoTypes: array().of(string().required()).ensure().required(requiredMessageKey),
}).required();

type FormFields = InferType<typeof CompanyDataValidationSchema>;
const Field = getTypedField<FormFields>();

interface Props {
  photoTypesList: Array<Phototype>;
}
export const CompanyDataSection: React.FC<Props> = ({ photoTypesList }) => {
  const { t } = useTranslation();
  const { setFieldTouched, setFieldValue } = useFormikContext<FormFields>();

  const getPhotoTypesValues = (value: Array<string>, type: string) =>
    value.includes(type) ? value.filter((val) => val !== type) : [...value, type];

  return (
    <div>
      <RowWrapper>
        <FieldWrapper>
          <Field name="businessName">
            {({ field, meta }) => (
              <TextField label={t('forms.companyName')} {...field} error={meta.touched ? t(meta.error!) : undefined} required />
            )}
          </Field>
        </FieldWrapper>
      </RowWrapper>
      <RowWrapper>
        <FieldInlineWrapper>
          <Field name="logo">
            {({ field, meta }) => (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Label htmlFor={field.name}>{t('forms.logo')}</Label>
                <UploadComponent
                  onDrop={(file) => {
                    setFieldValue('logo', file);
                  }}
                />
              </div>
            )}
          </Field>
        </FieldInlineWrapper>
      </RowWrapper>
      <RowWrapper>
        <FieldWrapper>
          <Field name="phoneNumber">
            {({ field, meta }) => (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Label htmlFor={field.name} required>
                  {t('forms.phone')}
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
                    label={t('languages.language')}
                    {...field}
                    id={field.name}
                    value={
                      field.value
                        ? {
                            label: t(`languages.${field.value}`),
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
          <Field name="photoTypes">
            {({ field, meta }) => {
              // because of yup array infertype problems
              const values = (field.value as unknown) as Array<string>;

              return (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Label htmlFor={field.name} required>
                    {t('forms.photoTypes')}
                  </Label>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    {photoTypesList.map((pt: Phototype) => (
                      <Checkbox
                        size={14}
                        checked={values.includes(pt.type)}
                        variantName={'classic'}
                        onChange={() => setFieldValue('photoTypes', getPhotoTypesValues(values, pt.type))}
                        label={t(`photoTypes.${pt.type}`)}
                        key={pt.type}
                      />
                    ))}
                  </div>
                  <Typography
                    variantName="error"
                    style={{
                      visibility: meta.touched && meta.error ? 'visible' : 'hidden',
                      order: 3,
                      minHeight: 18,
                      marginTop: 2,
                    }}
                  >
                    {t(meta?.error || '')}
                  </Typography>
                </div>
              );
            }}
          </Field>
        </FieldWrapper>
      </RowWrapper>
    </div>
  );
};
