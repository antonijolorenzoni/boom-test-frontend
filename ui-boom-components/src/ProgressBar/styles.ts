import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  padding-top: 10px;
  padding-bottom: 5px;
`;

export const Circle = styled.div<{
  isActive: boolean;
  activeColor: string;
  inactiveColor: string;
  lineColor: string;
  borderColor: string;
  isCurrent: boolean;
}>`
  list-style-type: none;
  width: 100%;
  float: left;
  position: relative;
  text-align: center;
  color: ${({ isActive, activeColor, inactiveColor }) => (isActive ? activeColor : inactiveColor)};

  :before {
    width: ${({ isCurrent }) => (isCurrent ? 26 : 18)}px;
    height: ${({ isCurrent }) => (isCurrent ? 26 : 18)}px;
    content: '';
    line-height: 22px;
    border: 3px solid ${({ borderColor }) => borderColor};
    display: block;
    text-align: center;
    margin: ${({ isCurrent }) => (isCurrent ? 0 : 4)}px auto 3px auto;
    border-radius: 50%;
    position: relative;
    z-index: 2;
    background: ${({ isActive, activeColor, inactiveColor }) => (isActive ? activeColor : inactiveColor)};
    background-color: ${({ isActive, activeColor, inactiveColor }) => (isActive ? activeColor : inactiveColor)};
  }

  :after {
    width: 100%;
    height: 1px;
    content: '';
    position: absolute;
    background-color: ${({ isActive, activeColor, lineColor }) => (isActive ? activeColor : lineColor)};
    top: 16px;
    left: -50%;
    z-index: 0;
  }

  :first-child:after {
    content: none;
  }
`;
