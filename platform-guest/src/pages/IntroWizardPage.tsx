import React from 'react';
import useSWR from 'swr';
import { IntroWizard } from 'components/IntroWizard';
import { axiosBoomInstance } from 'api/axiosBoomInstance';
import { ApiPath } from 'types/ApiPath';
import { Order } from 'types/Order';
import { ApiResponse } from 'types/api-response/ApiResponse';

const IntroWizardPage: React.FC = () => {
  const orderCode = localStorage.getItem('order_code');

  const { data: orderResponse, error } = useSWR<ApiResponse<Order>>(`${ApiPath.Order}/${orderCode}`, axiosBoomInstance.get);

  if (error) {
    return <div>Error...</div>;
  }

  if (!orderResponse) {
    return <div>Loading...</div>;
  }

  const order = orderResponse.data;

  return <IntroWizard orderType={order.orderType} companyName={order.company.name} />;
};

export { IntroWizardPage };
