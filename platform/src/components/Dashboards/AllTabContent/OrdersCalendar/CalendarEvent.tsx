import React, { useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Typography } from 'ui-boom-components';
import { EventProps } from 'react-big-calendar';

import { SHOOTINGS_STATUSES, SHOOTING_STATUSES_UI_ELEMENTS } from 'config/consts';
import { OrderTooltip } from './OrderTooltip';
import { OrderEvent } from 'types/OrderEvent';

export const CalendarEvent: React.FC<
  EventProps<OrderEvent> & {
    isOrderSelected?: boolean;
    onToggle: React.Dispatch<string | null>;
    onSelectEvent: (order: { orderId: number; companyId: number; score?: number }) => void;
  }
> = ({ event, isOrderSelected, onToggle, onSelectEvent }) => {
  const refElement = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        ref={refElement}
        onClick={(e) => {
          e.stopPropagation();
          onToggle(event.orderCode);
        }}
        style={{
          height: '100%',
          border: '1px solid rgb(90, 192, 177)',
          borderTop: 'unset',
          boxShadow: `inset 0px 8px ${SHOOTING_STATUSES_UI_ELEMENTS[event.orderStatus]?.color}`,
          padding: '10px 4px',
          opacity: [SHOOTINGS_STATUSES.CANCELED, SHOOTINGS_STATUSES.RESHOOT].includes(event.orderStatus) ? 0.5 : 1,
        }}
        data-testid={`order-calendar-${event.orderCode}`}
      >
        <Typography variantName="body2">{event.orderTitle}</Typography>
      </div>
      <AnimatePresence>
        {isOrderSelected && <OrderTooltip event={event} referenceElement={refElement} onToggle={onToggle} onDetails={onSelectEvent} />}
      </AnimatePresence>
    </>
  );
};
