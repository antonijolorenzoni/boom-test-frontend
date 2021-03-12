import styled from 'styled-components';
import { Icon } from 'ui-boom-components';

export const Overlay = styled.div`
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  overflow: hidden;
`;

export const ModalWrapper = styled.div`
  background-color: #ffffff;
  border-radius: 6px;
  padding: 30px 20px 20px 20px;
  position: relative;
  max-height: calc(100% - 70px);
  overflow: auto;
`;

export const CloseIcon = styled(Icon)`
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
`;
