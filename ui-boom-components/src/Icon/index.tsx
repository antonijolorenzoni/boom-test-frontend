import React from 'react';
import { StyledIcon } from './styles';

export type IconProps = {
  name?: string;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
  className?: string;
  outlined?: boolean;
} & React.BaseHTMLAttributes<HTMLDivElement>;

const Icon: React.FC<IconProps> = ({ name, color, size, style, className, outlined, ...rest }) => (
  <StyledIcon
    className={`${className || ''} ${outlined ? 'material-icons-outlined' : 'material-icons'}`}
    aria-hidden="true"
    role="presentation"
    color={color}
    size={size}
    style={style}
    {...rest}
  >
    {name}
  </StyledIcon>
);

export { Icon };
