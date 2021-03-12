import styled, { css } from 'styled-components';

export const TabElement = styled.div<{ isActive: boolean }>`
  cursor: ${(props) => (!props.isActive ? 'pointer' : 'default')};
  box-sizing: border-box;
  border-bottom: 0px;
  background: #ffffff;
  opacity: ${(props) => (props.isActive ? 1 : 0.5)};
  display: inline-block;
  position: relative;
  z-index: 0;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  margin-right: 2px;
`;

export const ContentLabel = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 36px;
  width: 225px;
`;
