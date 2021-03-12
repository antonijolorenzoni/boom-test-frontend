import React from 'react';

import { RadioContainer, InputRadio, LabelRadio } from './styles';
import { Typography } from '../Typography';

interface Props {
  labelText: string;
  reference?: React.RefObject<HTMLLabelElement> | null;
}

const RadioButton = ({
  onChange,
  value,
  labelText,
  checked,
  name,
  color,
  disabled,
  reference,
  onMouseEnter,
  onMouseLeave,
  style,
}: Props & React.InputHTMLAttributes<Element>) => (
  // TODO is better to use ref on external div
  <LabelRadio disabled={disabled} ref={reference} style={style}>
    <RadioContainer onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <InputRadio
        type="radio"
        onChange={onChange}
        name={name}
        value={value}
        checked={checked}
        aria-checked={checked}
        color={color}
        disabled={disabled}
      />
      <Typography variantName="caption" textColor={disabled ? '#A3ABB1' : '#000000'} style={{ marginLeft: 15, marginRight: 26 }}>
        {labelText}
      </Typography>
    </RadioContainer>
  </LabelRadio>
);

export { RadioButton };
