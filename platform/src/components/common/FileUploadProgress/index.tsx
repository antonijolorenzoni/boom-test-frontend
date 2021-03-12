import React from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { Icon, Typography } from 'ui-boom-components';
import { toHumanReadableSize } from 'utils/files';
import { cutAndAppendSuffix } from 'utils/string';
import { neutralDarkGray, success, neutralLightGrey, white, messagesRed, productAccepted } from '../colors';
import { ProgressLine } from '../ProgressLine/ProgressLine';

interface Props {
  index: number;
  fileName: string;
  fileSize: number;
  load: number;
  status: Status;
  onDelete: () => void;
  onRetry: () => void;
}

export enum Status {
  FAILED,
  PROGRESS,
  COMPLETED,
}

export const FileUploadProgress: React.FC<Props> = ({ index, fileName, fileSize, load, status, onDelete, onRetry }) => {
  const { t } = useTranslation();

  const statusToView = new Map([
    [
      Status.FAILED,
      <>
        <Typography variantName="caption2" textColor={messagesRed} style={{ marginRight: 14 }}>
          {t('forms.fileUploadFailed')}
        </Typography>
        <ReloadIcon name="replay_circle_filled" color={productAccepted} size={16} onClick={onRetry} />
      </>,
    ],
    [
      Status.PROGRESS,
      <ProgressLineWrapper>
        <ProgressLine load={load} completed={false} />
      </ProgressLineWrapper>,
    ],
    [Status.COMPLETED, <Icon name="check_circle" size={16} color={success} />],
  ]);

  return (
    <UploadWrapper index={index}>
      <Typography variantName="caption2" textColor={neutralDarkGray} style={{ marginLeft: 10 }}>
        {`${cutAndAppendSuffix(fileName, 40)} (${toHumanReadableSize(fileSize)})`}
      </Typography>
      <UploadingStateWrapper>
        {statusToView.get(status)}
        {<Icon name="close" size={16} color={neutralDarkGray} onClick={onDelete} style={{ cursor: 'pointer', margin: 5 }} />}
      </UploadingStateWrapper>
    </UploadWrapper>
  );
};

const UploadWrapper = styled.div<{ index: number }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  ${({ index }) => css`
    background: ${index % 2 === 0 ? white : neutralLightGrey};
  `}
`;

const ProgressLineWrapper = styled.div`
  width: 130px;
  margin-right: 30px;
  align-items: center;
  justify-content: flex-end;
`;

const UploadingStateWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ReloadIcon = styled(Icon)`
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  cursor: pointer;
`;
