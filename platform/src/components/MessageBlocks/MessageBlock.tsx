import React from 'react';
import { Typography, Icon } from 'ui-boom-components/lib';
import { BoxShadow } from './style';

interface Props {
  icon: string;
  color: string;
  background: string;
  title: string;
  subtitle?: string;
}

export const MessageBlock: React.FC<Props> = ({ icon, color, background, title, subtitle }) => (
  <BoxShadow background={background}>
    <Icon name={icon} color={color} size={16} style={{ marginRight: 10 }} />
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Typography variantName="body1" textColor={color}>
        {title}
      </Typography>
      {subtitle && <Typography variantName="caption">{subtitle}</Typography>}
    </div>
  </BoxShadow>
);
