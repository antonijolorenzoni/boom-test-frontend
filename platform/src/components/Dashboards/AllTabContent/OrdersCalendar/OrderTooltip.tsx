import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { Button, Icon, Typography } from 'ui-boom-components';
import { usePopper } from 'react-popper';

import { SHOOTING_STATUSES_UI_ELEMENTS } from 'config/consts';
import { OrderEvent } from 'types/OrderEvent';

const TooltipWrapper = styled(motion.div)`
  z-index: 10;
  border-radius: 4px;
  padding: 10px 10px 16px 10px;
  background-color: #fff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  min-width: 300px;
`;

export const OrderTooltip: React.FC<{
  referenceElement: React.MutableRefObject<HTMLDivElement | null>;
  event: OrderEvent;
  onToggle: (orderCode: string | null) => void;
  onDetails: (order: { orderId: number; companyId: number; score?: number }) => void;
}> = ({ referenceElement, event, onToggle, onDetails }) => {
  const { t } = useTranslation();
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement.current, popperElement, {
    modifiers: [{ name: 'arrow' }],
    placement: 'auto',
  });

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      onToggle(null);
    };
    window.addEventListener('click', listener);

    return () => window.removeEventListener('click', listener);
  }, [onToggle]);

  return ReactDOM.createPortal(
    <TooltipWrapper
      onClick={(e) => e.stopPropagation()}
      ref={setPopperElement}
      style={{ ...styles.popper }}
      {...attributes.popper}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }}
      initial="hidden"
      animate="visible"
      exit="hidden"
      data-testid={`order-calendar-tooltip-${event.orderCode}`}
    >
      <Icon name="close" size={17} style={{ cursor: 'pointer', alignSelf: 'flex-end' }} onClick={() => onToggle(null)} />
      <Typography variantName="title2">{event.companyName}</Typography>
      <Typography variantName="title3" textColor="#000">
        {event.orderTitle}
      </Typography>
      <div style={{ marginTop: 10, padding: 8, backgroundColor: '#F5F6F7', borderRadius: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 7 }}>
          <Icon size={17} name="calendar_today" style={{ marginRight: 9 }} />
          <Typography variantName="body2" textColor="#000">
            {moment(event.startDate).format('dddd DD MMMM')}
          </Typography>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 7 }}>
          <Icon size={17} name="alarm" style={{ marginRight: 9 }} />
          <Typography variantName="body2" textColor="#000">
            {moment(event.startDate).format('HH:mm')} - {moment(event.endDate).format('HH:mm')}
          </Typography>
        </div>
        <div
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}`)}
        >
          <Icon size={17} name="room" style={{ marginRight: 9 }} />
          <Typography
            variantName="body2"
            textColor="#000"
            style={{
              maxWidth: 350,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              textDecoration: 'underline',
            }}
          >
            {event.address}
          </Typography>
        </div>
      </div>
      <div style={{ display: 'flex', marginTop: 4 }}>
        <Typography variantName="overline" textColor="#000" style={{ textTransform: 'uppercase' }}>
          {t('order.statusShort')}:&nbsp;
        </Typography>
        <Typography
          variantName="overline"
          textColor={SHOOTING_STATUSES_UI_ELEMENTS[event.orderStatus]?.color}
          style={{ textTransform: 'uppercase' }}
        >
          {t(`shootingStatuses.${event.orderStatus}`)}
        </Typography>
      </div>
      <Button
        size="small"
        style={{ marginTop: 12, width: 94 }}
        onClick={() => {
          onToggle(null);
          onDetails({ orderId: event.orderId, companyId: event.companyId });
        }}
      >
        {t('general.details')}
      </Button>
    </TooltipWrapper>,
    document.getElementById('event-modal')!
  );
};
