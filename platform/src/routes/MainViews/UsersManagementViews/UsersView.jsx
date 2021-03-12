//
// ────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: U S E R S   M A N A G E M E N T   V I E W : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────
//

import { Paper, Tab, withStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import ActiveUsersIcon from '@material-ui/icons/HowToReg';
import DisabledUsersIcon from '@material-ui/icons/PersonAddDisabled';
import UsersIcon from '@material-ui/icons/SupervisedUserCircle';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { destroy, initialize } from 'redux-form';
import CSVButton from 'components/CSVButton/CSVButton';
import NewUserForm from 'components/Forms/ReduxForms/Users/NewUserForm';
import NewUserCcForm from 'components/Forms/ReduxForms/Users/NewUserCcForm';
import ListComponent from 'components/ListComponent/ListComponent';
import UserRow from 'components/ListComponent/RowComponents/UserRow';
import Permission from 'components/Permission/Permission';
import Spinner from 'components/Spinner/Spinner';
import { OrganizationTier, PERMISSIONS, PERMISSION_ENTITIES, USER_ROLES } from 'config/consts';
import * as CompaniesActions from 'redux/actions/companies.actions';
import * as UsersActions from 'redux/actions/users.actions';
import * as UtilsActions from 'redux/actions/utils.actions';
import * as ModalsActions from 'redux/actions/modals.actions';

import AbilityProvider from '../../../utils/AbilityProvider';
import UserDetailsView from './UserDetailsView';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';
import { getContactCenterUsers } from 'api/paths/contact-center';
import { axiosBoomInstance } from 'api/instances/boomInstance';
import { addUserContactCenter, updateInfoCcUser } from 'api/contactCentersAPI';
import UserFormCc from 'components/Forms/ReduxForms/Users/UserFormCc';
import { listOrganizationUsers } from 'api/paths/user';
import { Segment } from 'types/Segment';

const styles = (theme) => ({
  container: {
    padding: 20,
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
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  listContainer: {
    padding: 20,
    paddingTop: 25,
    marginTop: 7,
  },
});

const theme = createMuiTheme({
  palette: {
    primary: { 500: '#5AC0B1' },
    secondary: { main: '#CC0033' },
  },
  typography: {
    useNextVariants: true,
  },
});

const UsersView = ({ classes }) => {
  const [isLoading, setLoading] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [csvData, setCsvData] = useState([]);
  const [searchParamCc, setSearchParamCc] = useState('');

  const dispatch = useDispatch();
  const history = useHistory();

  const { t } = useTranslation();

  const { selectedOrganization, usersData, usersRoles, companiesData, company, usersPagination, isBoom, isCcUser } = useSelector(
    (state) => ({
      usersData: state.users.data.content,
      usersPagination: state.users.data.pagination,
      usersRoles: _.filter(state.roles, (role) => role.name !== USER_ROLES.ROLE_CONTACT_CENTER),
      companiesData: state.companies.data.content,
      selectedOrganization: state.organizations.selectedOrganization,
      company: state.companies.selectedRootCompany,
      isBoom: state.user.data.isBoom,
      isCcUser: _.get(state, 'roles', []).some((role) => role.name === USER_ROLES.ROLE_CONTACT_CENTER),
    })
  );

  const isNotContactCenter = !selectedOrganization.contactCenter;

  const { data: contactCenterUsersResponse, mutate: updateUsers } = useSWR(
    selectedOrganization.contactCenter ? getContactCenterUsers(selectedOrganization.id, { username: searchParamCc }) : null,
    axiosBoomInstance.get
  );

  const { data: organizationUsersResponse, mutate: updateOrganizationUsers } = useSWR(
    listOrganizationUsers(selectedOrganization.id),
    axiosBoomInstance.get
  );

  const organizationUsers = _.get(organizationUsersResponse, 'data.content', []);
  const contactCenterUsers = _.get(contactCenterUsersResponse, 'data.content', []);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedOrganization || _.isEmpty(selectedOrganization)) {
        history.push('/usersRootCompanies');
      }
      if (isNotContactCenter) {
        setLoading(true);
        dispatch(UsersActions.setUsersFilter('enabled', activeTabIndex === 0));
        await dispatch(UsersActions.fetchUsers());
        dispatch(CompaniesActions.fetchCompanies());
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTabIndex, dispatch, history, selectedOrganization, isNotContactCenter]);

  const onUserFormSubmit = async (userData) => {
    if (userData && userData.id) {
      await onModifyUser(userData);
    } else {
      await onCreateUser(userData);
      updateOrganizationUsers();
    }
  };

  const onModifyUser = async (userData) => {
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await dispatch(UsersActions.modifyUser(userData));
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(UsersActions.setSelectedUser(userData));
      dispatch(initialize('UserForm', userData));
      dispatch(
        ModalsActions.showModal('USER_MODIFY_ALERT', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: t('users.modifyUserSuccess'),
          },
        })
      );
      dispatch(ModalsActions.hideModal('USER_FORM'));
      dispatch(UsersActions.setUsersFilter('enabled', activeTabIndex === 0));
      await dispatch(UsersActions.fetchUsers());
    } catch (error) {
      dispatch(
        ModalsActions.showModal('USER_CREATION_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: t('users.userModifyError'),
          },
        })
      );
      dispatch(UtilsActions.setSpinnerVisibile(false));
    }
  };

  const onCreateUser = async (userData) => {
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      const newUser = await dispatch(UsersActions.createUser(userData));
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(UsersActions.setSelectedUser(newUser));
      dispatch(initialize('UserForm', userData));
      dispatch(ModalsActions.hideModal('USER_FORM'));
      dispatch(
        ModalsActions.showModal('USER_CREATE_ALERT', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: t('users.createUserSuccess'),
          },
        })
      );
      onTabChange(1);
    } catch (error) {
      let errorMessage = t('users.userCreationError');
      if (error && (error === 10402 || error === 13002)) {
        errorMessage = t('users.userAlreadyExists');
      }
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
  };

  const onUserCcFormSubmit = async (data) => {
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await addUserContactCenter({ ...data, id: selectedOrganization.id });
      updateUsers();
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(ModalsActions.hideModal('NEW_USER_CC_FORM'));
      dispatch(
        ModalsActions.showModal('USER_CREATE_ALERT', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: t('users.createUserSuccess'),
          },
        })
      );
      onTabChange(1);
    } catch (error) {
      let errorMessage = t('users.userCreationError');
      if (error && (error === 10402 || error === 13002)) {
        errorMessage = t('users.userAlreadyExists');
      }
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
  };

  const onNewUserClicked = () => {
    dispatch(destroy('NewUserForm'));
    dispatch(destroy('NewUserCcForm'));

    dispatch(UsersActions.setSelectedUser({}));
    if (selectedOrganization.contactCenter) {
      dispatch(
        ModalsActions.showModal('NEW_USER_CC_FORM', {
          modalType: 'OPERATIONAL_VIEW',
          modalProps: {
            content: <NewUserCcForm onSubmit={onUserCcFormSubmit} />,
          },
        })
      );
    } else {
      dispatch(
        ModalsActions.showModal('USER_FORM', {
          modalType: 'OPERATIONAL_VIEW',
          modalProps: {
            content: <NewUserForm companies={companiesData} roles={usersRoles} onSubmit={onUserFormSubmit} />,
          },
        })
      );
    }
  };

  const onAppendUsers = (page) => dispatch(UsersActions.fetchAppendUsers(page));

  const onDeleteUserRequest = (user) => {
    dispatch(
      ModalsActions.showModal('DELETE_USER_MODAL', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          title: t('forms.warning'),
          bodyText: t('users.deleteUserConfirm'),
          onConfirm: () => onDeleteUser(user),
        },
      })
    );
  };

  const onDeleteUser = async (user) => {
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await dispatch(UsersActions.deleteUser(user));
      updateOrganizationUsers();
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(ModalsActions.hideModal('DELETE_USER_MODAL'));
      dispatch(ModalsActions.hideModal('USER_FORM'));
      dispatch(
        ModalsActions.showModal('USER_DELETE_SUCCESS', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: t('users.userDeleteSuccess'),
          },
        })
      );
      dispatch(UsersActions.setUsersFilter('enabled', activeTabIndex === 0));
      dispatch(UsersActions.fetchUsers());
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('USER_DELETE_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: t('users.userDeleteError'),
          },
        })
      );
    }
  };

  const onCcUserEditSubmit = async (userData, idUser) => {
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await updateInfoCcUser({ idContactCenter: selectedOrganization.id, idUser, ...userData });
      updateUsers();
      dispatch(initialize('UserFormCc', userData));
      dispatch(
        ModalsActions.showModal('USER_MODIFY_ALERT', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: t('users.modifyUserSuccess'),
          },
        })
      );
      dispatch(ModalsActions.hideModal('USER_FORM'));
      dispatch(UtilsActions.setSpinnerVisibile(false));
    } catch (error) {
      dispatch(
        ModalsActions.showModal('USER_CREATION_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: t('users.userModifyError'),
          },
        })
      );
      dispatch(UtilsActions.setSpinnerVisibile(false));
    }
  };

  const onEditUserClicked = (user) => {
    dispatch(destroy('UserForm'));
    dispatch(UsersActions.setSelectedUser(user));
    dispatch(initialize('UserForm', user));
    dispatch(initialize('UserFormCc', user));
    dispatch(
      ModalsActions.showModal('USER_FORM', {
        modalType: 'OPERATIONAL_VIEW',
        modalProps: {
          content: isNotContactCenter ? (
            <UserDetailsView
              companies={companiesData}
              roles={usersRoles}
              onResendConfirmationEmail={() => onResendConfirmationEmail(user.id)}
              onUserFormSubmit={onUserFormSubmit}
              onDeleteUser={() => onDeleteUserRequest(user)}
            />
          ) : (
            <UserFormCc
              onResendConfirmationEmail={() => onResendConfirmationEmail(user.id)}
              onSubmit={(userData) => onCcUserEditSubmit(userData, user.id)}
              onDeleteUser={() => onDeleteUserRequest(user)}
            />
          ),
        },
      })
    );
  };

  const onResendConfirmationEmail = async (userId) => {
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await dispatch(UsersActions.resendUserRegistrationEmail(userId));
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('RESET_PASSWORD_SUCCESS', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: t('login.resetPasswordSuccess'),
          },
        })
      );
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

  const onSearchUser = async (filterValue) => {
    if (isNotContactCenter) {
      try {
        setLoading(true);
        if (filterValue) {
          dispatch(UsersActions.setUsersFilter('username', filterValue.name));
        }
        dispatch(UsersActions.resetUsersData());

        await dispatch(UsersActions.fetchUsers());

        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    } else {
      setSearchParamCc(filterValue.name);
    }
  };

  const onResetUserFilters = async () => {
    if (isNotContactCenter) {
      try {
        setLoading(true);
        dispatch(UsersActions.resetUsersFilters());
        const statusFilter = activeTabIndex === 0;
        dispatch(UsersActions.setUsersFilter('enabled', statusFilter));
        dispatch(UsersActions.setUsersFilter('companyId', company.id));
        await dispatch(UsersActions.fetchUsers());
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    } else {
      setSearchParamCc('');
    }
  };

  const onExportUsersCSV = async () => {
    if (isNotContactCenter) {
      try {
        dispatch(UtilsActions.setSpinnerVisibile(true));
        const users = await dispatch(UsersActions.fetchUsers(0, 5000));
        dispatch(UtilsActions.setSpinnerVisibile(false));
        const formattedData = _.map(users, (user) => {
          const { firstName, lastName, email, jobTitle } = user;
          const companyName = selectedOrganization ? selectedOrganization.name : '---';
          return [companyName, firstName, lastName, email, jobTitle || '---'];
        });
        setCsvData([
          [
            // CSV HEADER
            t('company.name'),
            t('forms.firstName'),
            t('forms.lastName'),
            t('forms.email'),
            t('forms.jobTitle'),
          ],
          ...formattedData,
        ]);
      } catch (error) {
        dispatch(UtilsActions.setSpinnerVisibile(false));
      }
    } else {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      const users =
        activeTabIndex === 0
          ? contactCenterUsers.filter((user) => user.activationDate)
          : contactCenterUsers.filter((user) => !user.activationDate);
      dispatch(UtilsActions.setSpinnerVisibile(false));
      const formattedData = _.map(users, (user) => {
        const { firstName, lastName, email } = user;
        const companyName = selectedOrganization ? selectedOrganization.name : '---';
        return [companyName, firstName, lastName, email || '---'];
      });
      setCsvData([
        [
          // CSV HEADER
          t('company.name'),
          t('forms.firstName'),
          t('forms.lastName'),
          t('forms.email'),
        ],
        ...formattedData,
      ]);
    }
  };

  const onTabChange = (index) => {
    setActiveTabIndex(index);
    const statusFilter = index === 0;
    dispatch(UsersActions.resetUsersFilters());
    dispatch(UsersActions.setUsersFilter('enabled', statusFilter));
    if (isNotContactCenter) {
      onSearchUser();
    }
  };

  const canCreate = useMemo(() => {
    if (
      (selectedOrganization.tier === OrganizationTier.SMB || Segment.SMB === selectedOrganization.segment) &&
      organizationUsers.length >= 1
    ) {
      return false;
    }

    if (selectedOrganization.contactCenter) {
      return isBoom || isCcUser;
    }
    return AbilityProvider.getCompanyAbilityHelper().hasPermission([PERMISSIONS.CREATE], PERMISSION_ENTITIES.USER);
  }, [isBoom, isCcUser, selectedOrganization, organizationUsers.length]);

  const noUserAvailable =
    (activeTabIndex === 0 && contactCenterUsers.filter((user) => user.activationDate).length === 0) ||
    (activeTabIndex === 1 && contactCenterUsers.filter((user) => !user.activationDate).length === 0);

  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.container}>
        <Permission do={[PERMISSIONS.REPORT]} on={PERMISSION_ENTITIES.USER} abilityHelper={AbilityProvider.getOrganizationAbilityHelper()}>
          <CSVButton
            data={csvData}
            buttonStyle={{ width: '15%' }}
            containerstyle={{ display: 'flex', justifyContent: 'flex-end' }}
            fetchCSVData={onExportUsersCSV}
            fileName={`Users-${moment().format('LL')}`}
          />
        </Permission>
        <ListComponent
          pagination={usersPagination}
          containerstyle={{ width: '90%' }}
          newElementText={t('users.createNewUser')}
          searchFieldLabel={t('users.userEmail')}
          onLoadMore={onAppendUsers}
          onCreateNew={canCreate ? onNewUserClicked : null}
          onSearch={onSearchUser}
          onResetFilters={onResetUserFilters}
        >
          <AppBar position="static" style={{ backgroundColor: 'white' }}>
            <Tabs
              value={activeTabIndex}
              onChange={(event, index) => onTabChange(index)}
              scrollable
              scrollButtons="on"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label={t('users.activeUsers')} icon={<ActiveUsersIcon />} />
              <Tab label={t('users.disabledUsers')} icon={<DisabledUsersIcon />} />
            </Tabs>
          </AppBar>
          <Paper className={classes.listContainer} square>
            {selectedOrganization.contactCenter
              ? _.map(
                  contactCenterUsers,
                  (user) =>
                    ((activeTabIndex === 0 && user.activationDate !== null) || (activeTabIndex === 1 && user.activationDate === null)) && (
                      <UserRow key={user.id} user={user} outerContainerstyle={{ marginTop: 15 }} onClick={() => onEditUserClicked(user)} />
                    )
                )
              : _.map(usersData, (user) => (
                  <UserRow key={user.id} user={user} outerContainerstyle={{ marginTop: 15 }} onClick={() => onEditUserClicked(user)} />
                ))}
            {isNotContactCenter && (!usersData || _.isEmpty(usersData)) && !isLoading && (
              <div className={classes.noUserContainer}>
                <UsersIcon className={classes.noUserIcon} />
                <h4 className={classes.noUserText}>
                  {activeTabIndex === 0 ? t('company.noUsersFound') : t('company.noInactiveUsersFound')}
                </h4>
              </div>
            )}
            {selectedOrganization.contactCenter && noUserAvailable && (
              <div className={classes.noUserContainer}>
                <UsersIcon className={classes.noUserIcon} />
                <h4 className={classes.noUserText}>
                  {activeTabIndex === 0 ? t('company.noUsersFound') : t('company.noInactiveUsersFound')}
                </h4>
              </div>
            )}
            {isLoading && _.isEmpty(usersData) && (
              <Spinner
                title={t('general.loading')}
                hideLogo
                spinnerStyle={{ color: '#5AC0B1', marginTop: 10 }}
                titleStyle={{ color: '#3f3f3f', marginTop: 5 }}
              />
            )}
          </Paper>
        </ListComponent>
      </div>
    </MuiThemeProvider>
  );
};

export default withStyles(styles)(UsersView);
