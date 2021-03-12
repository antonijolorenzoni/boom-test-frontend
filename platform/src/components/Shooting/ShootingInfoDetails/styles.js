import styled from 'styled-components';

export const ColouredBox = styled.div`
  z-index: -1;
  position: absolute;
  left: 0;
  top: 0;
  height: ${(props) => (props.isUnscheduled ? '205' : props.isLowHeight ? '141' : '215')}px;
  width: 100%;

  @media screen and (max-width: 1080px) {
    height: ${(props) => {
      if (props.isLowHeight) {
        return '141px';
      }
      if (props.isMatched) {
        return '768px';
      }
      if (props.isPhotographer) {
        return '470px';
      }
      return '518px';
    }};
  }
`;

export const InfosWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;

  & > :first-child {
    flex-basis: ${(props) => (props.isMatched ? '31%' : '40%')};
    max-width: ${(props) => (props.isMatched ? '31%' : '40%')};
  }

  & > :nth-child(2) {
    flex-basis: ${(props) => (props.isMatched ? '68%' : '59%')};
    max-width: ${(props) => (props.isMatched ? '68%' : '59%')};
  }

  @media screen and (max-width: 1080px) {
    flex-direction: column;
    & > :first-child {
      flex-basis: 100%;
      max-width: 100%;
    }

    & > :nth-child(2) {
      flex-basis: 100%;
      max-width: 100%;
    }
  }
`;

export const SummaryWrapper = styled.div`
  border: 1px solid #a3abb1;
  border-radius: 5px;
  padding: 14px 8px;
  background-color: #ffffff;
  display: flex;
`;

export const TransparentButtonOverlay = styled.div`
  color: transparent;
  z-index: 10;
  width: ${(props) => props.rescheduleButtonWidth}px;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;
