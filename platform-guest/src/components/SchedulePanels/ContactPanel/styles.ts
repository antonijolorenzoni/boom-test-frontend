import { TextField } from 'ui-boom-components';
import styled from 'styled-components';
import { MediaQueryBreakpoint } from 'types/MediaQueryBreakpoint';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media screen and (max-width: ${MediaQueryBreakpoint.Tablet}px) {
    margin: 0 28px;
  }
`;

export const RowWrapper = styled.div`
  display: flex;

  @media screen and (max-width: ${MediaQueryBreakpoint.Tablet}px) {
    flex-direction: column;
  }
`;

export const OneThirdWrapper = styled.div`
  flex-basis: 33%;
  @media screen and (max-width: ${MediaQueryBreakpoint.Tablet}px) {
    flex-basis: 100%;
    margin-top: 10px;
  }
`;

export const TextFieldOversize = styled(TextField)`
  padding: 8px 9px 9px;
`;
