import styled from 'styled-components';

export const LabelTitle = styled.div`
  margin-bottom: 12px;
  font-weight: 500;
  font-size: 17px;
  margin-top: 30px;
`;

export const LinkWrapper = styled.div`
  display: flex;
  align-items: center;

  & > :nth-child(2) {
    padding-left: 15px;
  }

  @media screen and (max-width: 1080px) {
    flex-direction: column;
    & > :nth-child(2) {
      padding-left: 0;
      margin-top: 15px;
    }
  }
`;

export const ColLinkWrapper = styled.div`
  width: 50%;

  @media screen and (max-width: 1080px) {
    width: 100%;
  }
`;

export const SubTitleLabel = styled.div`
  color: #a3abb1;
  text-transform: uppercase;
  margin-bottom: 5px;
  font-weight: 600;
  font-size: 12px;
`;

export const TextSubLabel = styled.div`
  font-size: 13px;
  margin-top: 6px;
`;
