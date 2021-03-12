import styled from 'styled-components';

const StyledIconButton = styled.button`
  border: none;

  background-color: transparent;
  cursor: ${({ disabled }) => (disabled ? 'no-drop' : 'pointer')};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 5px;

  &:focus {
    outline: none;
  }

  &:hover {
    background-color: ${({ disabled }) => (disabled ? 'transparent' : 'rgba(0, 0, 0, 0.04))')};
  }

  &:active {
    transform: scale(0.95);
  }

  transition: box-shadow 0.2s ease, transform 0.5s ease;
`;

export { StyledIconButton };
