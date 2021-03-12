import styled from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
  background-color: #ffffff;
  border: 0.5px solid #a3abb1;
  padding: 10px 16px;
  border-radius: 8px;
`;

export const InfoWrapper = styled.div`
  display: flex;

  @media screen and (max-width: 1080px) {
    flex-direction: column;
    flex-basis: 100%;
    align-items: flex-start;
  }
`;

export const Hr = styled.hr`
  margin-top: 20px;
  border-top: 0.5px;
  color: #a3abb1;
  width: calc(100% + 30px);
  position: relative;
  left: -17px;
`;

export const DeliveryToggler = styled.div`
  display: flex;
  align-items: center;
`;

export const DeliveryInfoWrapper = styled.div`
  display: flex;
  border-left: 0.5px solid #a3abb1;
  margin-left: 20px;
  padding-left: 8px;
`;
