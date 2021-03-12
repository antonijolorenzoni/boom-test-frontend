import React, { useState } from 'react';
import { string, object, InferType } from 'yup';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import { useTranslation } from 'react-i18next';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';

import { LANGUAGE_LOCAL_MAP_PHOTOGRAPHER, FormErrorKey, LANGUAGES_LONG } from 'config/consts';
import { TextField, MediaQueryBreakpoint, Label, Typography, Dropdown, Button, MessageBox } from 'ui-boom-components';
import { requiredMessageKey, EmailValidation } from 'utils/validations';
import { getTypedField } from 'components/TypedFields';

const RowWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  @media screen and (max-width: ${MediaQueryBreakpoint.Smartphone}px) {
    flex-direction: column;
  }
`;

const FieldWrapper = styled.div`
  width: 45%;

  @media screen and (max-width: ${MediaQueryBreakpoint.Smartphone}px) {
    width: auto;
  }
`;

export const ValidationSchema = object({
  email: EmailValidation(false).required(requiredMessageKey),
  phoneNumber: string()
    .required(requiredMessageKey)
    .test('invalid-format', 'forms.invalidPhone', (p) => p !== null && isValidPhoneNumber(p)),
  firstName: string().trim().required(requiredMessageKey),
  lastName: string().trim().required(requiredMessageKey),
  language: string().nullable().required(FormErrorKey.REQUIRED),
}).required();

type FormFields = InferType<typeof ValidationSchema>;
const Field = getTypedField<FormFields>();

interface Props {
  onSubmit: (values: FormFields) => void;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  language: string;
}

export const PhotographerAccountForm: React.FC<Props> = ({ onSubmit, email, firstName, lastName, language, phoneNumber }) => {
  const { t } = useTranslation();
  const [languageSelected, setLanguageSelected] = useState<string>(language);

  const isFallbackAlertActive: boolean = [LANGUAGES_LONG.FRENCH, LANGUAGES_LONG.SPANISH].includes(languageSelected);

  return (
    <Formik
      initialValues={{
        email,
        phoneNumber,
        firstName,
        lastName,
        language,
      }}
      validationSchema={ValidationSchema}
      onSubmit={async (values, actions) => {
        onSubmit(values);
        actions.setSubmitting(false);
      }}
    >
      {({ setFieldTouched, setFieldValue, isSubmitting }) => {
        return (
          <Form>
            <RowWrapper>
              <FieldWrapper>
                <Field name="email">
                  {({ field, meta }) => (
                    <TextField
                      label="Email"
                      {...field}
                      id={field.name}
                      value={field.value}
                      error={meta.touched ? t(meta.error!) : undefined}
                      required
                    />
                  )}
                </Field>
              </FieldWrapper>
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
            </RowWrapper>
            <RowWrapper>
              <FieldWrapper>
                <Field name="firstName">
                  {({ field, meta }) => (
                    <TextField label={t('forms.firstName')} {...field} error={meta.touched ? t(meta.error!) : undefined} required />
                  )}
                </Field>
              </FieldWrapper>
              <FieldWrapper>
                <Field name="lastName">
                  {({ field, meta }) => (
                    <TextField label={t('forms.lastName')} {...field} error={meta.touched ? t(meta.error!) : undefined} required />
                  )}
                </Field>
              </FieldWrapper>
            </RowWrapper>
            <RowWrapper>
              <FieldWrapper>
                <Field name="language">
                  {({ field, meta }) => (
                    <Dropdown
                      label={t('languages.language')}
                      {...field}
                      id={field.name}
                      value={{
                        label: t(`languages.${field.value}`),
                        value: field.value,
                      }}
                      options={Object.values(LANGUAGE_LOCAL_MAP_PHOTOGRAPHER).map((l) => ({
                        label: t(`languages.${l.key}`),
                        value: l.backend,
                      }))}
                      onChange={(selected) => {
                        setFieldValue('language', selected!.value);
                        setLanguageSelected(selected!.value);
                      }}
                      onBlur={() => setFieldTouched('language', true)}
                      error={meta.touched ? t(meta.error!) : null}
                      required
                    />
                  )}
                </Field>
              </FieldWrapper>
            </RowWrapper>
            {isFallbackAlertActive && (
              <div style={{ marginBottom: 50 }}>
                <MessageBox title={t('languages.fallbackAlert')} type="generic" />
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button size="medium" type="submit" loading={isSubmitting} style={{ paddingLeft: 40, paddingRight: 40 }}>
                {t('forms.save')}
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};
