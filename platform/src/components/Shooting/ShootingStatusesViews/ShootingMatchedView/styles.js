import styled from 'styled-components';

const Title = styled.h3`
  color: #000000;
  font-size: 1.1em;
  margin: 0px;
`;

const SubTitle = styled.h3`
  color: #bbbbbb;
  font-size: 0.8em;
  margin: 0;
`;

const ActionButtonsWrapper = styled.div`
  display: flex;
  align-items: center;

  @media screen and (max-width: 1080px) {
    flex-direction: column;
  }
`;

const CardsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  @media screen and (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

export { Title, SubTitle, ActionButtonsWrapper, CardsWrapper };
