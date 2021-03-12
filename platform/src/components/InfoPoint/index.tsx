import React from 'react';
import { Icon } from 'ui-boom-components';

interface Props {
  style?: React.CSSProperties;
  size?: number;
  iconColor?: string;
  onClick: () => void;
}

export const InfoPoint: React.FC<Props> = ({ style, size = 18, iconColor = 'darkGrey', onClick }) => (
  <div style={style}>
    <Icon name="info" onClick={onClick} color={iconColor} size={size} style={{ cursor: 'pointer' }} />
  </div>
);
