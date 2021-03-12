import { ButtonProps, OutlinedButtonProps } from '.';
import styled, { css } from 'styled-components';

const DefaultStyledButton = styled.button.attrs((props) => ({ type: props.type || 'button' }))<ButtonProps>`
  position: relative;
  border: none;
  display: flex;
  min-width: 60px;
  align-items: center;
  justify-content: center;
  padding: 3px 6px;
  border-radius: 5px;
  text-transform: uppercase;
  cursor: pointer;
  outline: none;
  box-sizing: border-box;
  color: ${(props) => props.textColor || '#FFFFFF'};
  background-color: ${(props) => props.backgroundColor || '#5AC0B1'};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover {
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.12);
  }

  &:active {
    transform: scale(0.95);
  }

  transition: box-shadow 0.2s ease, transform 0.5s ease;

  ${(props) => {
    if (props.size === 'small') {
      return css`
        height: 21px;
        font-size: 11px;
        font-weight: 700;
      `;
    }

    return css`
      height: 37px;
      font-size: 12px;
      font-weight: 600;
    `;
  }};
`;

const OutlinedStyledButton = styled(DefaultStyledButton)<OutlinedButtonProps>`
  color: ${(props) => props.color || '#5AC0B1'};
  background-color: ${(props) => props.backgroundColor || '#ffffff'};
  padding-top: 1px;
  padding-bottom: 1px;
  box-sizing: border-box;
  border: 2px solid ${(props) => props.color || '#5AC0B1'};
`;

export { DefaultStyledButton, OutlinedStyledButton };
