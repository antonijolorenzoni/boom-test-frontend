import styled from 'styled-components';

interface Props {
  colorBgChip?: string;
  colorTextLabel?: string;
}

export const ChipContainer = styled.div<Props>`
  background-color: ${(props) => props.colorBgChip};
  color: ${(props) => props.colorTextLabel};
  height: 22px;
  max-width: 100px;
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 16px;
  font-size: 10px;
  display: flex;
  align-items: center;
`;
