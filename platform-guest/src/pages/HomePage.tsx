import React, { useState } from 'react';
import useSWR from 'swr';
import { Redirect } from 'react-router-dom';

import { axiosBoomInstance } from 'api/axiosBoomInstance';
import { ApiResponse } from 'types/api-response/ApiResponse';
import { ApiPath } from 'types/ApiPath';
import { Order } from 'types/Order';
import { Path } from 'types/Path';
import { OrderPanel } from 'components/OrderPanel';
import { EditPanel } from 'components/EditPanel';

const HomePage: React.FC = () => {
  const isWizardCompleted: boolean = Boolean(localStorage.getItem('wizard_completed'));
  const orderCode = localStorage.getItem('order_code');
  const { data: orderResponse, error: orderError } = useSWR<ApiResponse<Order>>(`${ApiPath.Order}/${orderCode}`, axiosBoomInstance.get);

  const { data: rescheduleCountResponse, error: rescheduleCountError } = useSWR<ApiResponse<number>>(
    `${ApiPath.Order}/${orderCode}/business-owner-reschedule-count`,
    axiosBoomInstance.get
  );

  const [editMode, setEditMode] = useState<boolean>(false);

  if (!isWizardCompleted) {
    return <Redirect to={`${Path.WelcomeWizard}`} />;
  }

  if (orderError || rescheduleCountError) {
    return <div>Error...</div>;
  }

  if (!orderResponse || !rescheduleCountResponse) {
    return <div>Loading...</div>;
  }

  const order = orderResponse.data;

  return editMode ? (
    <EditPanel order={order} onSetEditMode={setEditMode} />
  ) : (
    <OrderPanel order={order} rescheduleCount={rescheduleCountResponse.data} editMode={editMode} onSetEditMode={setEditMode} />
  );
};

export { HomePage };
