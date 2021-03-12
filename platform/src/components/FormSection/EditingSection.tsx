import React, { useState, createRef } from 'react';
import { useFormikContext } from 'formik';
import { InferType, object, string } from 'yup';
import { useTranslation } from 'react-i18next';
import { Typography, Tooltip, RadioButton, RadioButtonGroup } from 'ui-boom-components';
import { EXTERNAL_EDITING_VALUE, INTERNAL_EDITING_VALUE } from 'config/consts';
import constsWithTranslations from 'config/constsWithTranslations';
import { getTypedField } from 'components/TypedFields';

interface Props {
  isPricingPackageSelected: boolean;
  canChangeEditingOption: boolean;
}

export const EditingValidationSchema = object({
  editingOption: string().trim().nullable(),
}).required();

type FormFields = InferType<typeof EditingValidationSchema>;
const Field = getTypedField<FormFields>();

export const EditingSection: React.FC<Props> = ({ isPricingPackageSelected, canChangeEditingOption }) => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<FormFields>();

  const RadioButtonEditingExternalRef = createRef<HTMLLabelElement>();
  const RadioButtonEditingInternalRef = createRef<HTMLLabelElement>();

  const [tooltipExternalHovered, setTooltipExternalHovered] = useState(false);
  const [tooltipInternalHovered, setTooltipInternalHovered] = useState(false);

  const getRadioButtonReference = (value: string): React.RefObject<HTMLLabelElement> | null => {
    if (value === INTERNAL_EDITING_VALUE) {
      return RadioButtonEditingInternalRef;
    }
    if (value === EXTERNAL_EDITING_VALUE) {
      return RadioButtonEditingExternalRef;
    }
    return null;
  };

  const getMouseEnterMethod = (value: string) => {
    if (value === INTERNAL_EDITING_VALUE) {
      setTooltipInternalHovered(true);
      setTooltipExternalHovered(false);
    }
    if (value === EXTERNAL_EDITING_VALUE) {
      setTooltipExternalHovered(true);
      setTooltipInternalHovered(false);
    }
  };

  const getMouseLeaveMethod = (value: string) => {
    if (value === INTERNAL_EDITING_VALUE) {
      setTooltipInternalHovered(false);
    }
    if (value === EXTERNAL_EDITING_VALUE) {
      setTooltipExternalHovered(false);
    }
  };

  return (
    <>
      <Typography variantName="caption" style={{ marginBottom: 10 }}>
        {canChangeEditingOption || canChangeEditingOption === null ? t('forms.editingChangeOnce') : t('forms.editingCantChange')}
      </Typography>
      <Field name="editingOption">
        {() => (
          <>
            <Tooltip
              isVisible={tooltipInternalHovered && (!isPricingPackageSelected || !canChangeEditingOption)}
              message={isPricingPackageSelected ? t('forms.editingCantChange') : t('forms.needCheckPrincingPackage')}
              placement="bottom-start"
              targetRef={RadioButtonEditingInternalRef}
              isArrowVisible={false}
            />
            <Tooltip
              isVisible={tooltipExternalHovered && (!isPricingPackageSelected || !canChangeEditingOption)}
              message={isPricingPackageSelected ? t('forms.editingCantChange') : t('forms.needCheckPrincingPackage')}
              placement="bottom-start"
              targetRef={RadioButtonEditingExternalRef}
              isArrowVisible={false}
            />
            <RadioButtonGroup
              name="editingOption"
              onClick={(selectedValue?: string | null) => setFieldValue('editingOption', selectedValue)}
              selectedValue={values.editingOption}
              color="#5AC0B1"
            >
              {constsWithTranslations.optionsRadioGroupEditing.map(({ value, labelText }: { value: string; labelText: string }) => (
                <RadioButton
                  key={`editing-option-${value}`}
                  value={value}
                  labelText={labelText}
                  disabled={!canChangeEditingOption}
                  reference={getRadioButtonReference(value)}
                  onMouseEnter={() => getMouseEnterMethod(value)}
                  onMouseLeave={() => getMouseLeaveMethod(value)}
                />
              ))}
            </RadioButtonGroup>
          </>
        )}
      </Field>
    </>
  );
};
