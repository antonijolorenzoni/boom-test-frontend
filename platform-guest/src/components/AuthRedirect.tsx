import React from 'react';
import qs from 'query-string';
import { Redirect } from 'react-router-dom';
import { Path } from 'types/Path';

import jwt from 'jsonwebtoken';
import i18n from 'i18n';

const AuthRedirect: React.FC = () => {
  const queryParams = qs.parse(window.location.search);
  const token = queryParams.token as string | null;
  const reservationCode = queryParams.resCode as string | null;

  if (token && reservationCode) {
    const decodedToken = jwt.decode(token) as { [key: string]: any } | null;
    const orderCode = reservationCode.split('_')[0];

    if (!decodedToken) {
      return <Redirect to={Path.ErrorPage} />;
    }

    const exp = decodedToken.exp * 1000;
    const language = decodedToken.language;

    localStorage.setItem('expires_at', String(exp));
    localStorage.setItem('access_token', token);
    localStorage.setItem('order_code', orderCode);

    i18n.changeLanguage(language);

    return <Redirect to={Path.HomePage} />;
  }

  return <Redirect to={Path.ErrorPage} />;
};

export { AuthRedirect };
