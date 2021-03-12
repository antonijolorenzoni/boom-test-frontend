import useSWR from 'swr';
import { axiosBoomInstance } from 'api/instances/boomInstance';
import { CreditCardData } from 'types/CreditCardData';
import { getPaymentMethodById } from 'api/paths/payments';

export const usePaymentMethodById = (condition: boolean, params: { companyId?: number; paymentMethodId?: string }) => {
  const { data, error, mutate } = useSWR<{ data: CreditCardData }>(
    condition && params.companyId && params.paymentMethodId ? getPaymentMethodById(params.paymentMethodId, params.companyId) : null,
    axiosBoomInstance.get
  );

  return {
    paymentMethod: data?.data,
    error,
    mutate,
  };
};
