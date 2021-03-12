import useSWR from 'swr';
import { axiosBoomInstance } from 'api/instances/boomInstance';
import { getMySmbProfile } from 'api/paths/user';
import { SmbProfile } from 'types/SmbProfile';

export const useSmbProfile = (condition: boolean) => {
  const { data, error, mutate } = useSWR<{ data: SmbProfile }>(condition ? getMySmbProfile() : null, axiosBoomInstance.get);

  return {
    smbProfile: data?.data,
    error,
    mutate,
  };
};
