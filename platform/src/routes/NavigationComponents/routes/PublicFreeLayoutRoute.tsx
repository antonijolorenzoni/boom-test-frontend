import React from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { FreeLayout } from '../FreeLayout';

export const PublicFreeLayoutRoute: React.FC<RouteProps> = (props) => (
  <FreeLayout>
    <Route {...props} />
  </FreeLayout>
);
