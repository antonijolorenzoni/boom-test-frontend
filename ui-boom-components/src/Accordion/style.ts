import styled, { css } from 'styled-components';

const Wrapper = styled.div`
  position: relative;
`;

const Header = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  font-weight: 300;
  font-size: 13px;
`;

const TransparentOverlay = styled.div<{ disabled?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  min-width: 100%;
  min-height: 100%;
  cursor: pointer;
  z-index: 1000;
  background-color: transparent;

  ${(props) =>
    props.disabled &&
    css`
      cursor: default;
      background-color: rgba(255, 255, 255, 0.58);
    `}
`;

const IconWrapper = styled.div<{ isOpen: boolean }>`
  position: absolute;
  right: 6px;

  ${(props) =>
    props.isOpen &&
    css`
      transform: rotateZ(180deg);
    `};

  transition: transform 0.4s ease;
`;

const Content = styled.div<{ isOpen: boolean }>`
  margin-top: ${(props) => (props.isOpen ? '8px' : 0)};
  max-height: ${(props) => (props.isOpen ? '1000px' : 0)};
  overflow-y: auto;
`;

export { Wrapper, Header, TransparentOverlay, IconWrapper, Content };
