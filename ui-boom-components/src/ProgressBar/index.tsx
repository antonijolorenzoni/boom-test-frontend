import * as React from 'react';
import { Wrapper, Circle } from './styles';
import { Typography } from '../Typography';

type ColorsProgressBar = {
  activeColor: string;
  inactiveColor: string;
  labelColor?: string;
  lineColor?: string;
  borderColor?: string;
};

const ProgressBar: React.FC<{
  steps: string[];
  currentIndex: number;
  colorSettings: ColorsProgressBar;
  style?: React.CSSProperties;
}> = ({ steps, currentIndex, colorSettings, style }) => {
  const { activeColor, inactiveColor, labelColor, lineColor, borderColor } = colorSettings;
  return (
    <Wrapper style={style}>
      {steps.map((step, index) => {
        const isActive: boolean = Number(index) <= currentIndex;
        const isCurrent: boolean = index === currentIndex;
        return (
          <Circle
            key={index}
            isActive={isActive}
            activeColor={activeColor}
            inactiveColor={inactiveColor}
            lineColor={isActive ? activeColor : lineColor || activeColor}
            borderColor={borderColor || activeColor}
            isCurrent={isCurrent}
          >
            <Typography
              variantName="title3"
              textColor={isActive ? activeColor : labelColor || activeColor}
              style={{ textTransform: 'capitalize', textAlign: 'center' }}
            >
              {step}
            </Typography>
          </Circle>
        );
      })}
    </Wrapper>
  );
};

export { ProgressBar };
