import React, { useEffect, useState } from 'react';
import qs from 'query-string';
import moment from 'moment';
import { Redirect } from 'react-router-dom';
import { Path } from 'types/Path';
import { authenticate } from 'api/auth';
import i18n from 'i18n';

const EmailAuthRedirect: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean | null>(null);
  const [areMissingParams, setAreMissingParams] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    const queryParams = qs.parse(window.location.search);
    const email = queryParams.email as string | null;
    const reservationCode = queryParams.resCode as string | null;

    if (email && reservationCode) {
      authenticate(email, reservationCode)
        .then((result) => {
          const expiresIn = result.data.expires_in;
          const language = result.data.language;
          const expiresAt = moment().add(expiresIn, 'seconds').valueOf();
          const orderCode = reservationCode.split('_')[0];

          localStorage.setItem('expires_at', String(expiresAt));
          localStorage.setItem('access_token', result.data.access_token);
          localStorage.setItem('order_code', orderCode);

          i18n.changeLanguage(language);
        })
        .catch(() => {
          window.location.replace(`${process.env.REACT_APP_PLATFORM_BASE_URL}/login?bo`);
        })
        .finally(() => setIsLoading(false));
    } else {
      setAreMissingParams(true);
    }
  }, []);

  if (areMissingParams) {
    return <Redirect to={Path.ErrorPage} />;
  }

  if (isLoading === null || isLoading) {
    return <div>Loading...</div>;
  }

  if (localStorage.getItem('access_token')) {
    return <Redirect to={Path.HomePage} />;
  }

  return <Redirect to={Path.ErrorPage} />;
};

export { EmailAuthRedirect };
