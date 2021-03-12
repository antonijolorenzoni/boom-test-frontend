//
// ────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: C H E C K L I S T   M A N A G E M E N T   V I E W : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────
//

import { withStyles } from '@material-ui/core';
import ChecklistIcon from '@material-ui/icons/Style';
import React from 'react';
import { connect } from 'react-redux';
import OrganizationChecklistForm from '../../../components/Forms/ReduxForms/Organizations/OrganizationChecklistForm';
import ChecklistRow from '../../../components/ListComponent/RowComponents/ChecklistRow';
import MDButton from '../../../components/MDButton/MDButton';
import Permission from '../../../components/Permission/Permission';
import Spinner from '../../../components/Spinner/Spinner';
import { PERMISSIONS, PERMISSION_ENTITIES } from '../../../config/consts';
import * as CompaniesActions from '../../../redux/actions/companies.actions';
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

class ChecklistView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  async componentDidMount() {
    this.onFetchChecklist();
  }

  async componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(CompaniesActions.resetCompanyChecklist());
  }

  async onFetchChecklist() {
    const {
      dispatch,
      companies: { selectedRootCompany },
    } = this.props;
    try {
      this.setState({ isLoading: true });
      await dispatch(CompaniesActions.fetchCompanyChecklist(selectedRootCompany.id));
      this.setState({ isLoading: false });
    } catch (error) {
      this.setState({ isLoading: false });
    }
  }

  onNewChecklist() {
    const {
      dispatch,
      companies: {
        data: { content: companiesData },
      },
    } = this.props;
    dispatch(
      ModalsActions.showModal('NEW_CHECKLIST_MODAL', {
        modalType: 'OPERATIONAL_VIEW',
        modalProps: {
          content: (
            <div>
              <h4 style={{ marginLeft: 20 }}>{translations.t('company.createChecklist')}</h4>
              <OrganizationChecklistForm
                companies={companiesData}
                onSubmit={(checklistData) => this.onCreateCompanyChecklistRequest(checklistData)}
              />
            </div>
          ),
        },
      })
    );
  }

  onCreateCompanyChecklistRequest(checklistData) {
    const { dispatch } = this.props;
    dispatch(
      ModalsActions.showModal('CREATE_CHECKLIST_MODAL', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          title: translations.t('forms.warning'),
          bodyText: translations.t('company.makeChecklistAvailableCompanyWarning'),
          onConfirm: () => this.onCreateCompanyChecklist(checklistData),
        },
      })
    );
  }

  async onCreateCompanyChecklist(checklistData) {
    const { dispatch } = this.props;
    try {
      dispatch(ModalsActions.hideModal('CREATE_CHECKLIST_MODAL'));
      dispatch(UtilsActions.setSpinnerVisibile(true));
      const checklist = await dispatch(OrganizationsActions.createOrganizationChecklist(checklistData));
      await dispatch(OrganizationsActions.createChecklistAuthorizedCompanies(checklist.id, checklistData.compainesSelected));
      dispatch(ModalsActions.hideModal('NEW_CHECKLIST_MODAL'));
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('PACKAGE_CREATION_ERROR', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('company.checklistCreatedSuccess'),
          },
        })
      );
      this.onFetchChecklist();
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('PACKAGE_CREATION_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('company.checklistCreatedError'),
          },
        })
      );
    }
  }

  async onDeleteChecklistRequest(checklist) {
    const { dispatch } = this.props;
    dispatch(
      ModalsActions.showModal('DELETE_PACKAGE_MODAL', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          title: translations.t('forms.warning'),
          bodyText: translations.t('company.checklistDeleteConfirm'),
          onConfirm: () => this.onDeleteChecklistConfirm(checklist),
        },
      })
    );
  }

  async onDeleteChecklistConfirm(checklist) {
    const { dispatch } = this.props;
    dispatch(ModalsActions.hideModal('DELETE_PACKAGE_MODAL'));
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await dispatch(OrganizationsActions.deleteOrganizationChecklist(checklist.id));
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('PACKAGE_CREATION_ERROR', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('company.checklistDeleteSuccess'),
          },
        })
      );
      this.onFetchChecklist();
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('PACKAGE_CREATION_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('company.checklistDeleteError'),
          },
        })
      );
    }
  }

  onDeleteChecklistFromCompanyRequest(checklist) {
    const { dispatch } = this.props;
    dispatch(
      ModalsActions.showModal('DELETE_PACKAGE_MODAL', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          title: translations.t('forms.warning'),
          bodyText: translations.t('company.checklistDeleteConfirmForCompany'),
          onConfirm: () => this.onDeleteChecklistFromChecklistConfirm(checklist),
        },
      })
    );
  }

  async onDeleteChecklistFromChecklistConfirm(checklist) {
    const {
      dispatch,
      companies: { selectedRootCompany },
    } = this.props;
    dispatch(ModalsActions.hideModal('DELETE_PACKAGE_MODAL'));
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await dispatch(OrganizationsActions.deleteChecklistAuthorizedCompanies(checklist.id, [selectedRootCompany.id]));
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('PACKAGE_CREATION_ERROR', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('company.checklistDeleteSuccess'),
          },
        })
      );
      this.onFetchChecklist();
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('PACKAGE_CREATION_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('company.checklistDeleteError'),
          },
        })
      );
    }
  }

  render() {
    const { isLoading } = this.state;
    const {
      classes,
      companies: { checklist },
    } = this.props;
    const canDeleteChecklist = AbilityProvider.getCompanyAbilityHelper().hasPermission([PERMISSIONS.DELETE], PERMISSION_ENTITIES.CHECKLIST);
    return (
      <div>
        <Permission
          do={[PERMISSIONS.CREATE]}
          on={PERMISSION_ENTITIES.PRICINGPACKAGE}
          abilityHelper={AbilityProvider.getCompanyAbilityHelper()}
        >
          <MDButton
            title={translations.t('company.createChecklist')}
            className="gradient-button"
            titleStyle={{ fontSize: 15 }}
            containerstyle={{ width: '50%', marginTop: 20, marginBottom: 20 }}
            backgroundColor="#5AC0B1"
            onClick={() => this.onNewChecklist()}
          />
        </Permission>
        {checklist && (
          <div>
            <ChecklistRow
              checklist={checklist}
              canDeleteChecklist={canDeleteChecklist}
              onDelete={() => this.onDeleteChecklistRequest(checklist)}
              onDeleteFromCompany={() => this.onDeleteChecklistFromCompanyRequest(checklist)}
            />
          </div>
        )}
        {!checklist && !isLoading && (
          <div className={classes.noUserContainer}>
            <ChecklistIcon className={classes.noUserIcon} />
            <h4 className={classes.noUserText}>{translations.t('company.noChecklistFound')}</h4>
          </div>
        )}
        {isLoading && !checklist && (
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
  companies: state.companies,
  user: state.user,
  currencies: state.utils.currencies,
});

export default connect(mapStateToProps)(withStyles(styles)(ChecklistView));
