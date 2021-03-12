import constsWithTranslations from 'config/constsWithTranslations';
import React, { createRef, useEffect, useState } from 'react';
import { Typography, Tooltip, RadioButton, RadioButtonGroup } from 'ui-boom-components';
import { change, Field } from 'redux-form';
import { useDispatch } from 'react-redux';
import { EXTERNAL_EDITING_VALUE, INTERNAL_EDITING_VALUE } from 'config/consts';
import { useTranslation } from 'react-i18next';

export const EditingPanelOrderCreation = ({ editingOption, canChangeEditingOption }) => {
  const RadioButtonEditingExternalRef = createRef(null);
  const RadioButtonEditingInternalRef = createRef(null);

  const [tooltipExternalHovered, setTooltipExternalHovered] = useState(false);
  const [tooltipInternalHovered, setTooltipInternalHovered] = useState(false);

  const dispatch = useDispatch();

  const handleChangeEditing = (editingValue) => {
    dispatch(change('NewShootingForm', 'editingOption', editingValue));
  };

  const { t } = useTranslation();

  const isPricingPackageSelected = Boolean(!editingOption);

  const getRadioButtonReference = (value) => {
    if (value === INTERNAL_EDITING_VALUE) {
      return RadioButtonEditingInternalRef;
    }
    if (value === EXTERNAL_EDITING_VALUE) {
      return RadioButtonEditingExternalRef;
    }
    return null;
  };

  const getMouseEnterMethod = (value) => {
    if (value === INTERNAL_EDITING_VALUE) {
      setTooltipInternalHovered(true);
    }
    if (value === EXTERNAL_EDITING_VALUE) {
      setTooltipExternalHovered(true);
    }
  };

  const getMouseLeaveMethod = (value) => {
    if (value === INTERNAL_EDITING_VALUE) {
      setTooltipInternalHovered(false);
    }
    if (value === EXTERNAL_EDITING_VALUE) {
      setTooltipExternalHovered(false);
    }
  };

  useEffect(() => {
    dispatch(change('NewShootingForm', 'editingOption', editingOption));
  }, [dispatch, editingOption]);

  return (
    <div style={{ background: '#F5F6F7', borderRadius: 3, padding: '10px 14px 14px', marginTop: 10, cursor: 'default' }}>
      <Typography variantName="caption" style={{ marginBottom: 10 }}>
        {canChangeEditingOption || canChangeEditingOption === null ? t('forms.editingChangeOnce') : t('forms.editingCantChange')}
      </Typography>
      <Field
        name="editingOption"
        component={(props) => (
          <>
            <Tooltip
              isVisible={tooltipInternalHovered && isPricingPackageSelected}
              message={t('forms.needCheckPrincingPackage')}
              placement="bottom-start"
              targetRef={RadioButtonEditingInternalRef}
              isArrowVisible={false}
            />
            <Tooltip
              isVisible={tooltipExternalHovered && (isPricingPackageSelected || Boolean(!canChangeEditingOption))}
              message={isPricingPackageSelected ? t('forms.needCheckPrincingPackage') : t('forms.editingCantChange')}
              placement="bottom-start"
              targetRef={RadioButtonEditingExternalRef}
              isArrowVisible={false}
            />
            <RadioButtonGroup name="editingOption" onClick={handleChangeEditing} selectedValue={props.input.value} color="#5AC0B1">
              {constsWithTranslations.optionsRadioGroupEditing.map(({ value, labelText }) => (
                <RadioButton
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
      />
    </div>
  );
};
