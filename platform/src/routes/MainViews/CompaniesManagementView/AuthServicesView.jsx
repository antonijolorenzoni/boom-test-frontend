//
// ────────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: A U T H E N T I C A T E D   S E R V I C E   U S E R   V I E W : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import { withStyles } from '@material-ui/core';
import AuthServiceIcon from '@material-ui/icons/ImportantDevices';
import CopyIcon from '@material-ui/icons/FileCopy';
import WarningIcon from '@material-ui/icons/Warning';
import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { connect } from 'react-redux';
import OrganizationServiceForm from '../../../components/Forms/ReduxForms/Organizations/OrganizationServiceForm';
import AuthServiceRow from '../../../components/ListComponent/RowComponents/AuthServiceRow';
import MDButton from '../../../components/MDButton/MDButton';
import Permission from '../../../components/Permission/Permission';
import Spinner from '../../../components/Spinner/Spinner';
import { PERMISSIONS, PERMISSION_ENTITIES } from '../../../config/consts';
import * as OrganizationsActions from '../../../redux/actions/organizations.actions';
import * as UtilsActions from '../../../redux/actions/utils.actions';
import * as ModalsActions from '../../../redux/actions/modals.actions';
import translations from '../../../translations/i18next';
import AbilityProvider from '../../../utils/AbilityProvider';

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

const ClientSecretsSection = ({ clientSecret, clientId, onCopy }) => (
  <div>
    <h4 style={{ fontWeight: 100, marginTop: 0 }}>{translations.t('company.serviceCredentialDescription')}</h4>
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <WarningIcon style={{ color: 'red', marginRight: 10 }} />
      <h5 style={{ color: 'red', margin: 0 }}>{translations.t('company.clientSecretWarning')}</h5>
    </div>
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
      <div>
        <h4 style={{ marginBottom: 5 }}>{translations.t('company.clientId')}</h4>
        {clientId}
        <h4 style={{ marginBottom: 5 }}>{translations.t('company.clientSecret')}</h4>
        {clientSecret}
      </div>
      <CopyToClipboard text={`Client Id: ${clientId}\nClient Secret: ${clientSecret}`} onCopy={() => onCopy()}>
        <div>
          <MDButton
            title={translations.t('forms.copy')}
            containerstyle={{ width: '100%' }}
            titleStyle={{ marginRight: 20 }}
            backgroundColor="#42A5F5"
            icon={<CopyIcon style={{ color: 'white' }} />}
          />
        </div>
      </CopyToClipboard>
    </div>
  </div>
);

class AuthServicesView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  async componentDidMount() {
    this.onFetchAuthService();
  }

  async componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(OrganizationsActions.resetOrganizationAuthService());
  }

  async onFetchAuthService() {
    const { dispatch } = this.props;
    try {
      this.setState({ isLoading: true });
      await dispatch(OrganizationsActions.fetchOrganizationAuthorizedService());
      this.setState({ isLoading: false });
    } catch (error) {
      this.setState({ isLoading: false });
    }
  }

  onNewAuthorizedService() {
    const { dispatch } = this.props;
    dispatch(
      ModalsActions.showModal('NEW_AUTHORIZED_SERVICE_MODAL', {
        modalType: 'OPERATIONAL_VIEW',
        modalProps: {
          content: (
            <div>
              <OrganizationServiceForm onSubmit={(serviceData) => this.onCreateAuthorizedServiceRequest(serviceData)} />
            </div>
          ),
        },
      })
    );
  }

  async onCreateAuthorizedServiceRequest(authServiceDTO) {
    const { dispatch } = this.props;
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      const authService = await dispatch(OrganizationsActions.createAuthorizedService(authServiceDTO));
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('SERVICE_CREATION_SUCCESS', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('company.authServiceCreateSuccess'),
          },
        })
      );
      this.onFetchAuthService();
      dispatch(ModalsActions.hideModal('NEW_AUTHORIZED_SERVICE_MODAL'));
      dispatch(
        ModalsActions.showModal('CLIENT_AUTH_MODAL', {
          modalType: 'MODAL_DIALOG',
          modalProps: {
            hideCancel: true,
            title: translations.t('forms.warning'),
            content: (
              <ClientSecretsSection
                clientId={authService.clientId}
                clientSecret={authService.clientSecret}
                onCopy={() =>
                  dispatch(
                    ModalsActions.showModal('COPY_SUCCESS_ALERT', {
                      modalType: 'SUCCESS_ALERT',
                      modalProps: {
                        message: translations.t('forms.copySuccess'),
                      },
                    })
                  )
                }
              />
            ),
          },
        })
      );
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('SERVICE_CREATION_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('company.authServiceCreateError'),
          },
        })
      );
    }
  }

  async onDeleteServiceRequest(service) {
    const { dispatch } = this.props;
    dispatch(
      ModalsActions.showModal('DELETE_SERVICE_MODAL', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          title: translations.t('forms.warning'),
          bodyText: translations.t('company.authServiceDeleteConfirm'),
          onConfirm: () => this.onDeleteServiceConfirm(service),
        },
      })
    );
  }

  async onDeleteServiceConfirm(service) {
    const { dispatch } = this.props;
    dispatch(ModalsActions.hideModal('DELETE_SERVICE_MODAL'));
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await dispatch(OrganizationsActions.deleteOrganizationAuthorizedService(service.id));
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('SERVICE_DELETE_SUCCESS', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('company.authServiceDeleteSuccess'),
          },
        })
      );
      this.onFetchAuthService();
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('PACKAGE_CREATION_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('company.authServiceDeleteError'),
          },
        })
      );
    }
  }

  render() {
    const { isLoading } = this.state;
    const {
      classes,
      organizations: { authorizedService },
    } = this.props;
    const canDeleteService = AbilityProvider.getOrganizationAbilityHelper().hasPermission(
      [PERMISSIONS.DELETE],
      PERMISSION_ENTITIES.AUTHORIZEDSERVICE
    );
    return (
      <div>
        <h4>{translations.t('company.authServiceDescription')}</h4>
        {!authorizedService && (
          <Permission
            do={[PERMISSIONS.CREATE]}
            on={PERMISSION_ENTITIES.AUTHORIZEDSERVICE}
            abilityHelper={AbilityProvider.getOrganizationAbilityHelper()}
          >
            <MDButton
              title={translations.t('company.createAuthService')}
              className="gradient-button"
              titleStyle={{ fontSize: 15 }}
              containerstyle={{ width: '50%', marginTop: 20, marginBottom: 20 }}
              backgroundColor="#5AC0B1"
              onClick={() => this.onNewAuthorizedService()}
            />
          </Permission>
        )}
        {authorizedService && (
          <div>
            <AuthServiceRow
              service={authorizedService}
              canDeleteService={canDeleteService}
              onDelete={() => this.onDeleteServiceRequest(authorizedService)}
            />
          </div>
        )}
        {!authorizedService && !isLoading && (
          <div className={classes.noUserContainer}>
            <AuthServiceIcon className={classes.noUserIcon} />
            <h4 className={classes.noUserText}>{translations.t('company.noAuthService')}</h4>
          </div>
        )}
        {isLoading && !authorizedService && (
          <Spinner
            title={translations.t('general.loading')}
            hideLogo
            spinnerStyle={{ color: '#5AC0B1', marginTop: 10 }}
            titleStyle={{ color: '#3f3f3f', marginTop: 5 }}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  organizations: state.organizations,
  user: state.user,
});

export default connect(mapStateToProps)(withStyles(styles)(AuthServicesView));
