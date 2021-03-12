import React, { useState } from 'react';
import { object, InferType, number } from 'yup';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { FormSectionHeader } from 'components/FormSectionHeader';
import { SpacedWrapper, Background } from '../styles';
import { Typography, TextField, Accordion } from 'ui-boom-components';
import { NewOrderFields } from '.';
import { getTypedField } from 'components/TypedFields';

export const RefundValidationSchema = object({
  orderRefund: number().moreThan(-1),
}).required();

type FormFields = InferType<typeof RefundValidationSchema>;
const Field = getTypedField<FormFields>();

export const RefundSection: React.FC = () => {
  const { t } = useTranslation();
  const { values } = useFormikContext<NewOrderFields>();
  const [isClose, setClose] = useState(true);

  return (
    <SpacedWrapper>
      <Accordion
        titleComponent={
          <>
            <FormSectionHeader iconName="monetization_on" label={t('forms.newOrder.refund')} />
            <div style={{ margin: 0, right: 40, position: 'relative' }}>
              {isClose &&
                values.pricingPackage?.currency?.symbol &&
                `${values.orderRefund || 0} ${values.pricingPackage?.currency?.symbol}`}
            </div>
          </>
        }
        color="#696767"
        disabled={!values?.pricingPackage}
        onToggle={() => setClose(!isClose)}
      >
        <Typography variantName="caption" style={{ marginBottom: 8 }}>
          {t('forms.newOrder.refundNote')}
        </Typography>
        <Background>
          <Field name="orderRefund">
            {({ field, meta }) => {
              return (
                <TextField
                  {...field}
                  label={`${t('forms.newOrder.refundValue')} ${values.pricingPackage?.currency?.symbol ?? ''}`}
                  id={field.name}
                  value={field.value}
                  error={meta.touched ? t(meta.error!) : undefined}
                  type="number"
                  autoComplete={'off'}
                />
              );
            }}
          </Field>
        </Background>
      </Accordion>
    </SpacedWrapper>
  );
};
