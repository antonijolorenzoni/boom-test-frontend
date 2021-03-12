import React from 'react';

import { TooltipTextWrapper, Text } from './styles';
import { Typography } from '../Typography';
import { Label } from '../Label';

interface Props {
  label: string;
  showError?: boolean;

  error?: string;
  disabled?: boolean;
}

const TooltipText: React.FC<Props> = ({ label, error, showError = true, children, disabled }) => {
  return (
    <TooltipTextWrapper>
      <Text disabled={disabled} data-testid="tooltip-text">
        {children}
      </Text>
      <Label>{label}</Label>
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
    </TooltipTextWrapper>
  );
};

export { TooltipText };
