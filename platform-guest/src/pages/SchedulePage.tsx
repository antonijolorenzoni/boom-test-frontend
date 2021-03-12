import React from 'react';
import useSWR from 'swr';
import { ScheduleWizard } from 'components/ScheduleWizard';
import { axiosBoomInstance } from 'api/axiosBoomInstance';
import { ApiPath } from 'types/ApiPath';
import { Order } from 'types/Order';
import { ApiResponse } from 'types/api-response/ApiResponse';
import { OrderStatus } from 'types/OrderStatus';
import { Redirect } from 'react-router-dom';
import { Path } from 'types/Path';

const SchedulePage: React.FC = () => {
  const orderCode = localStorage.getItem('order_code');

  const { data: orderResponse, error: orderError } = useSWR<ApiResponse<Order>>(`${ApiPath.Order}/${orderCode}`, axiosBoomInstance.get);

  const { data: rescheduleCountResponse, error: rescheduleCountError } = useSWR<ApiResponse<number>>(
    `${ApiPath.Order}/${orderCode}/business-owner-reschedule-count`,
    axiosBoomInstance.get
  );

  if (orderError || rescheduleCountError) {
    return <div>Error...</div>;
  }

  if (!orderResponse || !rescheduleCountResponse) {
    return <div>Loading...</div>;
  }

  const order: Order = orderResponse.data;
  const rescheduleCounter: number = rescheduleCountResponse.data;

  const canChangeDate: boolean =
    order.orderStatus === OrderStatus.Unscheduled || (order.orderStatus === OrderStatus.Booked && rescheduleCounter === 0);

  return canChangeDate ? <ScheduleWizard order={order} /> : <Redirect to={Path.HomePage} />;
};

export { SchedulePage };
