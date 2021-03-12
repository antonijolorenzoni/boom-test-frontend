import React, { useState } from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { Calendar, momentLocalizer } from 'react-big-calendar';

import { CalendarViewType } from 'types/CalendarViewType';
import { CalendarEvent } from './CalendarEvent';
import { AgendaEvent } from './AgendaEvent';
import { OrderEvent } from 'types/OrderEvent';
import AbilityProvider from 'utils/AbilityProvider';
import { PERMISSIONS, PERMISSION_ENTITIES } from 'config/consts';

export const OrdersCalendar: React.FC<{
  date: string;
  calendarViewType: CalendarViewType;
  events: Array<OrderEvent>;
  smbUnsubscribedGrace: boolean;
  onSelectEvent: (order: { orderId: number; companyId: number; score?: number }) => void;
  onOpenNewOrderForm: (start: string | Date) => void;
}> = ({ date, calendarViewType, events, smbUnsubscribedGrace, onSelectEvent, onOpenNewOrderForm }) => {
  const { i18n } = useTranslation();
  moment.locale(i18n.languages[0]);

  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [nodeWrapper, setNodeWrapper] = useState<HTMLDivElement | null>(null);

  const canCreateOrder = AbilityProvider.getOrganizationAbilityHelper().hasPermission(
    [PERMISSIONS.CREATE, PERMISSIONS.MANAGE],
    PERMISSION_ENTITIES.SHOOTING
  );

  return (
    <div
      style={{ backgroundColor: '#ffffff', overflowY: 'scroll', height: `calc(100vh - ${nodeWrapper?.getBoundingClientRect().y}px)` }}
      ref={setNodeWrapper}
    >
      <Calendar
        date={moment(date).toDate()}
        components={{
          event: ({ event }) => (
            <CalendarEvent
              title={''}
              event={event}
              isOrderSelected={selectedOrder === event.orderCode}
              onToggle={setSelectedOrder}
              onSelectEvent={onSelectEvent}
            />
          ),
          month: {
            event: ({ event }) => (
              <AgendaEvent title={''} event={event} isOrderSelected={selectedOrder === event.orderCode} onSelectEvent={onSelectEvent} />
            ),
          },
        }}
        events={events}
        eventPropGetter={() => ({
          style: {
            backgroundColor: 'transparent',
            borderRadius: '0px',
            opacity: 1,
            color: 'transparent',
            border: '0px solid white',
            display: 'block',
            marginLeft: 5,
            padding: 0,
          },
        })}
        startAccessor="startDate"
        endAccessor="endDate"
        toolbar={false}
        views={['month', 'week', 'day']}
        view={calendarViewType}
        localizer={momentLocalizer(moment)}
        showMultiDayTimes
        selectable={!selectedOrder && canCreateOrder && !smbUnsubscribedGrace}
        onSelectSlot={({ start }) => onOpenNewOrderForm(start)}
        scrollToTime={moment().set('hours', 7).toDate()}
        onNavigate={() => {
          // to remove useless Calendar component warning
        }}
        onView={() => {
          // to remove useless Calendar component warning
        }}
        popup
      />
    </div>
  );
};
