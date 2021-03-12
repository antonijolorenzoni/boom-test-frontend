import styled from 'styled-components';

export const FieldsWrapper = styled.div`
  display: flex;

  @media screen and (max-width: 1080px) {
    flex-direction: column;
  }
`;

export const WrapperCallBox = styled.div`
  position: absolute;
  right: 8px;
  padding: 8px;
  background-color: #311a91;
  border-radius: 5px;
  display: flex;
  align-items: center;
`;

export const WrapperPanel = styled.div`
  border: 1px solid rgba(163, 171, 177, 0.5);
  border-radius: 5px;
  padding: 10px 8px;
  margin-bottom: 7px;
`;

export const GridMultiField = styled.div`
  width: 100%;
  display: grid;
  grid-column-gap: 25px;
  grid-template-columns: 1fr 1fr;

  @media screen and (max-width: 1080px) {
    grid-template-columns: auto;
  }
`;
