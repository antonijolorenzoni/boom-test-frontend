import React from 'react';
import { Tooltip } from '@material-ui/core';
import moment from 'moment';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

const EventText = styled.div`
  color: #80888f;
  font-weight: 100;
  margin: 0;
  font-size: 12px;
`;

const ShootingUnscheduledCanceledLogRow = ({ event, isBoom }) => {
  const { user, createdAt } = event;

  const { t } = useTranslation();

  const firstName = _.get(user, 'firstName');
  const lastName = _.get(user, 'lastName');

  const username = firstName && lastName ? `${firstName} ${lastName}` : '';
  const isSubjectBoom = _.get(user, 'organization') === 1;

  const getSubject = () => {
    if (isSubjectBoom && !isBoom) {
      return t('shootingEvents.userBoom');
    }

    if (user.deleted) {
      return `User${user.id}(${t('shootingEvents.isDeletedUser')})`;
    }

    return `${username}`;
  };

  return (
    <div key={event.id} style={{ margin: 5 }}>
      <EventText as="h4">
        {t('shootingEvents.shootingUnscheduledCancelledMessage', {
          subject: getSubject(),
        })}
        <Tooltip placement="right" title={`${moment(createdAt).format('L')} ${moment(createdAt).format('HH:mm')}`}>
          <EventText as="span">{t('shootingEvents.fromNow', { fromNow: moment(createdAt).fromNow() })}</EventText>
        </Tooltip>
      </EventText>
    </div>
  );
};

export default ShootingUnscheduledCanceledLogRow;
