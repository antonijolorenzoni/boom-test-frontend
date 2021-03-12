import moment from 'moment';
import React from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { logout } from 'utils/auth';

const PrivateRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  return (
    <Route
      {...rest}
      render={() => {
        const expiresAt = localStorage.getItem('expires_at');
        if (expiresAt && moment().valueOf() < Number(expiresAt)) {
          return children;
        }

        logout();

        window.location.replace(`${process.env.REACT_APP_PLATFORM_BASE_URL}/login?bo`);
      }}
    />
  );
};

export { PrivateRoute };
