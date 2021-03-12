import React from 'react';
import { useTranslation } from 'react-i18next';
import { TextArea } from 'ui-boom-components';
import { object, string, InferType } from 'yup';
import { getTypedField } from 'components/TypedFields';

export const NotesAndLogisticValidationSchema = object({
  description: string().trim().max(240).nullable(),
  logisticInformation: string().trim().max(240).nullable(),
}).required();

type FormFields = InferType<typeof NotesAndLogisticValidationSchema>;
const Field = getTypedField<FormFields>();

export const NotesSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Field name="description">
        {({ field, meta }) => (
          <TextArea
            {...field}
            rows={3}
            label={t('forms.info')}
            value={field.value || undefined}
            error={meta.touched ? t(meta.error!) : undefined}
            autoComplete={'off'}
            placeholder={t('general.maxLengthPlaceholder', { maxLength: 240 })}
            maxLength={240}
          />
        )}
      </Field>
      <Field name="logisticInformation">
        {({ field, meta }) => (
          <TextArea
            {...field}
            rows={3}
            label={t('forms.logistics')}
            value={field.value || undefined}
            error={meta.touched ? t(meta.error!) : undefined}
            autoComplete={'off'}
            placeholder={t('general.maxLengthPlaceholder', { maxLength: 240 })}
            maxLength={240}
          />
        )}
      </Field>
    </>
  );
};
