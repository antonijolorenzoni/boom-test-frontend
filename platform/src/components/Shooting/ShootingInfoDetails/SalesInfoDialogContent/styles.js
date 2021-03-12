import styled, { css } from 'styled-components';

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  ${(props) =>
    props.withMarginLeft &&
    css`
      margin-left: 30px;
    `};
`;
