import * as React from 'react';
import styled from 'styled-components';

const sizes = {
  xxsmall: {
    width: 7,
    height: 7,
    borderWidth: 2,
  },
  xsmall: {
    width: 16,
    height: 16,
    borderWidth: 3,
  },
  small: {
    width: 25,
    height: 25,
    borderWidth: 6,
  },
  medium: {
    width: 30,
    height: 30,
    borderWidth: 6,
  },
  large: {
    width: 100,
    height: 100,
    borderWidth: 9,
  },
};

export interface SpinnerProps {
  size: keyof typeof sizes;
  borderColor?: string;
}

const SpinnerShape = styled.div<SpinnerProps>`
  width: ${(props) => (props.size ? sizes[props.size].width : sizes.small.width)}px;
  height: ${(props) => (props.size ? sizes[props.size].height : sizes.small.height)}px;
  border-width: ${(props) => (props.size ? sizes[props.size].borderWidth : sizes.small.borderWidth)}px;
  border-color: ${(props) => props.borderColor};
  border-style: solid;

  position: relative;
  animation: rotate 0.8s infinite linear;
  border-right-color: transparent;
  border-radius: 50%;

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Spinner: React.FC<SpinnerProps & { style?: React.CSSProperties }> = ({ borderColor, size, style }) => {
  return <SpinnerShape size={size ? size : 'small'} borderColor={borderColor ? borderColor : '#5AC0B1'} style={style} />;
};

export { Spinner };
