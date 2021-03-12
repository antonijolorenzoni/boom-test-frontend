//
// ────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: U S E R   D E T A I L S   V I E W : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────
//

import { Paper, Tab, withStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import _ from 'lodash';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import UsersIcon from '@material-ui/icons/AssignmentInd';
import UserRoleIcon from '@material-ui/icons/VerifiedUser';
import React from 'react';
import { connect } from 'react-redux';
import translations from '../../../translations/i18next';
import UserForm from '../../../components/Forms/ReduxForms/Users/UserForm';
import UserAccessRulesView from './UserAccessRulesView';
import AbilityProvider from '../../../utils/AbilityProvider';
import { PERMISSIONS, PERMISSION_ENTITIES } from '../../../config/consts';

const styles = (theme) => ({
  formContainer: {
    margin: 20,
    marginTop: 20,
    paddingTop: 20,
  },
  innerContainer: {
    padding: 20,
    marginTop: 7,
  },
  title: {
    marginTop: 0,
  },
});

const theme = createMuiTheme({
  palette: {
    primary: { 500: '#5AC0B1' },
    secondary: { main: '#CC0033' },
  },
});

class UserDetailsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabIndex: 0,
    };
  }

  onTabChange(value) {
    this.setState({ activeTabIndex: value });
  }

  render() {
    const {
      classes,
      users: { selectedUser: user },
      roles,
      companies,
      onUserFormSubmit,
      onDeleteUser,
      onResendConfirmationEmail,
    } = this.props;
    const { activeTabIndex } = this.state;
    const canEditACL = AbilityProvider.getCompanyAbilityHelper().hasPermission([PERMISSIONS.ACL], PERMISSION_ENTITIES.USER);
    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.formContainer}>
          <h4 className={classes.title}>
            {user && !_.isEmpty(user) ? translations.t('forms.userData') : translations.t('users.createNewUser')}
          </h4>
          <AppBar position="static" color="default" style={{ backgroundColor: 'white' }}>
            <Tabs
              value={activeTabIndex}
              onChange={(event, index) => this.onTabChange(index)}
              scrollable
              scrollButtons="on"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label={translations.t('forms.userData')} icon={<UsersIcon />} />
              {canEditACL && <Tab label={translations.t('forms.userAccessRules')} icon={<UserRoleIcon />} />}
            </Tabs>
          </AppBar>
          <Paper square className={classes.innerContainer}>
            {activeTabIndex === 0 && (
              <UserForm
                user={user}
                roles={roles}
                onResendConfirmationEmail={(userId) => onResendConfirmationEmail(userId)}
                onSubmit={(userData) => onUserFormSubmit(userData)}
                onDeleteUser={() => onDeleteUser()}
              />
            )}
            {activeTabIndex === 1 && <UserAccessRulesView user={user} roles={roles} companies={companies} />}
          </Paper>
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = (state) => ({
  form: state.form.UserForm,
  users: state.users,
});

export default connect(mapStateToProps)(withStyles(styles)(UserDetailsView));
