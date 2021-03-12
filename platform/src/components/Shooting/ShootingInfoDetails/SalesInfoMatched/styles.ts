import styled from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
  height: 245px;
  background-color: #ffffff;
  border: 0.5px solid #a3abb1;
  padding: 10px 16px;
  border-radius: 8px;

  @media screen and (max-width: 1080px) {
    height: 270px;
  }
`;

export const GridTwoCol = styled.div`
  display: flex;
  width: 100%;
`;

export const Column = styled.div`
  flex-basis: 50%;
  justify-content: flex-end;
`;
