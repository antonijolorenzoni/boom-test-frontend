import React from 'react';
import { StyledIconButton } from './styles';

const IconButton: React.FC<{ onClick?: any; style?: React.CSSProperties; type?: 'submit' | 'button'; disabled?: boolean }> = ({
  children,
  onClick,
  style,
  type,
  disabled,
}) => (
  <StyledIconButton onClick={onClick} style={style} type={type || 'button'} disabled={disabled}>
    {children}
  </StyledIconButton>
);

export { IconButton };
