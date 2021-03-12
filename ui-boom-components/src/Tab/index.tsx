import React from 'react';

import { Typography } from '../Typography';
import { Icon } from '../Icon';

import { TabElement, ContentLabel } from './styles';

export interface TabProps {
  activeTab?: string;
  name: string;
  label: string;
  onClick?: (name: string) => void;
  iconName?: string;
  counter?: number;
  color?: string;
}

const bendedCorner = (
  <svg width="46" height="38" viewBox="0 0 46 38" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18.0012 10.9116L27.0266 26.8534C30.5767 33.1239 37.2253 37 44.431 37H1V1C8.03876 1 14.5334 4.78632 18.0012 10.9116Z"
      fill="white"
    />
    <path
      d="M46 37H44.431C37.2253 37 30.5767 33.1239 27.0266 26.8534L18.0012 10.9116C14.5334 4.78632 8.03877 1 1 1V37H46Z"
      stroke="white"
    />
  </svg>
);

const Tab: React.FC<TabProps> = ({ activeTab, name, label, onClick, iconName, counter, color }) => {
  const isActive = activeTab === name;

  return (
    <TabElement isActive={isActive} onClick={() => !isActive && onClick && onClick(name)}>
      <ContentLabel>
        <div style={{ position: 'absolute', right: -28, top: 0 }}>{bendedCorner}</div>
        {iconName && (
          <div>
            <Icon name={iconName} size={15} color={color} style={{ margin: '0 12px', position: 'relative', top: 2 }} />
          </div>
        )}
        <Typography variantName="overline" textColor={color} style={{ marginRight: 12 }}>
          {label}
        </Typography>
        {typeof counter !== 'undefined' && (
          <Typography
            variantName="overline"
            textColor={'white'}
            style={{
              position: 'absolute',
              right: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1px 5px',
              minWidth: 10,
              backgroundColor: color,
              borderRadius: 10,
            }}
          >
            {counter}
          </Typography>
        )}
      </ContentLabel>
    </TabElement>
  );
};

export { Tab };
