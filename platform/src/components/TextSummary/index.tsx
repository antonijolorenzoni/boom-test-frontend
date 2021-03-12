import React from 'react';
// TODO export styles on migration to ui-boom-components
import { SpacedWrapper, FieldWrapper, FieldInlineWrapper } from '../Forms/styles';
import { Typography } from 'ui-boom-components';

interface Props {
  label: string;
  value: string | number;
  fullWidth?: boolean;
}

export const TextSummary: React.FC<Props> = ({ label, value, fullWidth = false }) =>
  fullWidth ? (
    <FieldInlineWrapper>
      <Typography variantName="overline" style={{ textTransform: 'uppercase' }}>
        {label}
      </Typography>
      <SpacedWrapper>
        <Typography variantName="body2">{value}</Typography>
      </SpacedWrapper>
    </FieldInlineWrapper>
  ) : (
    <FieldWrapper>
      <Typography variantName="overline" style={{ textTransform: 'uppercase' }}>
        {label}
      </Typography>
      <SpacedWrapper>
        <Typography variantName="body2">{value}</Typography>
      </SpacedWrapper>
    </FieldWrapper>
  );
