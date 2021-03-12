import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { mutate } from 'swr';
import { Order } from 'types/Order';
import { OneThirdWrapper, RowWrapper, Wrapper, WrapperButtons, OneHalfWrapper, addressAutocompleteStyle } from './styles';
import { Typography, Checkbox, OutlinedButton, Button, Icon, AsyncDropdown } from 'ui-boom-components';
import { useMediaQuery } from 'react-responsive';
import { MediaQueryBreakpoint } from 'types/MediaQueryBreakpoint';
import { OrderStatus } from 'types/OrderStatus';
import 'react-phone-number-input/style.css';
import { ApiPath } from 'types/ApiPath';

import { getTypedField } from 'components/TypedField';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import i18n from 'i18n';
import { onFetchGooglePlacesOptions, fetchGoogleAddressDetails } from 'utils/google-place';
import { updateShooting } from 'api/shootingAPI';
import { AddressDto } from 'types/AddressDto';

const ValidationSchema = Yup.object()
  .shape<{ address: any }>({ address: Yup.object().typeError(i18n.t('form.required')) })
  .required();

export interface Props {
  order: Order;
  onSetEditMode: Dispatch<SetStateAction<boolean>>;
}

export const EditPanel: React.FC<Props> = ({ order, onSetEditMode }) => {
  const { t } = useTranslation();

  const [isContactOnSite, setIsContactOnSite] = useState<boolean>(true);
  const [initialFullAddress, setInitialFullAddress] = useState<AddressDto>(null);

  useEffect(() => {
    fetchGoogleAddressDetails(order.address).then((result) => setInitialFullAddress(result));
  }, [order.address]);

  const isMobileOrTablet = useMediaQuery({ query: `screen and (max-width: ${MediaQueryBreakpoint.Tablet}px)` });

  const { name, phone, email } = order.contact;
  const { address, orderStatus } = order;
  const isUnscheduled = orderStatus === OrderStatus.Unscheduled;

  const renderNavigationButtons = (isFormValid: boolean): JSX.Element => {
    return (
      <WrapperButtons>
        <OutlinedButton
          color="#5AC0B1"
          backgroundColor="transparent"
          style={{ width: 93 }}
          onClick={() => onSetEditMode(false)}
          data-testid="back-button"
        >
          <Typography variantName="title3" textColor="#5AC0B1">
            {t('form.back')}
          </Typography>
        </OutlinedButton>
        <Button type="submit" style={{ width: 93 }} disabled={!isFormValid} data-testid="edit-button">
          <Typography variantName="title3" textColor="#ffffff">
            {t('form.confirm')}
          </Typography>
        </Button>
      </WrapperButtons>
    );
  };

  type FormFields = Yup.InferType<typeof ValidationSchema>;
  const Field = getTypedField<FormFields>();

  return (
    <div style={{ maxWidth: 958, width: '100%' }}>
      <Typography
        variantName="title2"
        textColor="#ffffff"
        style={{ marginBottom: isMobileOrTablet ? 17 : 7, marginLeft: isMobileOrTablet ? 30 : 20 }}
      >
        {t('orderInfo.yourPhotoshooting').toUpperCase()}
      </Typography>
      <Wrapper>
        <Typography variantName="overline" style={{ marginBottom: isMobileOrTablet ? 7 : 30 }}>
          {t('editOrder.editContact').toUpperCase()}
        </Typography>
        <Typography variantName="title3" style={{ marginBottom: isMobileOrTablet ? 4 : 11 }}>
          {t('form.contact')}
        </Typography>
        <RowWrapper>
          <OneThirdWrapper style={{ marginRight: isMobileOrTablet ? 0 : 75 }}>
            <Typography variantName="overline" style={{ marginBottom: 10 }}>
              {t('orderInfo.nameSurname').toUpperCase()}
            </Typography>
            <Typography variantName="kpi1">{name}</Typography>
          </OneThirdWrapper>
          <OneThirdWrapper style={{ marginRight: isMobileOrTablet ? 0 : 75 }}>
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
        {false && (
          <div style={{ display: 'flex', marginTop: 37 }}>
            <Checkbox checked={isContactOnSite} onChange={() => setIsContactOnSite(!isContactOnSite)} variantName="classic" size={18} />
            <div style={{ marginLeft: 15 }}>
              <Typography variantName="overline" textColor="#000000">
                {t('editOrder.contactOnSite').toUpperCase()}
              </Typography>
              <Typography variantName="caption">{t('editOrder.contactOnSiteCaption')}</Typography>
            </div>
          </div>
        )}
        <Formik
          enableReinitialize={true}
          initialValues={{
            address: initialFullAddress || null,
          }}
          validationSchema={ValidationSchema}
          onSubmit={async (values, actions) => {
            try {
              await updateShooting(order.company.organization.id, order.orderId, values);
              actions.setSubmitting(false);
              mutate(`${ApiPath.Order}/${order.orderCode}`, { data: { ...order, address: values.address?.formattedAddress! } }, false);
              onSetEditMode(false);
            } catch (err) {
              // TODO
            }
          }}
        >
          {(props) => {
            return (
              <Form
                style={{
                  flexGrow: 1,
                  display: isMobileOrTablet ? 'flex' : 'initial',
                  flexDirection: isMobileOrTablet ? 'column' : 'unset',
                }}
              >
                <Typography variantName="title3" style={{ marginBottom: isMobileOrTablet ? 4 : 11, marginTop: 27 }}>
                  {t('form.business')}
                </Typography>
                <RowWrapper style={{ marginBottom: !isMobileOrTablet ? 153 : 0 }}>
                  <OneHalfWrapper style={{ marginRight: isMobileOrTablet ? 0 : 120 }}>
                    {isUnscheduled ? (
                      <Field name="address">
                        {({ field, meta }) => {
                          const addressObject = field.value as AddressDto;
                          const dropdownValue = addressObject
                            ? { label: addressObject.formattedAddress, value: addressObject.formattedAddress }
                            : null;

                          return (
                            <AsyncDropdown
                              placeholder={t('form.shortAddress')}
                              label={t('form.shortAddress').toUpperCase()}
                              {...field}
                              id={field.name}
                              value={dropdownValue}
                              fetcher={onFetchGooglePlacesOptions}
                              noOptionsMessage={t('form.noOptions')}
                              onChange={async (option: any) => {
                                if (option) {
                                  const address = await fetchGoogleAddressDetails(option.label);
                                  props.setFieldValue('address', address);
                                } else {
                                  props.setFieldValue('address', null);
                                }
                                props.setFieldTouched('address', true);
                              }}
                              onBlur={() => props.setFieldTouched('address', true)}
                              error={meta.touched ? meta.error : null}
                              isClearable
                              required
                              styles={addressAutocompleteStyle}
                            />
                          );
                        }}
                      </Field>
                    ) : (
                      <>
                        <Typography variantName="overline">{t('form.shortAddress').toUpperCase()}</Typography>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: 13 }} data-testid="addressTypography">
                          <Icon name="place" color="#A3ABB1" size={18} style={{ marginLeft: 5, marginRight: 7 }} />
                          <Typography variantName="kpi1">{address}</Typography>
                        </div>
                      </>
                    )}
                  </OneHalfWrapper>
                </RowWrapper>
                {renderNavigationButtons(props.isValid)}
              </Form>
            );
          }}
        </Formik>
      </Wrapper>
    </div>
  );
};
