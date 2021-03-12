import React from 'react';
import { Typography } from 'ui-boom-components/lib';
import { Rating } from '../Rating';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

interface Props {
  title: string;
  value?: number;
  max: number;
  style?: React.CSSProperties;
}

const RatingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 210px;
`;

const Subtitle = styled(Typography)`
  text-transform: uppercase;
  margin-right: 8;
`;

export const RatingBlock: React.FC<Props> = ({ title, value, max = 5, style }) => {
  const { t } = useTranslation();
  const isValidValue = value && value > 0;
  return (
    <RatingWrapper style={style}>
      <Subtitle variantName="overline" isUppercase>
        {title}
      </Subtitle>
      {isValidValue ? <Rating value={value} max={max} /> : <Subtitle variantName="overline">{t('general.na')}</Subtitle>}
    </RatingWrapper>
  );
};
