import React from 'react';
import { object, InferType } from 'yup';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { PricingPackage } from 'types/PricingPackage';
import { Chip, Dropdown } from 'ui-boom-components/lib';
import { FieldWrapper, RowWrapper } from '../styles';
import { NewOrderForSubscribersFields } from './NewOrderFormForSubscribers';
import { packageToOption as pricingPackageToOption } from 'utils/pricing-package-utils';
import { requiredMessageKey } from 'utils/validations';
import { getTypedField } from 'components/TypedFields';

interface Props {
  pricingPackages: Array<PricingPackage>;
  disabled?: boolean;
  onSelectPP?: (pricingPackage: PricingPackage) => void;
}

export const PackageValidationSchema = object({
  pricingPackage: object<PricingPackage, PricingPackage>().nullable().required(requiredMessageKey),
}).required();

type FormFields = InferType<typeof PackageValidationSchema>;
const Field = getTypedField<FormFields>();

export const PackageRow: React.FC<Props> = ({ pricingPackages, disabled = false, onSelectPP }) => {
  const { values, setFieldValue, setFieldTouched } = useFormikContext<NewOrderForSubscribersFields>();
  const { t } = useTranslation();
  const packageToOption = pricingPackageToOption(t('organization.photos'));

  return (
    <RowWrapper>
      <FieldWrapper>
        <Field name="pricingPackage">
          {({ field, meta }) => (
            <Dropdown
              label={t('forms.newOrder.pricingPackage')}
              id={field.name}
              value={packageToOption(field.value)}
              options={pricingPackages.map(packageToOption)}
              filterOptions={(option: any, input: any) => option.label.toLowerCase().includes(input)}
              onChange={(option: any) => {
                const selectedPricingPackage = pricingPackages.find((p: any) => p.id === option?.value);
                setFieldValue('pricingPackage', selectedPricingPackage);
                setFieldValue('editingOption', selectedPricingPackage?.editingOption);
                if (selectedPricingPackage && onSelectPP) {
                  onSelectPP(selectedPricingPackage);
                }
              }}
              onBlur={() => setFieldTouched('pricingPackage', true)}
              isSearchable
              error={meta.touched ? t(meta.error!) : undefined}
              required
              isDisabled={disabled}
            />
          )}
        </Field>
      </FieldWrapper>
      <FieldWrapper>
        {values.pricingPackage?.photoType.type && (
          <div style={{ marginTop: 25 }}>
            <Chip name={t(`photoTypes.${values.pricingPackage?.photoType.type}`)} colorBg="#cc0033" iconName={'camera_alt'} />
          </div>
        )}
      </FieldWrapper>
    </RowWrapper>
  );
};
