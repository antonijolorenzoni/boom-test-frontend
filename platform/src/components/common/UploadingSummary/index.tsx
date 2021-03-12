import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Icon, Typography } from 'ui-boom-components';
import { toHumanReadableSize } from 'utils/files';
import { messagesRed } from '../colors';
import { GraySpace } from '../GraySpace';
import { ProgressLine } from '../ProgressLine/ProgressLine';
import { SpinnerIcon } from '../SpinnerIcon';

interface Props {
  load: number;
  totalFiles: number;
  totalFilesSize: number;
  completed: boolean;
  loading: boolean;
  error: boolean;
}

const SummaryWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  margin-right: 20px;
`;

const Space = styled.div`
  margin-bottom: 5px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const UploadingSummary: React.FC<Props> = ({ load, totalFiles, totalFilesSize, completed, loading, error }) => {
  const { t } = useTranslation();

  return (
    <GraySpace>
      <Space>
        <Row>
          <Typography variantName="overline" isUppercase>
            {t('forms.uploading')}
          </Typography>
          {(error || loading) && (
            <div style={{ marginLeft: 4, display: 'flex' }}>
              {error ? <Icon name="warning" size={12} color={messagesRed} /> : <SpinnerIcon />}
            </div>
          )}
        </Row>
      </Space>
      <Space>
        <ProgressLine load={load} completed={completed} />
      </Space>
      <Space>
        <SummaryWrapper>
          <Typography variantName="caption2">{`${load}%`}</Typography>
          <Typography variantName="caption2">{`${totalFiles} ${t('forms.files')} (${toHumanReadableSize(totalFilesSize)})`}</Typography>
        </SummaryWrapper>
      </Space>
    </GraySpace>
  );
};
