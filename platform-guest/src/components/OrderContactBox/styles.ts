import styled from 'styled-components';
import { MediaQueryBreakpoint } from 'types/MediaQueryBreakpoint';

export const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 20px;
  margin-bottom: 24px;

  @media screen and (max-width: ${MediaQueryBreakpoint.Tablet}px) {
    display: flex;
    flex-direction: column;
    row-gap: 0;
    margin-bottom: 0;
  }
`;

export const RowWrapper = styled.div`
  @media screen and (max-width: ${MediaQueryBreakpoint.Tablet}px) {
    margin-bottom: 12px;
  }
`;
