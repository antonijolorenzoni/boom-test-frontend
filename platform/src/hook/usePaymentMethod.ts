import useSWR from 'swr';
import { axiosBoomInstance } from 'api/instances/boomInstance';
import { CreditCardData } from 'types/CreditCardData';
import { getPaymentMethod } from 'api/paths/payments';

export const usePaymentMethod = (condition: boolean, companyId?: number) => {
  const { data, error, mutate } = useSWR<{ data: CreditCardData }>(
    condition && companyId ? getPaymentMethod(companyId) : null,
    axiosBoomInstance.get
  );

  return {
    paymentMethod: data?.data,
    error,
    mutate,
  };
};
