import axios from 'axios';
import qs from 'query-string';

const axiosBoomInstance = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/api/v1`,
  paramsSerializer: (par) => qs.stringify(par, { encode: false }),
});

axiosBoomInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export { axiosBoomInstance };
