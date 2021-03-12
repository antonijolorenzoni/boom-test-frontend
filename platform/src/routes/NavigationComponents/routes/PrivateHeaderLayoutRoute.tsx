import React from 'react';
import { RouteProps } from 'react-router-dom';
import { HeaderLayout } from '../HeaderLayout';
import { AuthRoute } from './AuthRoute';

export const PrivateHeaderLayoutRoute: React.FC<RouteProps> = ({ render, children, ...rest }) =>
  children ? (
    <AuthRoute {...rest}>
      <HeaderLayout>{children}</HeaderLayout>
    </AuthRoute>
  ) : (
    <AuthRoute {...rest} render={(props: any) => (render ? <HeaderLayout>{render(props)}</HeaderLayout> : null)} />
  );
