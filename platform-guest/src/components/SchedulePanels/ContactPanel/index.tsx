import React, { Dispatch, SetStateAction } from 'react';
import { Order } from 'types/Order';
import { Wrapper, RowWrapper, OneThirdWrapper, TextFieldOversize } from './styles';
import { useTranslation } from 'react-i18next';
import { Typography } from 'ui-boom-components';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { getTypedField } from 'components/TypedField';
import { useMediaQuery } from 'react-responsive';
import { MediaQueryBreakpoint } from 'types/MediaQueryBreakpoint';

const ValidationSchema = Yup.object().shape({ businessName: Yup.string() }).required();

interface Props {
  order: Order;
  setUpdatedOrder: Dispatch<SetStateAction<Order>>;
  onAddStep: () => void;
  renderNavigationButtons: (isFormValid: boolean) => JSX.Element;
}

type FormFields = Yup.InferType<typeof ValidationSchema>;
const Field = getTypedField<FormFields>();

export const ContactPanel: React.FC<Props> = ({ order, renderNavigationButtons, onAddStep, setUpdatedOrder }) => {
  const { t } = useTranslation();

  const isTabletOrMobile = useMediaQuery({ query: `screen and (max-width: ${MediaQueryBreakpoint.Tablet}px)` });

  const { name, phone, email } = order.contact;

  return (
    <Wrapper>
      <Typography variantName="title3" style={{ marginBottom: 10 }}>
        {t('form.contact')}
      </Typography>
      <RowWrapper>
        <OneThirdWrapper style={{ marginTop: 0 }}>
          <Typography variantName="overline" style={{ marginBottom: 10 }}>
            {t('orderInfo.nameSurname').toUpperCase()}
          </Typography>
          <Typography variantName="kpi1">{name}</Typography>
        </OneThirdWrapper>
        <OneThirdWrapper>
          <Typography variantName="overline" style={{ marginBottom: 10 }}>
            {t('orderInfo.phone').toUpperCase()}
          </Typography>
          <Typography variantName="kpi1">{phone}</Typography>
        </OneThirdWrapper>
        <OneThirdWrapper>
          <Typography variantName="overline" style={{ marginBottom: 10 }}>
            {t('orderInfo.email').toUpperCase()}
          </Typography>
          <Typography variantName="kpi1">{email}</Typography>
        </OneThirdWrapper>
      </RowWrapper>
      <Typography variantName="title3" style={{ marginTop: 36, marginBottom: 10 }}>
        {t('form.business')}
      </Typography>
      <Formik
        initialValues={{
          businessName: order.businessName || '',
        }}
        validationSchema={ValidationSchema}
        onSubmit={(values, actions) => {
          setUpdatedOrder((order) => ({ ...order, businessName: values.businessName }));
          onAddStep();
          actions.setSubmitting(false);
        }}
      >
        {(props) => (
          <Form>
            <Field name="businessName">
              {({ field, meta }) => (
                <div style={{ display: 'flex', flexDirection: 'column', width: isTabletOrMobile ? '100%' : '33%' }}>
                  <TextFieldOversize
                    label={t('orderInfo.businessName').toUpperCase()}
                    name={field.name}
                    value={field.value}
                    error={meta.error}
                    onChange={field.onChange}
                    style={{ fontWeight: 500, fontSize: 17 }}
                  />
                </div>
              )}
            </Field>
            {renderNavigationButtons(props.isValid)}
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};
