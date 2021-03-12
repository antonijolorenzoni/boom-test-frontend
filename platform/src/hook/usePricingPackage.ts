import useSWR from 'swr';
import { axiosBoomInstance } from 'api/instances/boomInstance';
import { PricingPackage } from 'types/PricingPackage';
import { getPricingPackage } from 'api/paths/pricing-package';

export const usePricingPackages = (condition: boolean, organizationId?: number) => {
  const { data, error, mutate } = useSWR<{ data: { content: Array<PricingPackage> } }>(
    condition && organizationId ? getPricingPackage(organizationId) : null,
    axiosBoomInstance.get
  );

  return {
    pricingPackages: data?.data?.content || [],
    error,
    mutate,
  };
};
