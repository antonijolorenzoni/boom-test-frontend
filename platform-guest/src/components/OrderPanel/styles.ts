import { MediaQueryBreakpoint } from 'types/MediaQueryBreakpoint';
import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  padding: 16px 20px;
  background-color: #ffffff;

  box-sizing: border-box;

  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 30px;

  @media screen and (max-width: ${MediaQueryBreakpoint.Tablet}px) {
    box-shadow: 0px -4px 10px rgba(0, 0, 0, 0.25);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    width: 100%;
    margin: 0;
    padding: 11px 30px 30px;
    overflow: scroll;
    height: calc(100vh - 155px);
  }
`;

export const Overlay = styled.div.attrs({ 'data-testid': 'order-panel-overlay' })`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: #ffffff;
  opacity: 0.5;
`;
