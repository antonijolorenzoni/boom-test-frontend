import styled from 'styled-components';
import { productAccepted, success, neutral } from '../colors';

export const ProgressLine = styled.div<{ load: number; completed: boolean }>`
  height: 5px;
  background: ${({ completed, load }) =>
    completed ? success : `linear-gradient(to right, ${productAccepted} ${load}%, ${neutral} ${load}% ${100 - load}%)`};
`;
