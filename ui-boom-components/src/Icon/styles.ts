import styled from 'styled-components';

export const StyledIcon = styled.i<{ size?: number; color?: string }>`
  color: ${(props) => props.color || ''};
  font-size: ${(props) => props.size && `${props.size}px`};
`;
