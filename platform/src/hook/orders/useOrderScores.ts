import useSWR from 'swr';
import { axiosBoomInstance } from 'api/instances/boomInstance';
import { OrderScoresResponse } from 'types/orders/OrderScoresResponse';
import { orderScores } from 'api/paths/orders';

const createOrderScoreUrl = (condition: boolean, organizationId?: number, orderId?: number) =>
  condition && organizationId && orderId ? orderScores(organizationId, orderId) : null;

const useOrderScoresResponse = (condition: boolean, organizationId?: number, orderId?: number) =>
  useOrderScoresByUrl(createOrderScoreUrl(condition, organizationId, orderId));

const useOrderScoresByUrl = (url: string | null) => {
  const { data, error, mutate } = useSWR<{ data: OrderScoresResponse }>(url, axiosBoomInstance.get);

  return {
    orderScores: data?.data,
    error,
    mutate,
  };
};

export const useOrderScores = (condition: boolean, organizationId?: number, orderId?: number) => {
  const { orderScores, error, mutate } = useOrderScoresResponse(condition, organizationId, orderId);

  return {
    boomAverageScore: orderScores?.boomAverageScore,
    companyScore: orderScores?.companyScore,
    error,
    mutate,
  };
};
