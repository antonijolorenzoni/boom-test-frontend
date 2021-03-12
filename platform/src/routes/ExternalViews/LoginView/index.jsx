//
// ──────────────────────────────────────────────────────────── I ──────────
//   :::::: L O G I N   V I E W : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────
//

import jwt from 'jsonwebtoken';
import * as BoomInstance from 'api/instances/boomInstance';
import { useTranslation } from 'react-i18next';
import qs from 'query-string';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { submit } from 'redux-form';
import { LoginForm } from 'components/Forms/LoginForm';
import ResetPasswordForm from 'components/Forms/ReduxForms/Login/ResetPasswordForm';
import * as UserActions from 'redux/actions/user.actions';
import * as UtilsActions from 'redux/actions/utils.actions';
import * as ModalsActions from 'redux/actions/modals.actions';
import ExternalViewWrapper from '../ExternalViewWrapper';

import { LoginSelectionWrapper, VerticalDivider } from './styles';
import { authenticate } from 'api/authorizationAPI';

const LoginView = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const [isBoLoginSelected, setIsBoLoginSelected] = useState(Object.keys(qs.parse(history.location.search)).some((k) => k === 'bo'));

  const loginSubmit = async (username, password) => {
    dispatch(UtilsActions.setSpinnerVisibile(true));

    try {
      BoomInstance.interceptorEjectRequest();
      const authResponse = await authenticate({ username, password, grant_type: 'password' });

      if (authResponse.data) {
        const { access_token } = authResponse.data;
        BoomInstance.setRequestInterceptor(access_token);
        const decodedJWT = jwt.decode(access_token);

        localStorage.setItem('token', access_token);
        localStorage.setItem('expires_at', decodedJWT.exp * 1000);

        dispatch(UtilsActions.setSpinnerVisibile(false));
        history.push('/');
      }
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('LOGIN_ERROR_MODAL', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: t('login.loginError'),
          },
        })
      );
    }
  };

  const boLoginSubmit = async (email, orderCode) => {
    try {
      const result = await authenticate({ email, orderCode, grant_type: 'order_code' });
      window.location.replace(
        `${process.env.REACT_APP_PLATFORM_GUEST_BASE_URL}/auth?token=${result.data.access_token}&resCode=${orderCode}`
      );
    } catch (err) {
      dispatch(
        ModalsActions.showModal('LOGIN_ERROR_MODAL', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: t('login.loginError'),
          },
        })
      );
    }
  };

  const onResetPasswordSubmit = async (userPasswordResetData) => {
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await dispatch(UserActions.recoverUserPassword(userPasswordResetData.username));
      dispatch(ModalsActions.hideModal('RESET_PASSWORD'));
      dispatch(
        ModalsActions.showModal('RESET_PASSWORD_SUCCESS', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: t('login.resetPasswordSuccess'),
          },
        })
      );
      dispatch(UtilsActions.setSpinnerVisibile(false));
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('RESET_PASSWORD_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: t('login.resetPasswordError'),
          },
        })
      );
    }
  };

  const openPasswordRecovery = () => {
    dispatch(
      ModalsActions.showModal('RESET_PASSWORD', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          title: t('login.passwordRecovery'),
          content: <ResetPasswordForm onSubmit={onResetPasswordSubmit} />,
          bodyText: t('login.passwordRecoveryBody'),
          onConfirm: () => dispatch(submit('ResetPasswordForm')),
          confirmText: t('modals.confirm'),
        },
      })
    );
  };

  return (
    <ExternalViewWrapper>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <span
          className="circular-black-label"
          style={{
            textAlign: 'left',
            fontWeight: 700,
            fontSize: 32,
            color: 'white',
          }}
        >
          {t('login.welcome')}
        </span>
        <LoginSelectionWrapper>
          <span
            data-testid="have-account"
            style={{ color: isBoLoginSelected ? '#a3abb1' : '#FFFFFF' }}
            onClick={(_) => {
              history.push({
                pathname: '/login',
              });
              setIsBoLoginSelected(false);
            }}
          >
            {t('login.haveAccount')}
          </span>
          <VerticalDivider />
          <span
            data-testid="have-order-code"
            style={{ color: isBoLoginSelected ? '#FFFFFF' : '#a3abb1' }}
            onClick={(_) => {
              history.push({
                pathname: '/login',
                search: '?bo',
              });
              setIsBoLoginSelected(true);
            }}
          >
            {t('login.haveOrderCode')}
          </span>
        </LoginSelectionWrapper>
        <LoginForm
          onLoginSubmit={loginSubmit}
          onBoLoginSubmit={boLoginSubmit}
          onOpenPasswordRecovery={openPasswordRecovery}
          boLogin={isBoLoginSelected}
        />

        <div style={{ height: 50 }}>
          {!isBoLoginSelected && (
            <h4
              className="circular-book-label"
              onClick={(_) => openPasswordRecovery()}
              style={{
                cursor: 'pointer',
                marginTop: 10,
                marginBottom: 6,
                fontSize: 16,
                color: '#80888F',
              }}
            >
              {t('login.passwordRecovery')}
            </h4>
          )}
          {isBoLoginSelected && (
            <span
              style={{
                position: 'relative',
                bottom: -10,
                fontSize: 11,
                color: '#ffffff',
              }}
            >
              {t('login.boOrdeCodeInfo')}
            </span>
          )}
        </div>
      </div>
    </ExternalViewWrapper>
  );
};

export { LoginView };
