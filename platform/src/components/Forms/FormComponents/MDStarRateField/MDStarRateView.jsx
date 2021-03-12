import IconButton from '@material-ui/core/IconButton';
import _ from 'lodash';
import React from 'react';
import SelectedStar from '../../../../assets/icons/star-selected.svg';
import UnselectedStar from '../../../../assets/icons/star-unselected.svg';

const MDStarRateView = ({
  value,
  totalValues,
  minimumValue,
  title,
  titleStyle,
  onSelectValue,
  starStyle,
  unselectedStarStyle,
  starContainerStyle,
}) => (
  <div style={{ ...starContainerStyle }}>
    {title && <h4 style={{ margin: 0, marginBottom: 10, ...titleStyle }}>{title}</h4>}
    {_.times(totalValues, (currentValue) => {
      const isSelected = currentValue + 1 <= value || currentValue + 1 === minimumValue;
      return (
        <IconButton key={currentValue} onClick={onSelectValue ? () => onSelectValue(currentValue + 1) : null}>
          {isSelected ? (
            <img alt="evaluation" src={SelectedStar} style={{ ...starStyle }} />
          ) : (
            <img alt="evaluation" src={UnselectedStar} style={{ ...unselectedStarStyle }} />
          )}
        </IconButton>
      );
    })}
  </div>
);

export default MDStarRateView;
