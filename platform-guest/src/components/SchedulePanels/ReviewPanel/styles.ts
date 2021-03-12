import styled from 'styled-components';
import { MediaQueryBreakpoint } from 'types/MediaQueryBreakpoint';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media screen and (max-width: ${MediaQueryBreakpoint.Tablet}px) {
    margin: 0 28px;
  }
`;

export const LineBreak = styled.div`
  border-top: 0.5px solid #a3abb1;
  transform: matrix(1, 0, 0, 1, 0, 0);
  opacity: 0.5;
  margin-top: 25px;
  margin-bottom: 25px;
`;

export const RowWrapper = styled.div<{ columnOnMobile?: boolean }>`
  display: flex;

  justify-content: center;

  @media screen and (max-width: ${MediaQueryBreakpoint.Tablet}px) {
    flex-direction: ${({ columnOnMobile }) => (columnOnMobile ? 'column' : 'row')};
  }
`;

export const OneThirdWrapper = styled.div`
  flex-basis: 33%;

  display: flex;
  flex-direction: column;
`;

export const ColumnWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export const TwoThirdWrapper = styled.div`
  flex-basis: 66%;
`;
