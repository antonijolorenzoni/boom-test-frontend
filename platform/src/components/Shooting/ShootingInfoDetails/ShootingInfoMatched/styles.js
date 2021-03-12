import styled from 'styled-components';

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: minmax(min-content, max-content);
  row-gap: 13px;
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

export const ContainerIconAndText = styled.div`
  display: flex;
  align-items: center;
`;
