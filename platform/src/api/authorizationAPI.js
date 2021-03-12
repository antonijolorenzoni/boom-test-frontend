//
// ────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: A P I   F O R   U S E R   A U T H E N T I C A T I O N : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import qs from 'query-string';
import { axiosBoomInstance } from './instances/boomInstance';

const clientSecret = process.env.REACT_APP_CLIENT_SECRET;

export const authenticate = (credentials) => {
  const config = {
    auth: {
      username: 'client',
      password: clientSecret,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  return axiosBoomInstance.post('/oauth/token', qs.stringify(credentials), config);
};

export const refreshToken = (refreshTkn) => {
  const config = {
    auth: {
      username: 'client',
      password: clientSecret,
    },
  };
  const credentials = `grant_type=refresh_token&client_id=client&refresh_token=${refreshTkn}`;

  return axiosBoomInstance.post('/oauth/token', credentials, config);
};
