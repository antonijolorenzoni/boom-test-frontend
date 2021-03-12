import { EXTERNAL_EDITING_VALUE, SHOOTINGS_STATUSES } from 'config/consts';
import constsWithTranslations from 'config/constsWithTranslations';
import { Field } from 'formik';
import React, { createRef, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RadioButton, RadioButtonGroup, Tooltip, Typography } from 'ui-boom-components/lib';

const statusesEditingBlocked = [
  SHOOTINGS_STATUSES.CANCELED,
  SHOOTINGS_STATUSES.DONE,
  SHOOTINGS_STATUSES.DOWNLOADED,
  SHOOTINGS_STATUSES.RESHOOT,
];

export const EditingField = ({ disabled, orderStatus }) => {
  const RadioButtonEditingExternalRef = createRef(null);

  const [tooltipExternalHovered, setTooltipExternalHovered] = useState(false);

  const { t } = useTranslation();

  const getRadioButtonReference = (value) => {
    if (value === EXTERNAL_EDITING_VALUE) {
      return RadioButtonEditingExternalRef;
    }
  };

  const getMouseEnterMethod = (value) => {
    if (value === EXTERNAL_EDITING_VALUE) {
      setTooltipExternalHovered(true);
    }
  };

  const getMouseLeaveMethod = (value) => {
    if (value === EXTERNAL_EDITING_VALUE) {
      setTooltipExternalHovered(false);
    }
  };

  const isEditingBlocked = useMemo(() => statusesEditingBlocked.some((status) => status === orderStatus), [orderStatus]);

  return (
    <>
      {!isEditingBlocked && (
        <Typography variantName="caption" style={{ marginBottom: 10 }}>
          {disabled ? t('forms.editingCantChange') : t('forms.editingChangeOnce')}
        </Typography>
      )}
      <Field name="editingOption">
        {({ field: { value }, form: { setFieldValue } }) => (
          <div>
            {!isEditingBlocked && (
              <Tooltip
                isVisible={tooltipExternalHovered && disabled}
                message={t('forms.editingCantChange')}
                placement="bottom-start"
                targetRef={RadioButtonEditingExternalRef}
                isArrowVisible={false}
              />
            )}
            <RadioButtonGroup
              name="editingOption"
              onClick={(value) => setFieldValue('editingOption', value)}
              selectedValue={value}
              color="#5AC0B1"
            >
              {constsWithTranslations.optionsRadioGroupEditing.map(({ value, labelText }) => (
                <RadioButton
                  key={value}
                  value={value}
                  labelText={labelText}
                  disabled={disabled}
                  reference={getRadioButtonReference(value)}
                  onMouseEnter={() => getMouseEnterMethod(value)}
                  onMouseLeave={() => getMouseLeaveMethod(value)}
                />
              ))}
            </RadioButtonGroup>
          </div>
        )}
      </Field>
    </>
  );
};
