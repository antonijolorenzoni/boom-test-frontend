import React, { useRef, useState } from 'react';

import { Typography } from '../Typography';

import { HoverText } from './styles';

export const Popup = ({
  children,
  text,
  isWidthCheck = true,
  style,
}: {
  children: (ref: React.MutableRefObject<HTMLElement | null>) => JSX.Element;
  text: string;
  isWidthCheck?: boolean;
  style?: React.CSSProperties;
}) => {
  const [isHover, setIsHover] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const paragraphRef = useRef<HTMLDivElement | null>(null);

  const width = containerRef.current ? containerRef.current.getBoundingClientRect().width : 0;

  const isPopupVisible = !isWidthCheck || (paragraphRef.current && paragraphRef.current.scrollWidth > paragraphRef.current.clientWidth);

  return (
    <div onMouseOver={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} ref={containerRef}>
      {children(paragraphRef)}
      {isPopupVisible && (
        <HoverText isVisible={isHover} style={style}>
          <Typography variantName="body3">{text}</Typography>
        </HoverText>
      )}
    </div>
  );
};
