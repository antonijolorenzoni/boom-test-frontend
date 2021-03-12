import React, { useMemo, useRef } from 'react';
import { AsyncDropdown, Dropdown, TextField } from 'ui-boom-components';
import { v4 } from 'uuid';
import { useTranslation } from 'react-i18next';
import i18Countries from 'i18n-iso-countries';
import { useFormikContext } from 'formik';
import { OptionTypeBase } from 'react-select';

import { FormSectionHeader } from 'components/FormSectionHeader';
import { getTypedField } from 'components/TypedFields';
import { FormErrorKey, LANGUAGE_LOCAL_MAP, NOT_AVAILABLE } from 'config/consts';
import { fetchGoogleAddressDetails, onFetchGooglePlacesOptions } from 'api/instances/googlePlacesInstance';
import { COUNTRIES } from 'utils/countries';
import { BillingInfoDto } from 'types/SubscriptionResponse';
import { InferType, object, string, StringSchema } from 'yup';
import { useWhoAmI } from 'hook/useWhoAmI';
import { vatRateOption } from 'utils/vat';

export const BillingInfoValidationSchema = (isBoom: boolean) =>
  object({
    corporateName: string().trim().required(FormErrorKey.REQUIRED),
    vatNumber: string().trim().required(FormErrorKey.REQUIRED),
    vatRate: isBoom ? string().required(FormErrorKey.REQUIRED) : string().nullable(),
    country: string().nullable().required(FormErrorKey.REQUIRED),
    address: string().nullable().required(FormErrorKey.REQUIRED),
    city: string().trim().required(FormErrorKey.REQUIRED),
    zipCode: string().trim().required(FormErrorKey.REQUIRED),
    sdiCode: string()
      .trim()
      .when('country', (country: string, schema: StringSchema) =>
        country === LANGUAGE_LOCAL_MAP.ITALIAN.key ? schema.required(FormErrorKey.REQUIRED) : schema.nullable()
      ),
  }).required();

type FormFields = InferType<typeof BillingInfoValidationSchema>;
const Field = getTypedField<FormFields>();

export const BillingInfoSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const googleSessionToken = useRef(v4());
  const { setFieldTouched, setFieldValue, values } = useFormikContext<BillingInfoDto>();
  const { isBoom } = useWhoAmI();

  const allCountriesOptions = useMemo(
    () =>
      COUNTRIES.map((item) => ({
        label: i18Countries.getName(item.code, i18n.language),
        value: item.code,
      })),
    [i18n.language]
  );

  return (
    <div>
      <FormSectionHeader iconName="location_on" label={t('smb.billingInfo')} />
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 0.5, marginRight: 40 }}>
          <Field name="corporateName">
            {({ field, meta }) => (
              <div style={{ flex: 0.5 }}>
                <TextField label={t('smb.corporateName')} {...field} error={meta.touched ? t(meta.error!) : undefined} required />
              </div>
            )}
          </Field>
        </div>
        <div style={{ flex: 0.5, display: 'flex' }}>
          <Field name="vatNumber">
            {({ field, meta }) => (
              <div style={{ flex: isBoom ? 0.5 : 1, marginRight: 20 }}>
                <TextField label={t('smb.vatNumber')} {...field} error={meta.touched ? t(meta.error!) : undefined} required />
              </div>
            )}
          </Field>
          {isBoom && (
            <Field name="vatRate">
              {({ field, meta }) => (
                <div style={{ flex: 0.5 }}>
                  <Dropdown
                    id={field.name}
                    label={t('profile.vatRate')}
                    value={field.value !== null && field.value !== '' ? { label: field.value, value: field.value } : null}
                    options={vatRateOption}
                    onChange={(selected) =>
                      setFieldValue('vatRate', selected && selected.value !== null && selected.value !== '' ? selected.value : null)
                    }
                    onBlur={() => setFieldTouched('vatRate', true)}
                    error={meta.touched ? t(meta.error!) : undefined}
                    placeholder={t(`smb.selectVatRates`)}
                    required
                  />
                </div>
              )}
            </Field>
          )}
        </div>
      </div>
      <div style={{ display: 'flex' }}>
        <Field name="country">
          {({ field, meta }) => (
            <div style={{ flex: 0.5, marginRight: 40 }}>
              <Dropdown
                id={field.name}
                label={t('smb.country')}
                value={
                  field.value
                    ? {
                        label: allCountriesOptions.find((o) => o.value === field.value)?.label || NOT_AVAILABLE,
                        value: field.value,
                      }
                    : null
                }
                options={allCountriesOptions}
                filterOptions={(option: OptionTypeBase, input: string) => option.label.toLowerCase().includes(input)}
                onChange={(selected) => {
                  if (selected) {
                    setFieldValue('country', selected.value);
                  } else {
                    setFieldValue('country', null);
                    setFieldValue('address', null);
                    setFieldValue('city', '');
                    setFieldValue('zipCode', '');
                    setFieldValue('sdiCode', '');
                  }
                  setFieldTouched('country', true);
                }}
                onBlur={() => setFieldTouched('country', true)}
                error={meta.touched ? t(meta.error!) : undefined}
                isSearchable
                isClearable
                required
              />
            </div>
          )}
        </Field>
      </div>
      <div style={{ display: 'flex' }}>
        <Field name="address">
          {({ field, meta }) => (
            <div style={{ flex: 0.5, marginRight: 40 }}>
              <AsyncDropdown
                label={t('smb.address')}
                {...field}
                id={field.name}
                value={field.value}
                fetcher={(input: string) => onFetchGooglePlacesOptions(input, googleSessionToken.current, values.country)}
                onChange={async (option: OptionTypeBase) => {
                  const addressDetails = option ? await fetchGoogleAddressDetails(option, googleSessionToken.current) : null;

                  if (addressDetails) {
                    const street = addressDetails.street ?? '';
                    const streetNumber = addressDetails.street_number ?? '';

                    setFieldValue('address', { value: addressDetails, label: `${street} ${streetNumber}`.trim() });
                    setFieldValue('city', addressDetails.city);
                    setFieldValue('zipCode', addressDetails.postalCode);
                  } else {
                    setFieldValue('address', null);
                    setFieldValue('city', '');
                    setFieldValue('zipCode', '');
                  }

                  setFieldTouched('address', true);
                }}
                onBlur={() => setFieldTouched('address', true)}
                error={meta.touched ? t(meta.error!) : undefined}
                disabled={!values.country}
                isClearable
                required
              />
            </div>
          )}
        </Field>
        <div style={{ display: 'flex', flex: 0.5 }}>
          <Field name="city">
            {({ field, meta }) => (
              <div style={{ flex: 0.5, marginRight: 20 }}>
                <TextField
                  label={t('smb.city')}
                  {...field}
                  error={meta.touched ? t(meta.error!) : undefined}
                  required
                  disabled={!values.country}
                />
              </div>
            )}
          </Field>
          <Field name="zipCode">
            {({ field, meta }) => (
              <div style={{ flex: 0.5 }}>
                <TextField
                  label={t('smb.zipCode')}
                  {...field}
                  error={meta.touched ? t(meta.error!) : undefined}
                  required
                  disabled={!values.country}
                />
              </div>
            )}
          </Field>
        </div>
      </div>
      <div style={{ display: 'flex' }}>
        <Field name="sdiCode">
          {({ field, meta }) => (
            <div style={{ flex: 0.5, marginRight: 40 }}>
              <TextField
                label={t('smb.sdiCodePecEmail')}
                {...field}
                error={meta.touched ? t(meta.error!) : undefined}
                required={values.country === LANGUAGE_LOCAL_MAP.ITALIAN.key}
                disabled={values.country !== LANGUAGE_LOCAL_MAP.ITALIAN.key}
              />
            </div>
          )}
        </Field>
      </div>
    </div>
  );
};
