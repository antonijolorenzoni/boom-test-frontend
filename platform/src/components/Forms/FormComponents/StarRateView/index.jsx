import _ from 'lodash';
import React from 'react';
import { IconButton } from 'ui-boom-components';
import { StarRateViewWrapper, StarIcon, Title } from './styles';

const StarRateView = ({ value, totalValues, minimumValue, title, onSelectValue, color, disabled }) => (
  <StarRateViewWrapper>
    {title && <Title disabled={disabled}>{title}</Title>}
    <div style={{ display: 'flex' }}>
      {_.times(totalValues, (currentValue) => {
        const isSelected = currentValue + 1 <= value || currentValue + 1 === minimumValue;
        return (
          <IconButton
            key={currentValue}
            onClick={onSelectValue && !disabled ? () => onSelectValue(currentValue + 1) : null}
            disabled={disabled}
          >
            <StarIcon isSelected={isSelected} color={color} size={15} disabled={disabled} />
          </IconButton>
        );
      })}
    </div>
  </StarRateViewWrapper>
);

export default StarRateView;
