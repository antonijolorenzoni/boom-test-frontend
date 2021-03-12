import styled from 'styled-components';

export const ActionDescriptionTitle = styled.h4`
  font-size: 18px;
  font-weight: bold;
  color: #80888d;
  margin: 0;
  margin-left: 10px;
`;

export const PhotographerAdviceWrapper = styled.div`
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: row;
  margin-top: 20px;
`;

export const WrapperButtons = styled.div`
  display: flex;
  margin-left: 18px;

  @media screen and (max-width: 1080px) {
    margin-left: 0;
    margin-top: 10px;
  }
`;

export const WrapperShootingActions = styled.div`
  display: flex;
  align-items: center;

  @media screen and (max-width: 1080px) {
    display: block;
  }
`;

export const DownloadLinkWrapper = styled.div`
  width: 50%;

  @media screen and (max-width: 1080px) {
    width: 100%;
  }
`;

export const WrapperEditingStatus = styled.div`
  padding: 9px 16px;
  background-color: ${({ color }) => color};
  border-radius: 5px;
  display: flex;
  align-items: center;
`;

export const Spinner = styled.img`
  height: 18px;
  width: 18px;
  margin-right: 8px;
`;
