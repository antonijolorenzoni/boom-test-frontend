import styled from 'styled-components';
import { variants } from './variants';

export const CheckboxContainer = styled.div<{ size: number; disabled: boolean }>`
  display: inline-block;
  vertical-align: middle;
  margin: 1px;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  position: relative;
`;

export const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

type P = Omit<typeof variants.classic, 'iconColor' | 'iconColorChecked'> & { checked: boolean; size: number };
export const StyledCheckbox = styled.div<P>`
  position: absolute;
  outline: 1px solid ${(props) => (props.checked ? props.borderColorChecked : props.borderColor)};
  display: inline-block;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  background: ${(props) => (props.checked ? props.fillColor : 'transparent')};

  &:hover {
    outline: 1px solid ${(props) => props.borderColorChecked};
    opacity: 0.6;
  }
`;
