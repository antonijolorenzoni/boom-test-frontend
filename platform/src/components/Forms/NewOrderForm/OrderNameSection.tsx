import React from 'react';
import { string, object, InferType } from 'yup';
import { useTranslation } from 'react-i18next';
import { TextField } from 'ui-boom-components/lib';
import { FieldWrapper, ImportantSpacedWrapper } from '../styles';
import { requiredMessageKey } from 'utils/validations';
import { getTypedField } from 'components/TypedFields';

export const OrderNameValidationSchema = object({
  orderName: string().trim().required(requiredMessageKey),
}).required();

type FormFields = InferType<typeof OrderNameValidationSchema>;
const Field = getTypedField<FormFields>();

export const OrderNameSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <ImportantSpacedWrapper>
      <FieldWrapper>
        <Field name="orderName">
          {({ field, meta }) => (
            <TextField
              label={t('forms.newOrder.orderName')}
              {...field}
              error={meta.touched ? t(meta.error!) : undefined}
              required
              autoFocus
            />
          )}
        </Field>
      </FieldWrapper>
    </ImportantSpacedWrapper>
  );
};
