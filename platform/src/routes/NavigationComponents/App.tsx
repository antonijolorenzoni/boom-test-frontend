import 'moment/locale/it';
import React from 'react';
import { Switch, useHistory, useLocation } from 'react-router-dom';

import { LoginView } from '../ExternalViews/LoginView';
import CalendarView from '../MainViews/ShootingsManagementViews/CalendarView';
import ConfirmRegistrationView from '../ExternalViews/ConfirmRegistrationView';
import { ConfirmChangePasswordView } from '../ExternalViews/ConfirmChangePasswordView';
import ResetPasswordView from '../ExternalViews/ResetPasswordView';
import UsersView from '../MainViews/UsersManagementViews/UsersView';
import RootCompaniesView from '../MainViews/CompaniesManagementView/RootCompaniesView';
import CompanyTabbedView from '../MainViews/CompaniesManagementView/CompanyTabbedView';
import UsersCompaniesSelectorView from '../MainViews/UsersManagementViews/UsersCompaniesSelectorView';
import PhotographersView from '../MainViews/PhotographersManagementViews/PhotographersView';
import PhotographerProfileView from '../ProfilesViews/PhotographerProfileView';
import UserProfileView from '../ProfilesViews/UserProfileView';
import DownloadView from '../MainViews/ShootingsManagementViews/DownloadView';
import PhotographerOnBoarding from '../MainViews/PhotographerOnBoarding';
import ActivitiesView from '../MainViews/ShootingsManagementViews/ActivitiesView';
import NotificationsView from '../MainViews/NotificationsView';
import ShootingDetails from '../MainViews/ShootingsManagementViews/ShootingDetails';
import PhotographerAccountingView from '../MainViews/PhotographersManagementViews/PhotographerAccountingView';
import ShootingsEmptyView from '../MainViews/ShootingsManagementViews/ShootingsEmptyView';
import { GoogleAuthInfoPage } from '../MainViews/GoogleAuthInfoPage';
import { featureFlag } from '../../config/featureFlags';
import { publicRoutes } from '../../config/consts';
import { DashboardPage } from '../MainViews/DashboardPage';
import { CompleteSubscriptionPage } from '../MainViews/CompleteSubscriptionPage';
import { ReactivateSubscriptionPage } from '../MainViews/CompleteSubscriptionPage/ReactivateSubscriptionPage';
import BaseAlert from 'components/Modals/BaseAlert';
import { useInitialData } from 'hook/useInitialData';
import { BoomLoadingOverlay } from 'ui-boom-components';
import { isTokenExpired } from 'utils/auth';
import { useWhoAmI } from 'hook/useWhoAmI';
import { PublicFreeLayoutRoute } from 'routes/NavigationComponents/routes/PublicFreeLayoutRoute';
import { PrivateHeaderLayoutRoute } from './routes/PrivateHeaderLayoutRoute';
import { PrivateFreeLayoutRoute } from './routes/PrivateFreeLayoutRoute';
import { useIsUserEnabled } from 'components/Permission/ShowFor';
import { Permission } from 'types/Permission';

const App: React.FC = () => {
  const [isFeatureFlagLoading, setIsFeatureFlagLoading] = React.useState(true);
  const history = useHistory();
  const location = useLocation();

  const { isPhotographer, isCcUser, isSMB } = useWhoAmI();

  React.useEffect(() => {
    featureFlag.updateFeatures().then(() => {
      setIsFeatureFlagLoading(false);
      featureFlag.schedule();
    });

    return () => featureFlag.unschedule();
  }, []);

  React.useEffect(() => {
    if (!publicRoutes.includes(location.pathname) && isTokenExpired()) {
      localStorage.clear();
      history.push('/login');
    }
  }, [history, location]);

  const isLoading = useInitialData();
  const canReadAndCreateUser = useIsUserEnabled([Permission.UserRead, Permission.UserCreate]) || isCcUser;
  const canReadAndCreatePhotographer = useIsUserEnabled([Permission.PhotographerRead, Permission.PhotographerCreate]);

  return isFeatureFlagLoading ? (
    <BoomLoadingOverlay />
  ) : (
    <>
      <Switch>
        <PublicFreeLayoutRoute path="/login" component={LoginView} />
        <PublicFreeLayoutRoute path="/setPassword" component={ConfirmRegistrationView} />
        <PublicFreeLayoutRoute path="/insertResetPassword" component={ResetPasswordView} />
        <PublicFreeLayoutRoute path="/changeMail" component={ConfirmChangePasswordView} />
        {isLoading ? (
          <BoomLoadingOverlay />
        ) : (
          <>
            <PrivateHeaderLayoutRoute path="/" exact>
              {!isPhotographer ? <DashboardPage /> : <CalendarView />}
            </PrivateHeaderLayoutRoute>
            <PrivateHeaderLayoutRoute path="/calendar" exact>
              {!isPhotographer ? <DashboardPage /> : <CalendarView />}
            </PrivateHeaderLayoutRoute>
            <PrivateHeaderLayoutRoute path="/notifications">
              <NotificationsView />
            </PrivateHeaderLayoutRoute>
            {!isCcUser && (
              <PrivateHeaderLayoutRoute path="/shootingsActivities">
                <ActivitiesView />
              </PrivateHeaderLayoutRoute>
            )}
            {!isCcUser && (
              <PrivateHeaderLayoutRoute path="/shootingDetails">
                <ShootingDetails />
              </PrivateHeaderLayoutRoute>
            )}
            <PrivateHeaderLayoutRoute path="/profile">
              <UserProfileView />
            </PrivateHeaderLayoutRoute>
            <PrivateHeaderLayoutRoute path="/myProfile">
              <PhotographerProfileView />
            </PrivateHeaderLayoutRoute>
            {!isPhotographer && (
              <PrivateHeaderLayoutRoute path="/rootCompanies">
                <RootCompaniesView />
              </PrivateHeaderLayoutRoute>
            )}
            {!isCcUser && (
              <PrivateHeaderLayoutRoute path="/companies">
                <CompanyTabbedView />
              </PrivateHeaderLayoutRoute>
            )}
            {canReadAndCreateUser && (
              <PrivateHeaderLayoutRoute path="/usersRootCompanies">
                <UsersCompaniesSelectorView />
              </PrivateHeaderLayoutRoute>
            )}
            {canReadAndCreateUser && (
              <PrivateHeaderLayoutRoute path="/users">
                <UsersView />
              </PrivateHeaderLayoutRoute>
            )}
            {canReadAndCreatePhotographer && (
              <PrivateHeaderLayoutRoute path="/photographers">
                <PhotographersView />
              </PrivateHeaderLayoutRoute>
            )}
            {isPhotographer && (
              <PrivateFreeLayoutRoute path="/photographerOnboarding">
                <PhotographerOnBoarding />
              </PrivateFreeLayoutRoute>
            )}
            {isPhotographer && (
              <PrivateHeaderLayoutRoute path="/download">
                <DownloadView />
              </PrivateHeaderLayoutRoute>
            )}
            {!isCcUser && (
              <PrivateHeaderLayoutRoute path="/photographerAccounting">
                <PhotographerAccountingView />
              </PrivateHeaderLayoutRoute>
            )}
            <PrivateHeaderLayoutRoute path="/shootingEmptyView">
              <ShootingsEmptyView />
            </PrivateHeaderLayoutRoute>
            <PublicFreeLayoutRoute path="/why-google-auth">
              <GoogleAuthInfoPage />
            </PublicFreeLayoutRoute>
            {isSMB && (
              <>
                <PrivateFreeLayoutRoute path="/complete-subscription">
                  <CompleteSubscriptionPage />
                </PrivateFreeLayoutRoute>
                <PrivateFreeLayoutRoute path="/subscription">
                  <ReactivateSubscriptionPage />
                </PrivateFreeLayoutRoute>
              </>
            )}
          </>
        )}
      </Switch>
      <BaseAlert />
    </>
  );
};

export default App;
