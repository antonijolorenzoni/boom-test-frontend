import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Icon, Typography } from 'ui-boom-components/lib';
import * as UserActions from 'redux/actions/user.actions';
import * as ModalsActions from 'redux/actions/modals.actions';
import { primary } from 'utils/colors';

const Logout = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();

  const onUserLogout = () => {
    dispatch(
      ModalsActions.showModal('LOGOUT_MODAL', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          title: t('forms.warning'),
          bodyText: t('profile.logoutConfirm'),
          onConfirm: onUserLogoutConfirm,
        },
      })
    );
  };

  const onUserLogoutConfirm = () => {
    dispatch(ModalsActions.hideModal('LOGOUT_MODAL'));
    dispatch(UserActions.userLogout());
    history.push('/login');
  };

  return (
    <div onClick={onUserLogout} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: primary }}>
      <Typography variantName="overline" textColor={primary}>
        {t('profile.logout')}
      </Typography>
      <Icon name="power_settings_new" style={{ marginLeft: 2, fontSize: 14 }} />
    </div>
  );
};

export default Logout;
