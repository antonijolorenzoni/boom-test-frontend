import React from 'react';

import { Icon } from '../Icon';
import { ChipContainer } from './styles';

interface Props {
  name?: string;
  iconName?: string;
  colorBg?: string;
  colorText?: string;
}
const Chip = ({ name, iconName, colorBg, colorText }: Props) => {
  const colorTextLabel = colorText || '#FFFFFF';
  const colorBgChip = colorBg || '#cc0033';
  const iconReferenceName = iconName || 'camera_alt';
  return (
    <ChipContainer colorTextLabel={colorTextLabel} colorBgChip={colorBgChip}>
      <div style={{ marginRight: 3, display: 'flex' }}>
        <Icon name={iconReferenceName} color={colorTextLabel} size={15} />
      </div>
      <span style={{ fontSize: 12 }}>{name}</span>
    </ChipContainer>
  );
};

export { Chip };
