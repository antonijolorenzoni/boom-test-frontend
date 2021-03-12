import { verifyChangeEmail } from 'api/userAPI';
import React, { useState, useEffect } from 'react';
import qs from 'query-string';
import { Redirect } from 'react-router-dom';
import i18next from 'i18next';

import * as ModalsActions from '../../redux/actions/modals.actions';
import * as UserActions from '../../redux/actions/user.actions';

import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { LANGUAGE_LOCAL_MAP } from 'config/consts';

export const ConfirmChangePasswordView = () => {
  const [waitingResponse, setWaitingResponse] = useState(null);

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const queryParams = qs.parse(window.location.search);
  const token = queryParams.token;
  const language = queryParams.lang;

  useEffect(() => {
    const sendRequestChangeEmail = async () => {
      try {
        setWaitingResponse(true);
        dispatch(UserActions.userLogout());
        await verifyChangeEmail({ token });
        dispatch(
          ModalsActions.showModal('PACKAGE_CREATION_ERROR', {
            modalType: 'SUCCESS_ALERT',
            modalProps: {
              message: t('login.successChangeMail'),
            },
          })
        );
      } catch (error) {
        dispatch(
          ModalsActions.showModal('CHANGE_EMAIL_ERROR', {
            modalType: 'ERROR_ALERT',
            modalProps: {
              message: t('login.errorChangeMail'),
            },
          })
        );
      }
      setWaitingResponse(false);
    };
    if (token) {
      const languageKey = LANGUAGE_LOCAL_MAP[language].key;
      i18next.changeLanguage(languageKey);
      sendRequestChangeEmail();
    }
  }, [token, dispatch, t, language]);

  return !token || !waitingResponse ? <Redirect to="/login" /> : null;
};
