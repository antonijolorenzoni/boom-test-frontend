import React from 'react';
import { Typography } from 'ui-boom-components';
import styled from 'styled-components';

import translations from 'translations/i18next';
import { SHOOTING_STATUSES_UI_ELEMENTS } from 'config/consts';
import { OrderStatus } from 'types/OrderStatus';

const StatusRow = styled.div<{ status: OrderStatus }>`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${(props) => (props.status ? SHOOTING_STATUSES_UI_ELEMENTS[props.status]?.color : '#66c0b0')};
`;

export const OrderStatusLegend: React.FC<{ statuses: Array<OrderStatus> }> = ({ statuses }) => (
  <>
    {statuses.map((status) => (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', marginBottom: 10 }} key={status}>
        <StatusRow status={status} />
        <div style={{ marginLeft: 15, width: '100%' }}>
          <Typography variantName="body1" style={{ marginBottom: 5 }}>
            {translations.t(`shootingStatuses.${status}`)}
          </Typography>
          <Typography variantName="body2" style={{ marginBottom: 10 }}>
            {translations.t(`shootingStatusesDescription.${status}`)}
          </Typography>
          <div style={{ borderTop: '1px solid lightgray' }} />
        </div>
      </div>
    ))}
  </>
);
