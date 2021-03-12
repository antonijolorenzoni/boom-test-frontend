import React from 'react';

import { Wrapper, InputText } from './styles';
import { Typography } from '../Typography';
import { Label } from '../Label';

export interface TextFieldProps {
  label: string;
  additionalLabel?: JSX.Element;
  showError?: boolean;
  error?: string;
}

const TextField: React.FC<TextFieldProps & React.InputHTMLAttributes<HTMLInputElement>> = ({
  label,
  error,
  showError = true,
  additionalLabel,
  ...inputProps
}) => {
  const { name } = inputProps;

  return (
    <Wrapper>
      <InputText id={name} {...inputProps} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Label htmlFor={name}>{label}</Label>
        {additionalLabel}
      </div>
      {showError && (
        <Typography
          variantName="error"
          style={{
            visibility: error ? 'visible' : 'hidden',
            order: 3,
            minHeight: 18,
            marginTop: 2,
          }}
        >
          {error}
        </Typography>
      )}
    </Wrapper>
  );
};

export { TextField };
