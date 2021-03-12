import React from 'react';
import { string, object, InferType } from 'yup';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { FormSectionHeader } from 'components/FormSectionHeader';
import { Typography, TextField, AsyncDropdown, Icon } from 'ui-boom-components';
import { Api } from './Api';
import { Option } from 'types/Option';
import { requiredMessageKey } from 'utils/validations';
import { getTypedField } from 'components/TypedFields';

interface Props {
  api: Api;
  businessNameLabelKey?: string;
}

export const LocationAndBusinessNameValidationSchema = object({
  fullAddress: object<Option, Option>().nullable().required(requiredMessageKey),
  place: object().nullable().shape({
    timezone: string(),
  }),
  businessName: string().trim(),
}).required();

type FormFields = InferType<typeof LocationAndBusinessNameValidationSchema>;
const Field = getTypedField<FormFields>();

export const LocationAndBusinessNameSection: React.FC<Props> = ({ api, businessNameLabelKey = 'forms.businessName' }) => {
  const { values, setFieldValue, setFieldTouched } = useFormikContext<FormFields>();
  const { t } = useTranslation();

  return (
    <>
      <FormSectionHeader iconName="location_on" label={t('forms.address')} />
      <Field name="fullAddress">
        {({ field, meta }) => (
          <AsyncDropdown
            label={t('forms.fullAddress')}
            {...field}
            id={field.name}
            value={field.value}
            fetcher={api.onFetchGooglePlacesOptions}
            onChange={(option: any) => {
              setFieldValue('fullAddress', option);
              api.fetchGoogleAddressDetails(option).then((addressDetails: any) => setFieldValue('place', addressDetails));
            }}
            onBlur={() => setFieldTouched('fullAddress', true)}
            error={meta.touched ? t(meta.error!) : undefined}
            isClearable
            required
          />
        )}
      </Field>
      <Typography
        variantName="caption"
        style={{ visibility: values.place?.timezone ? 'visible' : 'hidden', marginBottom: 8, display: 'flex' }}
      >
        <Icon name="language" size={16} style={{ marginRight: 13 }} />
        {`${t('forms.orderTimezoneIs')}: ${values.place?.timezone}`}
      </Typography>
      <Field name="businessName">
        {({ field, meta }) => (
          <TextField
            label={t(businessNameLabelKey)}
            {...field}
            id={field.name}
            value={field.value}
            error={meta.touched ? t(meta.error!) : undefined}
          />
        )}
      </Field>
    </>
  );
};
