import styled from 'styled-components';

export const HeaderWrapper = styled.div`
  padding: 35px 31px;
  top: 0;
  width: 100vw;
  position: relative;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
`;

export const HeaderMobileWrapper = styled.div`
  padding: 45px 31px;
  top: 0;
  width: 100vw;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  background-color: #5ac0b1;
`;

export const HeaderItemWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-top: 20px;
  margin-bottom: 20px;

  opacity: 0.7;

  :hover {
    opacity: 1;
  }

  :active {
    opacity: 1;
  }
`;

export const LinkHeader = styled.a.attrs({
  target: '_blank',
})`
  text-decoration: none;
  color: #ffffff;
`;

export const MobileMenuWrapper = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 117px;
  width: 100vw;
  padding: 0 31px;
  box-sizing: border-box;
  z-index: 10;
  background-color: #5ac0b1;
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`;

export const MenuOverlay = styled.div<{ isVisible: boolean }>`
  position: absolute;
  z-index: 9;
  width: 100vw;
  top: 117px;
  background-color: #5ac0b1;
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
  opacity: 0.5;
  height: calc(100vh - 117px);
  position: fixed;
`;
