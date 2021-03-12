import React from 'react';

import { SummaryWrapper } from './styles';
import { useTranslation } from 'react-i18next';
import { Typography } from 'ui-boom-components';
import moment from 'moment';

export const SummaryPanel = ({ type, createdAt, updatedAt }) => {
  const { t } = useTranslation();

  const creationDate = moment(createdAt).format('DD/MM/YYYY');

  const creationDays = moment().diff(moment(createdAt), 'days');
  const creationHours = moment().diff(moment(createdAt), 'hours');
  const createdTime = creationDays === 0 ? `${creationHours} ${t('shootings.hoursAgo')}` : `${creationDays} ${t('shootings.daysAgo')}`;

  const modifiedDays = moment().diff(moment(updatedAt), 'days');
  const modifiedHours = moment().diff(moment(updatedAt), 'hours');
  const modifiedTime = modifiedDays === 0 ? `${modifiedHours} ${t('shootings.hoursAgo')}` : `${modifiedDays} ${t('shootings.daysAgo')}`;

  return (
    <SummaryWrapper>
      <div style={{ width: '25%' }}>
        <Typography variantName="overline" style={{ marginBottom: 5 }}>
          {t('shootings.photoshootType')}
        </Typography>
        <Typography variantName="overline" textColor="#000000">
          {t(`photoTypes.${type}`)}
        </Typography>
      </div>
      <div style={{ width: '25%' }}>
        <Typography variantName="overline" style={{ marginBottom: 5 }}>
          {t('shootings.creationDate')}
        </Typography>
        <Typography variantName="overline" textColor="#000000">
          {creationDate}
        </Typography>
      </div>
      <div style={{ width: '25%' }}>
        <Typography variantName="overline" style={{ marginBottom: 5 }}>
          {t('shootings.created')}
        </Typography>
        <Typography variantName="overline" textColor="#000000">
          {createdTime}
        </Typography>
      </div>
      <div style={{ width: '25%' }}>
        <Typography variantName="overline" style={{ marginBottom: 5 }}>
          {t('shootings.modified')}
        </Typography>
        <Typography variantName="overline" textColor="#000000">
          {modifiedTime}
        </Typography>
      </div>
    </SummaryWrapper>
  );
};
