import styled from 'styled-components';

export const ChipWrapper = styled.div`
  display: flex;
  margin-top: 8px;
  & > div:not(:last-child) {
    margin-right: 8px;
  }
`;
