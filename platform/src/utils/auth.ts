import moment from 'moment';

export const isTokenExpired = () =>
  !localStorage.token || !localStorage.expires_at || moment().isAfter(moment(Number(localStorage.expires_at)));
