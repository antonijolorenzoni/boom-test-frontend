//
// ────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: C O N F I R M   R E G I S T R A T I O N   V I E W : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────
//

import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import i18next from 'i18next';
import _ from 'lodash';
import queryString from 'query-string';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { submit } from 'redux-form';
import RegistrationForm from '../../components/Forms/ReduxForms/Login/RegistrationForm';
import { LANGUAGE_LOCAL_MAP } from '../../config/consts';
import * as UserActions from '../../redux/actions/user.actions';
import translations from '../../translations/i18next';
import ExternalViewWrapper from './ExternalViewWrapper';

const buttonStyle = {
  backgroundColor: '#cc0033',
  borderRadius: 0,
  border: 0,
  color: 'white',
  height: 40,
  boxShadow: 'none',
  width: '50%',
  marginTop: 10,
};

const styles = (theme) => ({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});

class ConfirmRegistrationView extends React.Component {
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

  async onConfirmRegistration(registrationData) {
    const { token } = this.state;
    const { dispatch, history } = this.props;

    await dispatch(UserActions.confirmUserRegistration(token, registrationData.newPassword, history));
  }

  render() {
    const { dispatch, classes } = this.props;
    return (
      <ExternalViewWrapper containerStyle={{ marginTop: -15 }}>
        <div className={classes.container}>
          <h2 className="circular-black-label" style={{ textAlign: 'left', marginBottom: 20, color: 'white' }}>
            {translations.t('login.welcomeFirstTime')}
          </h2>
          <RegistrationForm onSubmit={(loginData) => this.onConfirmRegistration(loginData)} />
          <Button variant="contained" fullWidth color="primary" style={buttonStyle} onClick={() => dispatch(submit('RegistrationForm'))}>
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

export default connect(mapStateToProps)(withStyles(styles)(withRouter(ConfirmRegistrationView)));
