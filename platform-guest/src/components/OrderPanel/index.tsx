import React, { Dispatch, SetStateAction, useState } from 'react';
import moment from 'moment-timezone';
import qs from 'query-string';
import { Typography } from 'ui-boom-components';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';
import { useHistory } from 'react-router-dom';

import { Wrapper } from './styles';

import { OrderInfoBox } from 'components/OrderInfoBox';
import { OrderContactBox } from 'components/OrderContactBox';

import { MediaQueryBreakpoint } from 'types/MediaQueryBreakpoint';
import { Order } from 'types/Order';

import { scheduleShooting } from 'api/shootingAPI';
import { Path } from 'types/Path';

export const OrderPanel: React.FC<{
  order: Order;
  rescheduleCount: number;
  editMode: boolean;
  onSetEditMode: Dispatch<SetStateAction<boolean>>;
}> = ({ order, rescheduleCount, editMode, onSetEditMode }) => {
  const isMobileOrTablet = useMediaQuery({ query: `screen and (max-width: ${MediaQueryBreakpoint.Tablet}px)` });

  const { t } = useTranslation();

  const {
    orderStatus,
    orderType,
    company,
    businessName,
    address,
    contact,
    details,
    orderId,
    suggestedDate,
    startDate,
    timezone,
    downloadLink,
  } = order;

  const history = useHistory();

  const [scheduleLoading, setScheduleLoading] = useState(false);

  // because of delay getting the reschedule counter :'(
  const rescheduled: boolean = Object.keys(qs.parse(history.location.search)).some((k) => k === 'rescheduled');

  const scheduleOrder = async () => {
    const startDate = moment(suggestedDate).valueOf();
    try {
      setScheduleLoading(true);
      await scheduleShooting(company.organization.id, orderId, startDate);
      history.push(Path.Confirmation);
    } catch (e) {
      //TODO
    } finally {
      setScheduleLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 958, width: '100%' }}>
      <Typography
        variantName="title2"
        textColor="#ffffff"
        style={{ marginBottom: isMobileOrTablet ? 17 : 7, marginLeft: isMobileOrTablet ? 30 : 20 }}
      >
        {t('orderInfo.yourPhotoshooting').toUpperCase()}
      </Typography>
      <Wrapper>
        <OrderInfoBox
          status={orderStatus}
          type={orderType}
          photos={details.photosQuantity}
          duration={details.shootingDuration}
          downloadLink={downloadLink}
          companyName={company.name}
          startDate={(startDate || suggestedDate)!}
          timezone={timezone}
          onScheduleOrder={scheduleOrder}
          scheduleLoading={scheduleLoading}
          yetRescheduled={rescheduleCount > 0 || rescheduled}
        />
        <OrderContactBox
          orderType={orderType}
          status={orderStatus}
          nameSurname={contact.name}
          phoneNumber={contact.phone}
          additionalPhone={contact.additionalPhone}
          email={contact.email}
          address={address}
          businessName={businessName}
          editMode={editMode}
          onSetEditMode={onSetEditMode}
        />
      </Wrapper>
    </div>
  );
};
