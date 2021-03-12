import React from 'react';
import { Icon, Typography } from 'ui-boom-components';

interface Props {
  iconName: string;
  label: string;
}

export const FormSectionHeader: React.FC<Props> = ({ iconName, label }) => (
  <div style={{ display: 'flex', margin: '8px 0 8px 0' }}>
    <Icon name={iconName} size={16} style={{ marginRight: 10 }} />
    <Typography variantName="title3" textColor="#000000">
      {label}
    </Typography>
  </div>
);
