import React from 'react';

import { CheckboxContainer, HiddenCheckbox, StyledCheckbox } from './styles';
import { variants } from './variants';
import { Icon } from '../Icon';
import { Typography } from '../Typography';

const defaultSize = 20;

export interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  variantName?: keyof typeof variants;
  size?: number;
  iconName?: string;
  label?: string;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  variantName = 'classic',
  size = defaultSize,
  iconName = 'check',
  label,
  disabled = false,
  ...props
}) => {
  const variant = variants[disabled ? 'disabled' : variantName];
  const { borderColor, fillColor, borderColorChecked } = variant;

  return (
    <label style={{ display: 'flex', alignItems: 'center' }}>
      <CheckboxContainer size={size} disabled={disabled}>
        <HiddenCheckbox checked={checked} {...props} />
        <StyledCheckbox
          checked={checked}
          borderColor={borderColor}
          fillColor={fillColor}
          borderColorChecked={borderColorChecked}
          size={size}
        >
          {'iconColor' in variant && 'iconColorChecked' in variant && (
            <Icon
              name={iconName}
              size={size}
              color={checked ? variant.iconColorChecked : variant.iconColor}
              style={{ visibility: checked ? 'visible' : 'hidden', position: 'absolute' }}
            />
          )}
        </StyledCheckbox>
      </CheckboxContainer>
      {label && (
        <Typography variantName={checked ? 'body1' : 'body2'} style={{ paddingLeft: 16, cursor: disabled ? 'not-allowed' : 'pointer' }}>
          {label}
        </Typography>
      )}
    </label>
  );
};

export { Checkbox };
