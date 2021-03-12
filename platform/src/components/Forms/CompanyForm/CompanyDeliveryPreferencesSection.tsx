import React from 'react';
import { boolean, InferType, object } from 'yup';

import { RowWrapper, FieldWrapper } from '../styles';
import { getTypedField } from 'components/TypedFields';
import { Label, Checkbox } from 'ui-boom-components';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';

export const CompanyDeliveryPrefsValidationSchema = object({
  deliveryMainContact: boolean(),
}).required();

type FormFields = InferType<typeof CompanyDeliveryPrefsValidationSchema>;
const Field = getTypedField<FormFields>();

export const CompanyDeliveryPreferencesSection: React.FC<{ disabled: boolean }> = ({ disabled }) => {
  const { t } = useTranslation();
  const { setFieldValue } = useFormikContext<FormFields>();
  return (
    <>
      <RowWrapper>
        <FieldWrapper>
          <Field name="deliveryMainContact">
            {({ field, meta }) => (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Label htmlFor={field.name}>{t('forms.deliveryPreferences.title')}</Label>
                <Checkbox
                  size={14}
                  checked={field.value}
                  variantName={'classic'}
                  onChange={() => (!disabled ? setFieldValue('deliveryMainContact', !field.value) : null)}
                  label={t(`forms.deliveryPreferences.checkboxLabel`)}
                  disabled={disabled}
                />
              </div>
            )}
          </Field>
        </FieldWrapper>
      </RowWrapper>
    </>
  );
};
