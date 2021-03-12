//
// ────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: R E S E T   P A S S W O R D   V I E W : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────
//

import { Button, withStyles } from '@material-ui/core';
import i18next from 'i18next';
import _ from 'lodash';
import queryString from 'query-string';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { submit } from 'redux-form';
import ConfirmPasswordForm from '../../components/Forms/ReduxForms/Login/ConfirmPasswordForm';
import { LANGUAGE_LOCAL_MAP } from '../../config/consts';
import * as UserActions from '../../redux/actions/user.actions';
import * as ModalsActions from '../../redux/actions/modals.actions';
import * as UtilsActions from '../../redux/actions/utils.actions';
import translations from '../../translations/i18next';
import ExternalViewWrapper from './ExternalViewWrapper';

const styles = (theme) => ({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});

const buttonStyle = {
  backgroundColor: '#cc0033',
  borderRadius: 0,
  border: 0,
  color: 'white',
  height: 40,
  boxShadow: 'none',
  width: '50%',
  marginTop: 40,
};

class ResetPasswordView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: null,
      token: null,
    };
  }

  componentWillMount() {
    const { history } = this.props;
    const searchParameters = history && history.location && history.location.search;
    const parsedParameters = queryString.parse(searchParameters);
    if (parsedParameters && !_.isEmpty(parsedParameters)) {
      const { lang, token } = parsedParameters;
      this.setState({ lang, token });
      const platfromLanguage = LANGUAGE_LOCAL_MAP[lang].translation;
      this.onChangeLanguage(platfromLanguage);
    } else {
      history.push('/login');
    }
  }

  componentWillReceiveProps(nextProps) {
    const { selectedLanguage: currentLanguage } = this.props;
    const { selectedLanguage: nextLanguage } = nextProps;
    if (currentLanguage !== nextLanguage) this.onChangeLanguage(nextLanguage);
  }

  onChangeLanguage(language) {
    i18next.changeLanguage(language);
    this.forceUpdate();
  }

  async onConfirmPassword(registrationData) {
    const { token } = this.state;
    const { dispatch, history } = this.props;
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await dispatch(UserActions.saveUserPassword(token, registrationData.newPassword));
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('PASSWORD_SUCCESS', {
          modalType: 'MODAL_DIALOG',
          modalProps: {
            title: translations.t('modals.compliment'),
            bodyText: translations.t('login.passwordSetSuccess'),
            onConfirm: () => {
              dispatch(ModalsActions.hideModal('PASSWORD_SUCCESS'));
              history.push('/login');
            },
            confirmText: 'Login',
            hideCancel: true,
          },
        })
      );
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('PASSWORD_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('login.passwordSetError'),
          },
        })
      );
    }
  }

  render() {
    const { dispatch, classes } = this.props;
    return (
      <ExternalViewWrapper>
        <div className={classes.container}>
          <h2 className="circular-black-label" style={{ textAlign: 'left', marginBottom: 20, color: 'white' }}>
            {translations.t('login.welcomeFirstTime')}
          </h2>
          <ConfirmPasswordForm onSubmit={(loginData) => this.onConfirmPassword(loginData)} />
          <Button variant="contained" fullWidth color="primary" style={buttonStyle} onClick={() => dispatch(submit('ConfirmPasswordForm'))}>
            <h5 className="circular-black-label" style={{ fontSize: 15, margin: 0, marginTop: 2, color: 'white' }}>
              {translations.t('forms.confirm').toUpperCase()}
            </h5>
          </Button>
        </div>
      </ExternalViewWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedLanguage: state.utils.selectedLanguage,
});

export default connect(mapStateToProps)(withStyles(styles)(withRouter(ResetPasswordView)));
