import React, { useState, useRef } from 'react';
import { usePopper } from 'react-popper';
import { PopperContainer } from './styles';
import { Typography } from '../Typography';
import * as PopperJS from '@popperjs/core';

interface Props {
  targetRef: React.MutableRefObject<Element | PopperJS.VirtualElement | null>;
  isVisible: boolean;
  placement: PopperJS.Placement;
  message: string;
  isArrowVisible?: boolean;
  textColor?: string;
}

export const Tooltip: React.FC<Props> = ({ targetRef, isVisible, placement, message, isArrowVisible, textColor }) => {
  const popperRef = useRef(null);
  const [arrowRef, setArrowRef] = useState<HTMLDivElement | null>(null);

  const { styles, attributes } = usePopper(targetRef.current, popperRef.current, {
    placement,
    modifiers: [
      {
        name: 'arrow',
        options: {
          element: arrowRef,
        },
      },
      {
        name: 'offset',
        options: {
          offset: [isArrowVisible ? 0 : 10, isArrowVisible ? 10 : 5],
        },
      },
    ],
  });

  return isVisible ? (
    <PopperContainer ref={popperRef} style={styles.popper} isArrowVisible={isArrowVisible} {...attributes.popper}>
      <div ref={setArrowRef} style={styles.arrow} className="arrow" />
      <Typography variantName="body3" style={{ color: textColor || '#A3ABB1' }}>
        {message}
      </Typography>
    </PopperContainer>
  ) : null;
};
