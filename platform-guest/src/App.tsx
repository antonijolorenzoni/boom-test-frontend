import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import React, { useContext } from 'react';
import { AnimatePresence } from 'framer-motion';

import { Path } from 'types/Path';
import { HomePage } from 'pages/HomePage';
import { ErrorPage } from 'pages/ErrorPage';
import { IntroWizardPage } from 'pages/IntroWizardPage';
import { MainLayout } from 'components/MainLayout';

import { PrivateRoute } from 'components/PrivateRoute';
import { AuthRedirect } from 'components/AuthRedirect';
import { EmailAuthRedirect } from 'components/EmailAuthRedirect';
import { NotFoundPage } from 'pages/NotFoundPage';
import { ConfirmationPage } from 'pages/ConfirmationPage';
import { SchedulePage } from 'pages/SchedulePage';
import { LanguageSelector } from 'components/LanguageSelector';
import { IsLanguageSelectorToggledContext } from 'contexts/IsLanguageSelectorToggledContext';

const App: React.FC = () => {
  const { toggled, setToggled } = useContext(IsLanguageSelectorToggledContext);

  return (
    <Router>
      <Switch>
        <Route path={Path.ErrorPage} component={ErrorPage} />
        <Route path={Path.Auth} component={AuthRedirect} />
        <Route path={Path.EmailAuth} component={EmailAuthRedirect} />
        <Route path={Path.NotFound} component={NotFoundPage} />
        <PrivateRoute path={Path.WelcomeWizard}>
          <AnimatePresence>{toggled && <LanguageSelector onClose={setToggled} />}</AnimatePresence>
          <IntroWizardPage />
        </PrivateRoute>
        <PrivateRoute path={Path.Schedule}>
          <SchedulePage />
        </PrivateRoute>
        <PrivateRoute path={Path.HomePage}>
          <AnimatePresence>{toggled && <LanguageSelector onClose={setToggled} />}</AnimatePresence>
          <MainLayout style={{ width: '100vw', height: '100vh', background: '#5ac0b1', color: '#ffffff' }}>
            <Switch>
              <PrivateRoute exact path="/">
                <HomePage />
              </PrivateRoute>
              <PrivateRoute path={Path.Confirmation}>
                <ConfirmationPage />
              </PrivateRoute>
              <Route path="*">
                <Redirect to="/404" />
              </Route>
            </Switch>
          </MainLayout>
        </PrivateRoute>
      </Switch>
    </Router>
  );
};

export default App;
