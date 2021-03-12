import React from 'react';
import { Tooltip } from '@material-ui/core';
import moment from 'moment';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const EventText = styled.div`
  color: #80888f;
  font-weight: 100;
  margin: 0;
  font-size: 12px;
`;

export const EditingPipelineZippedLogRow = ({ event, isBoom }) => {
  const {
    createdAt,
    additionalInfo: { lastEditor },
  } = event;

  const { t } = useTranslation();

  return (
    <div key={event.id} style={{ margin: 5 }}>
      <EventText as="h4">
        {t('shootingEvents.editingPipelineZipped', { editor: lastEditor })}
        {isBoom && (
          <Tooltip placement="right" title={`${moment(createdAt).format('L')} ${moment(createdAt).format('HH:mm')}`}>
            <EventText as="span">{t('shootingEvents.fromNow', { fromNow: moment(createdAt).fromNow() })}</EventText>
          </Tooltip>
        )}
      </EventText>
    </div>
  );
};
