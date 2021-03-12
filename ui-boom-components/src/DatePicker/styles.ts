import styled, { css } from 'styled-components';
import { MediaQueryBreakpoint } from '../MediaQueryBreakpoint';
import { Typography } from '../Typography';

export const Wrapper = styled.div<{ isClosed: boolean }>`
  position: relative;
  width: 414px;
  height: 425px;
  background-color: #f5f6f7;
  padding: 25px;
  padding-top: 10px;
  box-sizing: border-box;

  @media screen and (max-width: ${MediaQueryBreakpoint.Desktop}px) {
    height: ${(props) => (props.isClosed ? 'auto' : '425px')};
  }

  @media screen and (max-width: 414px) {
    width: 100%;
    padding: 10px;
  }
`;

export const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  justify-items: center;
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  border-collapse: collapse;
`;

export const DayName = styled(Typography).attrs({ variantName: 'body1', textColor: '#80888d' })`
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
`;

export const AvailableDay = styled.div<{ isSelected: boolean; isHidden: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border: 2px solid #5ac0b1;
  box-sizing: border-box;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 17px;
  font-weight: 500;
  line-height: 24px;
  color: #000000;

  ${(props) =>
    props.isHidden &&
    css`
      display: none;
    `}

  ${(props) =>
    props.isSelected &&
    css`
      background-color: #5ac0b1;
      color: #ffffff;
    `}

  &:hover {
    background-color: #5ac0b1;
    color: #ffffff;
  }

  @media screen and (max-width: 414px) {
    width: 36px;
    height: 36px;
  }
`;

export const UnavailableDay = styled(Typography).attrs({ variantName: 'kpi1' })<{ isHidden: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  color: #000000;
  opacity: 0.3;

  ${(props) =>
    props.isHidden &&
    css`
      display: none;
    `}

  @media screen and (max-width: 414px) {
    width: 36px;
    height: 36px;
  }
`;
