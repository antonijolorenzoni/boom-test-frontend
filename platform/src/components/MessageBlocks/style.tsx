import styled from 'styled-components';

interface Props {
  background: string;
}

export const BoxShadow = styled.div<Props>`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  background: ${(props) => props.background};
`;
