import useSWR from 'swr';
import { axiosBoomInstance } from 'api/instances/boomInstance';
import { PricingPackage } from 'types/PricingPackage';
import { getCompanyPricingPackage } from 'api/paths/pricing-package';

export const useCompanyPricingPackage = (condition: boolean, organizationId?: number, companyId?: number) => {
  const { data, error, mutate } = useSWR<{ data: Array<PricingPackage> }>(
    condition && organizationId && companyId ? getCompanyPricingPackage(organizationId, companyId) : null,
    axiosBoomInstance.get
  );

  return {
    pricingPackages: data?.data || [],
    error,
    mutate,
  };
};
