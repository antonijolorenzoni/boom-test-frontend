import { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { useHistory, useLocation } from 'react-router-dom';
import { includes } from 'lodash';
import { useDispatch } from 'react-redux';

import { publicRoutes, USER_ROLES } from 'config/consts';
import {
  fetchPersonalOrganizationAccessRule,
  fetchPhotoTypes,
  fetchUser,
  saveUserData,
  setSmbSubscriptionStatus,
} from 'redux/actions/user.actions';
import { getPlatformCurrencies, getUserPermissionsWithinOrganization } from 'redux/actions/utils.actions';
import AbilityProvider from 'utils/AbilityProvider';
import { fetchRolesAndPermissions } from 'redux/actions/roles.actions';
import { fetchUserPhotographer } from 'redux/actions/photographers.actions';
import { isTokenExpired } from 'utils/auth';
import { axiosBoomInstance } from 'api/instances/boomInstance';
import { getMySmbProfile } from 'api/paths/user';
import { getSubscription } from 'api/paths/payments';

enum InitialDataFetched {
  NOT_STARTED,
  LOADING,
  DONE,
}

export const useInitialData = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const [loading, setLoading] = useState<InitialDataFetched>(InitialDataFetched.NOT_STARTED);

  useEffect(() => {
    if (publicRoutes.includes(location.pathname)) {
      setLoading(InitialDataFetched.NOT_STARTED);
    }
  }, [location]);

  useEffect(() => {
    const fetchAll = async () => {
      if (!isTokenExpired()) {
        const decodedJWT = jwt.decode(localStorage.token) as Record<string, string>;
        dispatch(saveUserData(decodedJWT || {}, false));

        const { organization, authorities } = decodedJWT;
        if (authorities && includes(decodedJWT.authorities, USER_ROLES.ROLE_PHOTOGRAPHER)) {
          await dispatch(fetchUserPhotographer());
        } else {
          await dispatch(fetchUser());
        }

        await dispatch(fetchRolesAndPermissions());
        await dispatch(fetchPhotoTypes());
        await dispatch(getPlatformCurrencies());
        await dispatch(fetchPersonalOrganizationAccessRule(organization));

        const rolePermissions = dispatch(getUserPermissionsWithinOrganization());
        const abilityProviderHelper = AbilityProvider.getOrganizationAbilityHelper();

        abilityProviderHelper.updateAbilities(rolePermissions as any);

        if (authorities.includes(USER_ROLES.ROLE_SMB)) {
          const smbProfileResult = await axiosBoomInstance.get(getMySmbProfile());
          const smbSubscriptionResult = await axiosBoomInstance.get(getSubscription(smbProfileResult.data?.companyId));
          dispatch(setSmbSubscriptionStatus(smbSubscriptionResult.data?.subscriptionStatus));
        }
      } else {
        localStorage.clear();
        history.push('/login');
      }
    };

    if (loading === InitialDataFetched.NOT_STARTED && !publicRoutes.includes(location.pathname)) {
      setLoading(InitialDataFetched.LOADING);
      fetchAll().finally(() => {
        // in finally because SMB user do not have a subscription maybe (404), that is fine :)
        setLoading(InitialDataFetched.DONE);
      });
    }
  }, [dispatch, history, location, loading]);

  return [InitialDataFetched.NOT_STARTED, InitialDataFetched.LOADING].includes(loading);
};
