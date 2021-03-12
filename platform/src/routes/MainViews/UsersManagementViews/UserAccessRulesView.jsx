//
// ────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: U S E R S   A C C E S S   R U L E S   V I E W : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────
//

import { Tab, withStyles, Paper } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import AccessRuleIcon from '@material-ui/icons/VerifiedUser';
import WarningIcon from '@material-ui/icons/Warning';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { destroy } from 'redux-form';
import UserRolesForm from '../../../components/Forms/ReduxForms/Users/UserRolesForm';
import ListComponent from '../../../components/ListComponent/ListComponent';
import AccessRuleRow from '../../../components/ListComponent/RowComponents/AccessRuleRow';
import Spinner from '../../../components/Spinner/Spinner';
import { ACCESS_RULES_TYPES, USER_ROLES } from '../../../config/consts';
import * as UsersActions from '../../../redux/actions/users.actions';
import * as UtilsActions from '../../../redux/actions/utils.actions';
import * as ModalsActions from '../../../redux/actions/modals.actions';
import translations from '../../../translations/i18next';

const styles = (theme) => ({
  container: {
    paddingTop: 0,
  },
  noUserContainer: {
    padding: 20,
    display: 'flex',
    alignItems: 'center',
  },
  noUserText: {
    margin: 0,
    color: '#7F888F',
  },
  noUserIcon: {
    fontSize: 40,
    color: '#7F888F',
    marginRight: 20,
  },
  warningContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  warningIcon: {
    marginRight: 10,
    color: '#FF8A80',
  },
});

class UserAccessRulesView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      activeTabIndex: 0,
    };
  }

  async componentWillMount() {
    await this.onFetchUserAccessRules();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(UsersActions.resetUserAccessRules());
  }

  async onFetchUserAccessRules() {
    const { dispatch } = this.props;
    try {
      this.setState({ isLoading: true });
      await dispatch(UsersActions.fetchUsersAccessRules());
      this.setState({ isLoading: false });
    } catch (error) {
      this.setState({ isLoading: false });
    }
  }

  async onAppendAccessRules(page) {
    const { dispatch } = this.props;
    try {
      this.setState({ isLoading: true });
      await dispatch(UsersActions.fetchAndAppendUsersAccessRules(page));
      this.setState({ isLoading: false });
    } catch (error) {
      this.setState({ isLoading: false });
    }
  }

  onNewAccessRuleClicked() {
    const { dispatch, roles, user } = this.props;
    dispatch(destroy('UserRolesForm'));
    dispatch(
      ModalsActions.showModal('ACCESS_RULE_FORM', {
        modalType: 'OPERATIONAL_VIEW',
        modalProps: {
          content: (
            <UserRolesForm
              user={user}
              roles={roles}
              onSubmit={(accessRuleData) => this.onCreateAccessRule(accessRuleData)}
              onDeleteAccessRule={(accessRuleData) => this.onDeleteAccessRule(accessRuleData)}
            />
          ),
        },
      })
    );
  }

  async onCreateAccessRule(accessRuleData) {
    const {
      dispatch,
      users: { selectedUser: user },
    } = this.props;
    try {
      const { company, role } = accessRuleData;
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await dispatch(UsersActions.modifyUserRoleFromAccessRule(user, accessRuleData));
      await dispatch(UsersActions.createUserAccessRule(user.id, company.value, role.value));
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(ModalsActions.hideModal('ACCESS_RULE_FORM'));
      dispatch(
        ModalsActions.showModal('USER_CREATE_ALERT', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('users.createAccessRuleSuccess'),
          },
        })
      );
      this.onTabChange(1);
    } catch (error) {
      let errorMessage = translations.t('users.userCreationError');
      if (error && error === 10402) errorMessage = translations.t('users.userAlreadyExists');
      dispatch(
        ModalsActions.showModal('USER_CREATION_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: errorMessage,
          },
        })
      );
      dispatch(UtilsActions.setSpinnerVisibile(false));
    }
  }

  onDeleteAccessRule(accessRule) {
    const { dispatch } = this.props;
    dispatch(
      ModalsActions.showModal('DETELE_ACCESS_RULE_MODAL', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          title: translations.t('forms.warning'),
          bodyText: translations.t('users.deleteAccessRuleConfirm'),
          onConfirm: () => this.onDeleteAccessRuleConfirm(accessRule),
        },
      })
    );
  }

  async onDeleteAccessRuleConfirm(accessRule) {
    const {
      dispatch,
      users: { selectedUser: user },
    } = this.props;
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await dispatch(UsersActions.deleteUserAccessRule(user.id, accessRule));
      dispatch(UtilsActions.setSpinnerVisibile(false));
      this.onFetchUserAccessRules();
      dispatch(ModalsActions.hideModal('DETELE_ACCESS_RULE_MODAL'));
      dispatch(
        ModalsActions.showModal('USER_DELETE_ACCESS_RULE_ALERT', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('users.accessRuleDeleteSuccess'),
          },
        })
      );
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(ModalsActions.hideModal('DETELE_ACCESS_RULE_MODAL'));
      dispatch(
        ModalsActions.showModal('USER_DELETE_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('users.accessRuleDeleteError'),
          },
        })
      );
    }
  }

  onTabChange(index) {
    if (index) {
      this.onFilterAccessRule('type', ACCESS_RULES_TYPES.USER);
    } else {
      this.onFilterAccessRule('type', ACCESS_RULES_TYPES.DEFAULT);
    }
    this.setState({ activeTabIndex: index });
  }

  async onFilterAccessRule(field, value) {
    const { dispatch } = this.props;
    this.setState({ isLoading: true });
    dispatch(UsersActions.resetUserAccessRules());
    dispatch(UsersActions.setAccessRulesFilter(field, value));
    await dispatch(UsersActions.fetchUsersAccessRules());
    this.setState({ isLoading: false });
  }

  render() {
    const {
      classes,
      users: {
        accessRules: { content: accessRulesData, pagination: accessRulePagination },
        selectedUser: user,
      },
      roles,
    } = this.props;
    const { isLoading, activeTabIndex } = this.state;
    return (
      <div className={classes.container}>
        {!user || _.isEmpty(user) ? (
          <div className={classes.warningContainer}>
            <WarningIcon className={classes.warningIcon} />
            <h3 className={classes.title} style={{ color: '#FF8A80' }}>
              {translations.t('forms.createUserBeforeRole')}
            </h3>
          </div>
        ) : (
          <ListComponent
            pagination={accessRulePagination}
            containerstyle={{ width: '100%' }}
            newButtonStyle={{ width: '100%', marginTop: 0 }}
            newElementText={translations.t('forms.newAccessRule')}
            onCreateNew={() => this.onNewAccessRuleClicked()}
            onLoadMore={(page) => this.onAppendAccessRules(page)}
          >
            <AppBar position="static" color="default" style={{ backgroundColor: 'white' }}>
              <Tabs
                value={activeTabIndex}
                onChange={(event, index) => this.onTabChange(index)}
                scrollable
                scrollButtons="on"
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label={translations.t(`accessRulesTypes.${ACCESS_RULES_TYPES.DEFAULT}`)} />
                <Tab label={translations.t(`accessRulesTypes.${ACCESS_RULES_TYPES.USER}`)} />
              </Tabs>
            </AppBar>
            <Paper square style={{ padding: 30 }}>
              {isLoading && (
                <Spinner
                  title={translations.t('general.loading')}
                  hideLogo
                  spinnerStyle={{ color: '#5AC0B1', marginTop: 10 }}
                  titleStyle={{ color: '#3f3f3f', marginTop: 5 }}
                />
              )}
              {_.map(_.orderBy(accessRulesData, 'companyName'), (accessRule, key) => (
                <AccessRuleRow
                  key={key}
                  accessRule={accessRule}
                  roleDetails={_.find(roles, (role) => role.id === accessRule.role.id)}
                  outerContainerstyle={{ marginTop: 15 }}
                  onDelete={() => this.onDeleteAccessRule(accessRule)}
                />
              ))}
              {(!accessRulesData || _.isEmpty(accessRulesData)) && !isLoading && (
                <div className={classes.noUserContainer}>
                  <AccessRuleIcon className={classes.noUserIcon} />
                  <h4 className={classes.noUserText}>{translations.t('users.noAccessRuleFound')}</h4>
                </div>
              )}
            </Paper>
          </ListComponent>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  users: state.users,
  roles: _.filter(state.roles, (role) => role.name !== USER_ROLES.ROLE_CONTACT_CENTER),
  companies: state.companies,
  organizations: state.organizations,
});

export default connect(mapStateToProps)(withStyles(styles)(UserAccessRulesView));
