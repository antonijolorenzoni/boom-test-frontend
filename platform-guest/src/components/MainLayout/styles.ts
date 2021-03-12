import { MediaQueryBreakpoint } from 'types/MediaQueryBreakpoint';
import styled from 'styled-components';

const header_height = 117;

export const Wrapper = styled.div`
  height: 100vh;
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;

  height: calc(100vh - ${header_height * 2}px);

  @media screen and (max-width: ${MediaQueryBreakpoint.Smartphone}px) {
    bottom: 0;
    position: fixed;
  }

  @media screen and (max-width: ${MediaQueryBreakpoint.Tablet}px) {
    height: calc(100vh - ${header_height}px);
  }
`;
