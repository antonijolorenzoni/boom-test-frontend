import styled from 'styled-components';

const Checkbox = styled.input`
  display: none;
  :checked + label span:last-child {
    background: #5ac0b1;
  }

  :checked + label span:last-child::before {
    transform: translateX(14px);
  }

  :disabled + label {
    cursor: not-allowed;
  }

  :disabled + label span:last-child {
    background: #a3abb1;
  }
`;

const CheckboxLabel = styled.label`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
`;

const Span = styled.span`
  position: relative;
  width: 30px;
  height: 16px;
  border-radius: 15px;
  background: #5ac0b1;
  transition: all 0.3s;

  ::after {
    content: '';
    position: absolute;
  }

  ::before {
    content: '';
    position: absolute;
    left: 2px;
    top: 2px;
    width: 12px;
    height: 12px;
    background: #ffffff;
    border-radius: 50%;
    z-index: 1;
    transition: transform 0.3s;
  }
`;

export { Checkbox, CheckboxLabel, Span };
