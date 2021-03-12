import { MediaQueryBreakpoint } from 'types/MediaQueryBreakpoint';

import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PickersWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  @media screen and (max-width: ${MediaQueryBreakpoint.Desktop}px) {
    flex-direction: column;
    align-items: center;

    & > :nth-child(1) {
      margin-bottom: 5px;
    }
  }
`;

export const TimePickerWrapper = styled.div`
  @media screen and (max-width: 414px) {
    width: 100%;
  }
`;

export const DatePickerWrapper = styled.div`
  @media screen and (max-width: 414px) {
    width: 100%;
  }
`;

export const BottomRowResume = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 18px;

  @media screen and (max-width: 414px) {
    margin-left: 28px;
    margin-right: 28px;
  }
`;
