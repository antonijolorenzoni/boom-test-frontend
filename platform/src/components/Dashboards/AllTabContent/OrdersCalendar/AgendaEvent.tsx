import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { EventProps } from 'react-big-calendar';
import { Typography } from 'ui-boom-components';

import { SHOOTING_STATUSES_UI_ELEMENTS } from 'config/consts';
import { OrderEvent } from 'types/OrderEvent';

const Circle = styled.div<{ color?: string }>`
  background-color: ${(props) => props.color};
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 4px;
`;

export const AgendaEvent: React.FC<
  EventProps<OrderEvent> & {
    isOrderSelected?: boolean;
    onSelectEvent: (order: any) => void;
  }
> = ({ event, onSelectEvent }) => {
  const statusColor = SHOOTING_STATUSES_UI_ELEMENTS[event.orderStatus]?.color;

  return (
    <div
      style={{ display: 'flex', alignItems: 'center' }}
      onClick={(e) => onSelectEvent({ orderId: event.orderId, clientId: event.companyId })}
    >
      <Circle color={statusColor} />
      <Typography variantName="caption2">
        {moment(event.startDate).format('hh:mm')} - {moment(event.endDate).format('hh:mm')}
      </Typography>
    </div>
  );
};
