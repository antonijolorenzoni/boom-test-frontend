import useSWR from 'swr';
import { axiosBoomInstance } from 'api/instances/boomInstance';
import { getOrganization } from 'api/paths/organization';
import { Organization } from 'types/Organization';

export const useOrganization = (condition: boolean, organizationId?: number) => {
  const { data, error, mutate } = useSWR<{ data: Organization }>(
    condition && organizationId ? getOrganization(organizationId) : null,
    axiosBoomInstance.get
  );

  return {
    organization: data?.data,
    error,
    mutate,
  };
};
