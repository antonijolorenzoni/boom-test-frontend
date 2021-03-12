import React from 'react';
import { FreeLayout } from '../FreeLayout';
import { AuthRoute, AuthRouteProps } from './AuthRoute';

export const PrivateFreeLayoutRoute: React.FC<AuthRouteProps> = ({ render, children, ...rest }) =>
  children ? (
    <AuthRoute {...rest}>
      <FreeLayout>{children}</FreeLayout>
    </AuthRoute>
  ) : (
    <AuthRoute {...rest} render={(props) => (render ? <FreeLayout>{render(props)}</FreeLayout> : null)} />
  );
