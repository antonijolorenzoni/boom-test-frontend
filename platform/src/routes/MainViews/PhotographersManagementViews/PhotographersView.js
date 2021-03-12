//
// ──────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: P H O T O G R A P H E R   M A N A G E M E N T   V I E W : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import { Paper, Tab, withStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import ActiveUsersIcon from '@material-ui/icons/HowToReg';
import DisabledUsersIcon from '@material-ui/icons/PersonAddDisabled';
import UsersIcon from '@material-ui/icons/SupervisedUserCircle';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { destroy, initialize, submit } from 'redux-form';
import moment from 'moment';
import PhotographerForm from '../../../components/Forms/ReduxForms/Photographers/PhotographerForm';
import ListComponent from '../../../components/ListComponent/ListComponent';
import PhotographerRow from '../../../components/ListComponent/RowComponents/PhotographerRow';
import Spinner from '../../../components/Spinner/Spinner';
import * as PhotographersActions from '../../../redux/actions/photographers.actions';
import * as UtilsActions from '../../../redux/actions/utils.actions';
import * as ModalsActions from '../../../redux/actions/modals.actions';
import translations from '../../../translations/i18next';
import PhotographersSearchBar from '../../../components/Photographers/PhotographersSearchBar';
import CSVButton from '../../../components/CSVButton/CSVButton';
import AbilityProvider from '../../../utils/AbilityProvider';
import { PERMISSIONS, PERMISSION_ENTITIES } from '../../../config/consts';
import Permission from '../../../components/Permission/Permission';
import PhotographerDetailsView from './PhotographerDetailsView';
import MDButton from '../../../components/MDButton/MDButton';
import { getErrorMessageOnPhotographerDeleted } from '../../../config/utils';
import { photoTypesWithoutOthers } from 'utils/orders';

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

class PhotographersView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      activeTabIndex: 0,
      csvData: [],
    };
  }

  async componentWillMount() {
    this.onFetchPhotographersFiltered();
  }

  componentDidMount() {
    document.addEventListener('keydown', (e) => this.onSubmitPressed(e), false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', (e) => this.onSubmitPressed(e), false);
  }

  onSubmitPressed(e) {
    const { dispatch } = this.props;
    if (e.keyCode === 13) {
      dispatch(submit('PhotographersSearchBar'));
    }
  }

  async onFetchPhotographersFiltered() {
    const { dispatch } = this.props;
    const { activeTabIndex } = this.state;
    this.setState({ isLoading: true });
    dispatch(PhotographersActions.resetPhotographersFilters());
    dispatch(PhotographersActions.resetPhotographersData());
    dispatch(PhotographersActions.setPhotographersFilter('activated', activeTabIndex === 0));
    await dispatch(PhotographersActions.fetchPhotographers());
    this.setState({ isLoading: false });
  }

  async onPhotographerFormSubmit(photographerData) {
    if (photographerData && photographerData.id) {
      await this.onModifyPhotographer(photographerData);
    } else {
      await this.onCreatePhotographer(photographerData);
    }
  }

  async onModifyPhotographer(photographerData) {
    const { dispatch } = this.props;
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await dispatch(PhotographersActions.modifyPhotographer(photographerData));
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(ModalsActions.hideModal('PHOTOGRAPHER_FORM'));
      dispatch(
        ModalsActions.showModal('USER_MODIFY_ALERT', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('photographers.modifyPhotographerSuccess'),
          },
        })
      );
      this.onFetchPhotographersFiltered();
    } catch (error) {
      dispatch(
        ModalsActions.showModal('USER_MODIFY_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('photographers.photographerModifyError'),
          },
        })
      );
      dispatch(UtilsActions.setSpinnerVisibile(false));
    }
  }

  async onCreatePhotographer(photographerData) {
    const { dispatch } = this.props;
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await dispatch(PhotographersActions.createPhotographer(photographerData));
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(ModalsActions.hideModal('PHOTOGRAPHER_FORM'));
      dispatch(
        ModalsActions.showModal('USER_CREATE_ALERT', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('photographers.createPhotographerSuccess'),
          },
        })
      );
      this.onTabChange(1);
    } catch (error) {
      let errorMessage = translations.t('photographers.photographerCreationError');
      if (error && error === 13002) errorMessage = translations.t('photographers.photographerAlreadyExists');
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

  onNewPhotographerClicked() {
    const {
      dispatch,
      user: { photoTypes },
    } = this.props;
    dispatch(destroy('PhotographerForm'));
    const canCreate = AbilityProvider.getOrganizationAbilityHelper().hasPermission([PERMISSIONS.CREATE], PERMISSION_ENTITIES.PHOTOGRAPHER);
    dispatch(PhotographersActions.setSelectedPhotographer({}));
    dispatch(
      ModalsActions.showModal('PHOTOGRAPHER_FORM', {
        modalType: 'OPERATIONAL_VIEW',
        modalProps: {
          content: (
            <PhotographerForm
              canCreate={canCreate}
              photoTypes={photoTypesWithoutOthers(photoTypes)}
              onSubmit={(photographerData) => this.onPhotographerFormSubmit(photographerData)}
            />
          ),
        },
      })
    );
  }

  async onAppendPhotographer(page) {
    const { dispatch } = this.props;
    await dispatch(PhotographersActions.fetchAppendPhotographers(page));
  }

  onDeletePhotographerRequest(photographer) {
    const { dispatch } = this.props;
    dispatch(
      ModalsActions.showModal('DELETE_PHOTOGRAPHER_MODAL', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          title: translations.t('forms.warning'),
          bodyText: translations.t('photographers.deletePhotographerConfirm'),
          onConfirm: () => this.onDeletePhotographer(photographer),
        },
      })
    );
  }

  async onDeletePhotographer(photographer) {
    const { dispatch } = this.props;
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await dispatch(PhotographersActions.deletePhotographer(photographer));
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(ModalsActions.hideModal('DELETE_PHOTOGRAPHER_MODAL'));
      dispatch(ModalsActions.hideModal('PHOTOGRAPHER_FORM'));
      dispatch(
        ModalsActions.showModal('USER_DELETE_SUCCESS', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('photographers.photographerDeleteSuccess'),
          },
        })
      );
      this.onFetchPhotographersFiltered();
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));

      const errorCode = _.get(error, 'response.data.code');
      const photographerName = _.get(error, 'response.data.message');

      const errorMessage =
        errorCode && photographerName
          ? getErrorMessageOnPhotographerDeleted(photographerName, errorCode, translations.t('photographers.photographerDeleteError'))
          : translations.t('photographers.photographerDeleteError');

      dispatch(
        ModalsActions.showModal('USER_DELETE_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: errorMessage,
          },
        })
      );
    }
  }

  async onSearchPhotographers(filterValue) {
    const { dispatch } = this.props;
    try {
      this.setState({ isLoading: true });
      if (filterValue) dispatch(PhotographersActions.setPhotographersFilter('username', filterValue.name));
      dispatch(PhotographersActions.resetPhotographersData());
      await dispatch(PhotographersActions.fetchPhotographers());
      this.setState({ isLoading: false });
    } catch (error) {
      this.setState({ isLoading: false });
    }
  }

  async onSearch(filterValues) {
    const { dispatch } = this.props;
    const { activeTabIndex } = this.state;
    const statusFilter = activeTabIndex === 0;
    try {
      this.setState({ isLoading: true });
      dispatch(PhotographersActions.setPhotographersFilterBlock(filterValues));
      dispatch(PhotographersActions.setPhotographersFilter('activated', statusFilter));
      dispatch(PhotographersActions.resetPhotographersData());
      await dispatch(PhotographersActions.fetchPhotographers());
      this.setState({ isLoading: false });
    } catch (error) {
      this.setState({ isLoading: false });
    }
  }

  onResetPhotographersFilters() {
    const { dispatch } = this.props;
    dispatch(PhotographersActions.resetPhotographersFilters());
    this.onFetchPhotographersFiltered();
  }

  async onEditPhotographer(photographer) {
    const {
      dispatch,
      user: { photoTypes },
    } = this.props;
    const canDelete = AbilityProvider.getOrganizationAbilityHelper().hasPermission([PERMISSIONS.DELETE], PERMISSION_ENTITIES.PHOTOGRAPHER);
    const canEdit = AbilityProvider.getOrganizationAbilityHelper().hasPermission([PERMISSIONS.UPDATE], PERMISSION_ENTITIES.PHOTOGRAPHER);
    dispatch(destroy('PhotographerForm'));
    dispatch(PhotographersActions.setSelectedPhotographer(photographer));
    const personalPhotoTypes = _.map(photographer.photoTypes, (photoType) => photoType.id);
    dispatch(initialize('PhotographerForm', { ...photographer.user, photoTypes: personalPhotoTypes }));
    dispatch(
      ModalsActions.showModal('PHOTOGRAPHER_FORM', {
        modalType: 'OPERATIONAL_VIEW',
        modalProps: {
          content: (
            <PhotographerDetailsView
              photoTypes={photoTypesWithoutOthers(photoTypes)}
              canDelete={canDelete}
              canEdit={canEdit}
              photographer={photographer}
              onPhotographerFormSubmit={(photographerData) =>
                this.onPhotographerFormSubmit({
                  ...photographer,
                  user: photographerData,
                })
              }
              onDeletePhotographer={() => this.onDeletePhotographerRequest(photographer)}
              onResendConfirmationEmail={() => this.onResendConfirmationEmail(photographer.id)}
            />
          ),
        },
      })
    );
  }

  onTabChange(index) {
    const { dispatch } = this.props;
    this.setState({ activeTabIndex: index });
    const statusFilter = index === 0;
    dispatch(PhotographersActions.setPhotographersFilter('activated', statusFilter));
    this.onSearchPhotographers();
  }

  async onResendConfirmationEmail(userId) {
    const { dispatch } = this.props;
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await dispatch(PhotographersActions.resendPhotographerRegistrationEmail(userId));
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('RESET_PASSWORD_SUCCESS', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('login.resetPasswordSuccess'),
          },
        })
      );
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('RESET_PASSWORD_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('login.resetPasswordError'),
          },
        })
      );
    }
  }

  async onExportPhotographersCSV() {
    const { dispatch } = this.props;
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      const users = await dispatch(PhotographersActions.fetchPhotographers(0, 500000));
      dispatch(UtilsActions.setSpinnerVisibile(false));
      const formattedData = _.map(users, (photographer) => {
        const { user, score, address, cameras, lenses, photoTypes } = photographer;
        const { firstName, lastName, email, phoneNumber, activationDate } = user;
        const finalCameras = !_.isEmpty(cameras) ? _.map(cameras, (camera) => camera.model) : '---';
        const finalLenses = !_.isEmpty(lenses) ? _.map(lenses, (lense) => lense.model) : '---';
        const finalPhotoTypes = _.map(photoTypes, (photoType) => translations.t(`photoTypes.${photoType.type}`));
        const workingPlace = address && address.formattedAddress ? address.formattedAddress : '---';
        const city = address && address.city ? address.city : '---';
        const phone = phoneNumber || '---';
        const photographerActivationDate = activationDate ? moment(activationDate).format('LLL') : '---';
        const roundedScore = score && _.isNumber(score) ? Math.round(score * 100) / 100 : score;
        return [
          firstName,
          lastName,
          email,
          phone,
          photographerActivationDate,
          workingPlace,
          city,
          finalPhotoTypes,
          finalLenses,
          finalCameras,
          roundedScore,
        ];
      });
      this.setState(
        {
          csvData: [
            [
              // CSV HEADER
              translations.t('forms.firstName'),
              translations.t('forms.lastName'),
              translations.t('profile.email'),
              translations.t('forms.phone'),
              translations.t('users.activationDate'),
              translations.t('forms.baseHouse'),
              translations.t('profile.city'),
              translations.t('forms.photoTypesPhotographer'),
              translations.t('forms.lenses'),
              translations.t('forms.cameras'),
              translations.t('photographers.score'),
            ],
            ...formattedData,
          ],
        },
        () => this.setState({ csvData: [] })
      );
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
    }
  }

  render() {
    const {
      classes,
      photographers: {
        data: { content: photographersData, pagination: photographersPagination },
      },
      user: { photoTypes },
    } = this.props;
    const { isLoading, activeTabIndex, csvData } = this.state;
    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.container}>
          <Permission
            do={[PERMISSIONS.REPORT]}
            on={PERMISSION_ENTITIES.PHOTOGRAPHER}
            abilityHelper={AbilityProvider.getOrganizationAbilityHelper()}
          >
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
              <h4>{translations.t('header.photographers')}</h4>
              <CSVButton
                data={csvData}
                fetchCSVData={() => this.onExportPhotographersCSV()}
                fileName={`Photographers-${moment().format('LL')}`}
              />
            </div>
          </Permission>
          <PhotographersSearchBar
            onResetFilters={() => this.onResetPhotographersFilters()}
            photographyTypesOptions={photoTypes}
            onSubmit={(searchValues) => this.onSearch(searchValues)}
          />
          <Permission
            do={[PERMISSIONS.CREATE]}
            on={PERMISSION_ENTITIES.PHOTOGRAPHER}
            abilityHelper={AbilityProvider.getOrganizationAbilityHelper()}
          >
            <MDButton
              title={translations.t('photographers.createNewPhotographer')}
              className="gradient-button"
              titleStyle={{ fontSize: 15 }}
              containerstyle={{ width: '50%', marginTop: 20, marginBottom: 20 }}
              backgroundColor="#5AC0B1"
              onClick={() => this.onNewPhotographerClicked()}
            />
          </Permission>
          <AppBar position="static" style={{ backgroundColor: 'white' }}>
            <Tabs
              value={activeTabIndex}
              onChange={(event, index) => this.onTabChange(index)}
              scrollButtons="on"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label={translations.t('photographers.activePhotographers')} icon={<ActiveUsersIcon />} />
              <Tab label={translations.t('photographers.disabledPhotographers')} icon={<DisabledUsersIcon />} />
            </Tabs>
          </AppBar>
          <ListComponent
            pagination={photographersPagination}
            containerstyle={{ width: '100%' }}
            isLoading={isLoading}
            searchFieldLabel={translations.t('users.userEmail')}
            onLoadMore={(page) => this.onAppendPhotographer(page)}
          >
            <Paper className={classes.listContainer} square>
              {_.map(photographersData, (user) => (
                <PhotographerRow
                  key={user.id}
                  photographer={user}
                  showPhoneNumber
                  showPhotoTypes
                  outerContainerstyle={{ marginTop: 15 }}
                  onClick={() => this.onEditPhotographer(user)}
                />
              ))}
              {(!photographersData || _.isEmpty(photographersData)) && !isLoading && (
                <div className={classes.noUserContainer}>
                  <UsersIcon className={classes.noUserIcon} />
                  <h4 className={classes.noUserText}>
                    {activeTabIndex === 0
                      ? translations.t('photographers.noActivePhotographerFound')
                      : translations.t('photographers.noDisabledPhotographerFound')}
                  </h4>
                </div>
              )}
              {isLoading && _.isEmpty(photographersData) && (
                <Spinner
                  title={translations.t('general.loading')}
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
  }
}

PhotographersView.propTypes = {
  dispatch: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
  photographers: PropTypes.shape({}).isRequired,
};

const mapStateToProps = (state) => ({
  photographers: state.photographers,
  roles: state.roles,
  companies: state.companies,
  organizations: state.organizations,
  user: state.user,
});

export default connect(mapStateToProps)(withStyles(styles)(PhotographersView));
