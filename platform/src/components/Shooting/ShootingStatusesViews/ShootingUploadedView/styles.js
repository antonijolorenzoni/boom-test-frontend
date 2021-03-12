import styled from 'styled-components';

export const ActionDescriptionTitle = styled.span`
  font-size: 14px;
  font-weight: bold;
  margin: 10px 0 10px 20px;
  color: #a3abb1;
`;

export const CustomerDescription = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

export const DownloadWithActionsWrapper = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    align-items: normal;
    flex-direction: column;

    & > :nth-child(2) {
      margin-top: 10px;
    }
  }
`;

export const DownloadLinkWrapper = styled.div`
  width: 50%;

  @media screen and (max-width: 1080px) {
    width: 100%;
  }
`;
