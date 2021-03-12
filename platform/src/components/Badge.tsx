import React from 'react';
import styled from 'styled-components';
import { Typography } from 'ui-boom-components';
import { hexToRgb } from 'utils/hexToRgb';

interface Props {
  color: string;
  text: string;
}

const Wrapper = styled.div<{ color: string }>`
  background-color: ${(props) => hexToRgb(props.color, 0.2)};
  border: ${(props) => `1px solid ${props.color}`};
  border-radius: 100px;
  padding: 2px 8px;
  height: fit-content;
`;
export const Badge: React.FC<Props> = ({ color, text }) => (
  <Wrapper color={color}>
    <Typography variantName="overline" textColor={color}>
      {text}
    </Typography>
  </Wrapper>
);
