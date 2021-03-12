import React from 'react';

import { Checkbox, CheckboxLabel, Span } from './styles';

// these props are useless but without it storybook does not work
export interface SwitchProps {
  id: string;
  checked?: boolean;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps & React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return (
    <>
      <Checkbox {...props} type="checkbox" checked={props.checked} disabled={props.disabled} />
      <CheckboxLabel htmlFor={props.id}>
        <Span />
      </CheckboxLabel>
    </>
  );
};
