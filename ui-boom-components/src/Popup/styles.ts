import styled from 'styled-components';

export const HoverText = styled.div<{ isVisible: boolean }>`
  display: ${(props) => (props.isVisible ? 'block' : 'none')};
  border: 1px solid #80888d;
  padding: 4px 8px;
  background-color: white;
  white-space: break-spaces;
  margin-top: -20px;
  border-radius: 5px;
  position: absolute;
  z-index: 1;
`;
