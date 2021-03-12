import useSWR from 'swr';
import { axiosBoomInstance } from 'api/instances/boomInstance';
import { listCountries } from 'api/paths/countries';
import { ApiResponse } from 'types/ApiResponse';

export const useCountries = () => {
  const { data, error } = useSWR<ApiResponse<Array<string>>>(listCountries, axiosBoomInstance.get);
  return { countries: data?.data || [], error };
};
