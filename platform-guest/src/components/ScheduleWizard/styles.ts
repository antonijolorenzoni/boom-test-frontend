import { MediaQueryBreakpoint } from 'types/MediaQueryBreakpoint';
import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 50px 0;
  height: calc(100vh - 100px);

  @media screen and (max-width: ${MediaQueryBreakpoint.Desktop}px) {
    height: auto;
    margin: 28px;
  }

  @media screen and (max-width: 414px) {
    margin: 28px 0;
  }

  & > :nth-child(2) {
    width: 100%;
    position: relative;
    height: 100%;
    max-width: 900px;
  }
`;

export const WrapperButtons = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  position: absolute;
  bottom: 0;

  @media screen and (max-width: ${MediaQueryBreakpoint.Desktop}px), screen and (max-height: 750px) {
    height: auto;
    position: unset;
    margin-top: 55px;
    margin-bottom: 20px;
  }
`;

export const DateAndTimeWrapperButtons = styled(WrapperButtons)`
  @media screen and (max-width: 414px) {
    & > :nth-child(1) {
      margin-left: 28px;
    }
    & > :nth-child(2) {
      margin-right: 28px;
    }
  }
`;
