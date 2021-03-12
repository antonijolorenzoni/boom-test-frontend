import styled, { css } from 'styled-components';

export const RadioContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

export const LabelRadio = styled.label`
  ${(props: { disabled?: boolean }) =>
    !props.disabled &&
    css`
      & * {
        cursor: pointer;
      }
    `}
`;

export const InputRadio = styled.input`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  ${(props) =>
    !props.disabled &&
    css`
      & * {
        cursor: pointer;
      }
    `}

  width: 18px;
  height: 18px;
  padding: 2px;
  margin: 0;

  background-clip: content-box;
  border: 1px solid ${(props) => (props.disabled ? '#A3ABB1' : props.color)};
  border-radius: 50%;

  opacity: ${(props) => props.disabled && '0.5'};

  :checked {
    background-color: ${(props) => (props.disabled ? '#A3ABB1' : props.color)};
  }

  :focus {
    outline: none;
  }

  ${LabelRadio}:hover:not(:checked) {
    background-color: #f5f6f7;
  }
`;
