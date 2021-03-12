import React, { useEffect } from 'react';
import { Route, Redirect, useHistory, useLocation, RouteProps } from 'react-router-dom';
import jwt from 'jsonwebtoken';

import { featureFlag } from 'config/featureFlags';
import { isTokenExpired } from 'utils/auth';
import { useSelector } from 'react-redux';
import { USER_ROLES, publicRoutes } from 'config/consts';
import { includes } from 'lodash';
import { SubscriptionStatus } from 'types/SubscriptionStatus';

export type AuthRouteProps = RouteProps & { onFlag?: Array<string> };

export const AuthRoute: React.FC<AuthRouteProps> = ({ onFlag, ...rest }) => {
  const user = useSelector((state: any) => state.user);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (localStorage.token) {
      const decodedJWT = jwt.decode(localStorage.token) as Record<string, string>;
      const isSMB = includes(decodedJWT.authorities, USER_ROLES.ROLE_SMB);

      if (isSMB) {
        if (!user.subscriptionStatus) {
          history.push('/complete-subscription');
        } else if (user.subscriptionStatus === SubscriptionStatus.UNSUBSCRIBED && location.pathname !== '/subscription') {
          history.push('/profile');
        }
      }
    }
  }, [history, location.pathname, user.subscriptionStatus]);

  // photographer checks
  useEffect(() => {
    if (!publicRoutes.includes(location.pathname)) {
      try {
        const userData = user.data;
        const { isPhotographer, address } = userData;

        if (location.pathname !== '/photographerOnBoarding' && isPhotographer && (!address || !address.placeId)) {
          history.push('/photographerOnBoarding');
        }
      } catch (error) {
        history.push('/login');
      }
    }
  }, [history, user, location.pathname]);

  if (onFlag && !featureFlag.isFeatureEnabled(onFlag)) {
    return <Redirect to="/" />;
  }

  return !isTokenExpired() ? <Route {...rest} /> : <Redirect to="/login" />;
};
