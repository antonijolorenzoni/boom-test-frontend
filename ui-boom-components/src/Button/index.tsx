import React from 'react';
import { Spinner } from '../Spinner';
import { DefaultStyledButton, OutlinedStyledButton } from './styles';

export interface ButtonProps {
  textColor?: string;
  backgroundColor?: string;
  size?: 'small' | 'medium';
  loading?: boolean;
  spinnerColor?: string;
}

export interface OutlinedButtonProps {
  color?: string;
  backgroundColor?: string;
  size?: 'small' | 'medium';
  loading?: boolean;
  spinnerColor?: string;
}

const Button: React.FC<ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  loading,
  size,
  disabled,
  spinnerColor,
  children,
  ...rest
}) => (
  <DefaultStyledButton {...rest} size={size} disabled={loading || disabled}>
    {loading ? (
      <>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            position: 'absolute',
          }}
        >
          <Spinner size={size === 'small' ? 'xxsmall' : 'xsmall'} borderColor={spinnerColor || '#ffffff'} />
        </div>
        <span style={{ opacity: 0 }}>{children}</span>
      </>
    ) : (
      children
    )}
  </DefaultStyledButton>
);

const OutlinedButton: React.FC<OutlinedButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  loading,
  size,
  disabled,
  spinnerColor,
  children,
  ...rest
}) => (
  <OutlinedStyledButton {...rest} size={size} disabled={loading || disabled}>
    {loading ? (
      <>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            position: 'absolute',
          }}
        >
          <Spinner size={size === 'small' ? 'xxsmall' : 'xsmall'} borderColor={spinnerColor || '#5AC0B1'} />
        </div>
        <span style={{ opacity: 0 }}>{children}</span>
      </>
    ) : (
      children
    )}
  </OutlinedStyledButton>
);

export { Button, OutlinedButton };
