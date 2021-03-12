import styled, { css } from 'styled-components';
import { MediaQueryBreakpoint } from 'types/MediaQueryBreakpoint';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100vh;
  background-color: #5ac0b1;

  padding: 35px;
  box-sizing: border-box;

  @media screen and (max-width: ${MediaQueryBreakpoint.Smartphone}px) {
    padding-top: 100px;
  }

  @media only screen and (max-height: 750px) {
    padding-top: 35px;
  }
`;

export const LogoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  top: 35px;
  left: 31px;
  width: 96vw;

  @media screen and (max-width: ${MediaQueryBreakpoint.Desktop}px) {
    width: 80vw;
  }
`;

export const StepWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 45vw;

  @media screen and (max-width: ${MediaQueryBreakpoint.Desktop}px) {
    width: 80vw;
  }

  @media only screen and (max-height: 750px) {
    box-sizing: border-box;
    max-height: 300px;
    overflow-y: scroll;
  }
`;

export const IndicatorWrapper = styled.div`
  display: flex;

  margin-bottom: 60px;

  & > div {
    margin: 0px 3px;
  }
`;

export const Indicator = styled.div<{ active?: boolean }>`
  height: 8px;
  width: 8px;
  background-color: #ffffff;
  border-radius: 100%;
  cursor: pointer;
  ${(props) =>
    !props.active &&
    css`
      opacity: 0.5;
    `}
`;
