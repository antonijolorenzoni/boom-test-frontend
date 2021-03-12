import { IconButton } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import _ from 'lodash';
import React from 'react';
import StarHalf from '../../assets/icons/star-half.svg';
import SelectedStar from '../../assets/icons/star-selected.svg';
import UnselectedStar from '../../assets/icons/star-unselected.svg';

const StarRatingView = ({
  value,
  totalValues,
  onShowInfo,
  titleContainerStyle,
  minimumValue,
  title,
  titleStyle,
  starStyle,
  unselectedStarStyle,
  starContainerStyle,
}) => (
  <div style={{ ...starContainerStyle }}>
    <div style={{ display: 'flex', marginBottom: 10, flexDirection: 'row', alignItems: 'center', ...titleContainerStyle }}>
      {title && <h4 style={{ margin: 0, ...titleStyle }}>{title}</h4>}
      {onShowInfo && (
        <IconButton style={{ padding: 5, marginLeft: 10 }} onClick={() => onShowInfo()}>
          <InfoIcon style={{ width: 18 }} />
        </IconButton>
      )}
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {_.times(totalValues, (currentValue) => {
        const normalizedCurrentValue = currentValue + 1;
        const isSelected = value >= normalizedCurrentValue || normalizedCurrentValue === minimumValue;
        const isHalf = value > currentValue && value < normalizedCurrentValue;
        return (
          <div key={currentValue}>
            {isSelected && !isHalf && <img alt="evaluation" src={SelectedStar} style={{ ...starStyle, marginRight: 15 }} />}
            {isHalf && <img alt="evaluation" src={StarHalf} style={{ marginRight: 15, ...starStyle }} />}
            {!isSelected && !isHalf && (
              <img alt="evaluation" src={UnselectedStar} style={{ ...unselectedStarStyle, marginRight: 15, marginBottom: 1 }} />
            )}
          </div>
        );
      })}
    </div>
  </div>
);

export default StarRatingView;
