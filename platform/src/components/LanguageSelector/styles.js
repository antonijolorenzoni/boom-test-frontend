import styled from 'styled-components';

export const Wrapper = styled.div`
  align-items: center;
  display: flex;
  border-right: 1px solid white;
  z-index: 1;
`;

export const Button = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  text-transform: uppercase;
  background-color: transparent;
`;

export const WrapperMenuList = styled.div`
  position: absolute;
  background-color: #ffffff;
  border-radius: 4px;
  padding: 8px 0;
  top: 50px;
  margin-left: -13px;
`;

export const MenuItem = styled.div`
  padding: 11px 16px;
  cursor: pointer;
  text-align: center;
  :hover {
    background-color: #dcddde;
  }
`;
