import styled, { css } from 'styled-components';
import { MediaQueryBreakpoint } from 'types/MediaQueryBreakpoint';
import { OutlinedButton } from 'ui-boom-components';

export const LineBreak = styled.div`
  border-top: 0.5px solid #a3abb1;
  transform: matrix(1, 0, 0, 1, 0, 0);
  opacity: 0.5;
`;

export const GridRow = styled.div`
  display: grid;
  white-space: nowrap;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 80px;
  row-gap: 0;

  align-items: center;
  margin-bottom: 15px;
  margin-top: 15px;
  padding: 0 200px;

  @media screen and (max-width: ${MediaQueryBreakpoint.Desktop}px) {
    padding: 0;
    column-gap: 20px;
  }
`;

export const StatusTipAndDownload = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;

  @media screen and (max-width: ${MediaQueryBreakpoint.Desktop}px) {
    align-items: flex-start;
  }
`;

export const StatusTip = styled.div<{ showDownload: boolean }>`
  display: flex;
  flex-direction: column;

  @media screen and (max-width: ${MediaQueryBreakpoint.Desktop}px) {
    justify-content: space-between;
    ${(props) =>
      props.showDownload &&
      css`
        flex-basis: 50%;
      `};
  }
`;

export const DownloadButton = styled(OutlinedButton).attrs({ size: 'small' })`
  border-radius: 10px;
  margin-left: 50px;

  @media screen and (max-width: ${MediaQueryBreakpoint.Desktop}px) {
    margin-left: 0px;
  }
`;
