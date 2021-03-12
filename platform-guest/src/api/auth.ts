import axios from 'axios';
import qs from 'query-string';
import { AuthResponse } from 'types/api-response/AuthResponse';
import { ApiPath } from 'types/ApiPath';

export const authenticate = (email: string, reservationCode: string) => {
  const clientId = process.env.REACT_APP_OAUTH_CLIENT_ID!;
  const clientSecret = process.env.REACT_APP_OAUTH_CLIENT_SECRET!;

  const config = {
    auth: {
      username: clientId,
      password: clientSecret,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  return axios.post<AuthResponse>(ApiPath.Login, qs.stringify({ email, orderCode: reservationCode, grant_type: 'order_code' }), config);
};
