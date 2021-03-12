import { MediaQueryBreakpoint } from '../MediaQueryBreakpoint';
import styled, { css } from 'styled-components';

export const Wrapper = styled.div<{ isClosed: boolean }>`
  position: relative;
  width: 414px;
  height: 425px;
  background-color: #f5f6f7;
  padding: 25px;
  padding-top: 10px;
  box-sizing: border-box;

  @media screen and (max-width: ${MediaQueryBreakpoint.Desktop}px) {
    height: ${(props) => (props.isClosed ? 'auto' : '340px')};
  }

  @media screen and (max-width: 414px) {
    width: auto;
    padding: 10px;
  }
`;

export const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  justify-items: center;
  grid-column-gap: 7px;
  grid-row-gap: 28px;
`;

export const AvailableHour = styled.div<{ isSelected: boolean; isInDuration: boolean; isHidden: boolean; isDisabled?: boolean }>`
  display: ${(props) => (props.isHidden ? 'none' : 'flex')};
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border: 2px solid #5ac0b1;
  box-sizing: border-box;
  width: 54px;
  height: 33px;
  border-radius: 40px;
  cursor: pointer;
  font-size: 17px;
  font-weight: 500;
  line-height: 24px;
  color: #000000;

  @media screen and (max-width: 414px) {
    width: 52px;
    font-size: 16px;
  }

  ${(props) =>
    !props.isDisabled &&
    css`
      &:hover {
        background-color: #5ac0b1;
        color: #ffffff;
      }
    `}

  ${(props) =>
    props.isSelected &&
    css`
      background-color: #5ac0b1;
      color: #ffffff;
    `}

  ${(props) =>
    props.isInDuration &&
    css`
      background-color: #5ac0b1;
      color: #ffffff;
      opacity: 0.5;
    `}

  ${(props) =>
    props.isDisabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
    `}
`;
