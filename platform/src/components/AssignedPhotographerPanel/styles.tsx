import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  border: 1px solid #a3abb1;
  border-radius: 6px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const IdNameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 25%;
  padding: 10px;
  border-right: 0.5px solid #a3abb1;

  @media (max-width: 768px) {
    border-right: unset;
    margin-right: unset;
  }
`;

const OthersInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  & > :first-child {
    display: flex;
    justify-content: space-around;
    padding: 10px;

    @media screen and (max-width: 1080px) {
      flex-direction: column;
    }
  }
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    flex-direction: row;
    align-items: center;
    border-right: unset;
    margin-right: unset;
  }
`;

const InfoTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #a3abb1;
  text-transform: uppercase;
  margin-bottom: 5px;

  @media (max-width: 768px) {
    margin-bottom: 0;
    flex-basis: 25%;
  }
`;

const PhoneAndMailWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 6px 0;
  background: #f5f6f7;
  border-top: 0.5px solid #a3abb1;
  border-bottom-right-radius: 6px;

  & > div {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media screen and (max-width: 1080px) {
    border-bottom-left-radius: 6px;
  }
`;

export { Wrapper, IdNameWrapper, OthersInfoWrapper, InfoWrapper, InfoTitle, PhoneAndMailWrapper };
