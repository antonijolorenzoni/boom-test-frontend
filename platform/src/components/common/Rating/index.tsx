import React from 'react';
import styled from 'styled-components';
import { Icon } from 'ui-boom-components/lib';

interface Props {
  value?: number;
  max?: number;
  isValuating?: boolean;
  color?: string;
  onChange?: (index: number) => void;
}

const RatingIcon = styled(Icon)<{ load: number }>`
  background: linear-gradient(to right, #ffa501 ${({ load }) => load}%, #a3abb1 ${({ load }) => load}% ${({ load }) => 100 - load}%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const Rating: React.FC<Props> = ({ value = 0, max = 5, isValuating = false, color, onChange }) => {
  const getIconNameEvaluating = (index: Number): string => (index < value ? 'star' : 'star_outline');

  const getLoadPercentage = (index: number): number => {
    const valueTrunched = Math.trunc(value);

    if (valueTrunched < index) {
      return 0;
    } else if (valueTrunched > index) {
      return 100;
    }
    return (value % 1) * 100;
  };

  return (
    <div style={{ display: 'flex' }}>
      {isValuating
        ? [...Array(max)].map((_, index) => (
            <Icon
              key={index}
              color={color}
              name={getIconNameEvaluating(index)}
              size={14}
              style={{ cursor: 'pointer' }}
              onClick={() => onChange && onChange(index + 1)}
            />
          ))
        : [...Array(max)].map((_, index) => <RatingIcon key={index} name={'star'} size={14} load={getLoadPercentage(index)} />)}
    </div>
  );
};
