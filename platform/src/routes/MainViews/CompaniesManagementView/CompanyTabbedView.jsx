//
// ────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: M A I N   C O M P A N I E S   V I E W   W I T H   T A B S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import { MuiThemeProvider, Paper, withStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import { createMuiTheme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import PricingPackagesIcon from '@material-ui/icons/PhotoFilter';
import SettingsIcon from '@material-ui/icons/Settings';
import ChecklistIcon from '@material-ui/icons/Style';
import DetailsIcon from '@material-ui/icons/Assignment';
import SubCompaniesIcon from '@material-ui/icons/Business';
import AccountingIcon from '@material-ui/icons/CardTravel';
import AuthServiceIcon from '@material-ui/icons/ImportantDevices';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { initialize } from 'redux-form';
import CompaniesNavigator from '../../../components/CompaniesNavigator/CompaniesNavigator';
import * as CompaniesActions from '../../../redux/actions/companies.actions';
import * as OrganizationsActions from '../../../redux/actions/organizations.actions';
import * as UtilsActions from '../../../redux/actions/utils.actions';
import * as UsersActions from '../../../redux/actions/users.actions';
import * as UserActions from '../../../redux/actions/user.actions';
import * as ModalsActions from '../../../redux/actions/modals.actions';
import * as BalanceActions from '../../../redux/actions/balance.actions';
import translations from '../../../translations/i18next';
import { CompanyDetailsView } from './CompanyDetailsView';
import { OrganizationDetailsView } from './OrganizationDetailsView';
import SubCompaniesView from './SubCompaniesView';
import PricingPackageView from './PricingPackageView';
import { PERMISSION_ENTITIES, PERMISSIONS, CONTACT_CENTER_SLUG, OrganizationTier } from '../../../config/consts';
import AbilityProvider from '../../../utils/AbilityProvider';
import BalanceView from '../BalanceManagementView/BalanceView';
import CompanyPenaltiesConfigView from './CompanyPenaltiesConfigView';
import ChecklistView from './ChecklistView';
import AuthServicesView from './AuthServicesView';
import { getOrganizationCompany } from '../../../api/companiesAPI';
import { getOrganization } from '../../../api/organizationsAPI';
import { Segment } from 'types/Segment';
import { featureFlag } from 'config/featureFlags';

const styles = (theme) => ({
  container: {
    padding: 20,
  },
  innerContainer: {
    padding: 10,
    marginTop: 7,
  },
});

const theme = createMuiTheme({
  palette: {
    primary: { 500: '#66c0b0' },
  },
  typography: {
    useNextVariants: true,
  },
});

class CompanyTabbedView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndexSelected: 0,
    };
  }

  async componentDidMount() {
    const {
      organizations: { selectedOrganization },
      dispatch,
      user: { data: userData },
    } = this.props;

    if (!selectedOrganization || _.isEmpty(selectedOrganization)) {
      this.init();
    }

    if (userData.organization === 1 && !selectedOrganization.contactCenter) {
      dispatch(CompaniesActions.jumpToNewNavigationLevel(0));
    }
  }

  init = async () => {
    const {
      history,
      location,
      dispatch,
      user: {
        data: { isBoom },
      },
    } = this.props;

    const ids = location.pathname.split('/').slice(2);

    if (ids.length === 0 || ids[0] === CONTACT_CENTER_SLUG) {
      history.push('/rootCompanies');
      return;
    }

    dispatch(UtilsActions.setSpinnerVisibile(true));

    try {
      const organizationId = ids[0];
      const organization = await getOrganization(organizationId);

      dispatch(OrganizationsActions.setSelectedOrganization(organization.data));

      if (isBoom) {
        await dispatch(OrganizationsActions.fetchOrganizationAuthorizedService());
      }

      const company = await getOrganizationCompany(organizationId, ids[ids.length - 1]);
      dispatch(CompaniesActions.setSelectedRootCompany(company.data));
      await dispatch(CompaniesActions.fetchSubCompaniesAndLogos());
      await dispatch(UserActions.fetchCompanyAccessRules(company.data.id));

      const companyDetailed = await dispatch(CompaniesActions.fetchCompanyDetailsAndLogo(company.data));
      dispatch(CompaniesActions.setSelectedRootCompany(companyDetailed));

      const companyPhotoTypes = companyDetailed.photoTypes ? _.map(companyDetailed.photoTypes, (photoType) => photoType.id) : [];
      dispatch(initialize('CompanyForm', { ...companyDetailed, photoTypes: companyPhotoTypes }));

      dispatch(UserActions.setUserCompanyAbilityProvider(company.data.id));

      // if !isBoom then we don't have the id of root company
      const idsWithoutRoot = ids.slice(!isBoom ? 1 : 2);

      const companiesRequests = idsWithoutRoot.map((companyId) => getOrganizationCompany(organizationId, companyId));
      Promise.all(companiesRequests).then((responses) => {
        const results = responses.map(({ data }) => data);
        dispatch(CompaniesActions.addNewNavigationLevels(results));
      });
    } catch (err) {
      dispatch(
        ModalsActions.showModal('COMPANIES_FETCH_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('modals.somethingWentWrong'),
          },
        })
      );
    } finally {
      dispatch(UtilsActions.setSpinnerVisibile(false));
    }
  };

  onTabChange(event, value) {
    this.setState({ tabIndexSelected: value });
  }

  async onFetchBalance() {
    const { dispatch } = this.props;
    await dispatch(BalanceActions.fetchCompanyBalance());
  }

  async onLevelSelected(company, level) {
    const { dispatch, location, history } = this.props;
    dispatch(CompaniesActions.jumpToNewNavigationLevel(level));

    const ids = location.pathname.split('/');
    const pathIndex = ids.findIndex((id) => Number(id) === company.id);
    const updatedIndex = ids.slice(0, pathIndex + 1);
    history.push(updatedIndex.join('/'));

    this.onOpenCompanyPage(company);
  }

  async onInitializeCompanyDetails(company) {
    const { dispatch } = this.props;
    const companyDetailed = await dispatch(CompaniesActions.fetchCompanyDetailsAndLogo(company));
    await dispatch(UserActions.fetchCompanyAccessRules(company.id));
    dispatch(CompaniesActions.setSelectedRootCompany(companyDetailed));
    dispatch(UserActions.setUserCompanyAbilityProvider(company.id));
    const companyPhotoTypes = companyDetailed.photoTypes ? _.map(companyDetailed.photoTypes, (photoType) => photoType.id) : [];
    dispatch(initialize('CompanyForm', { ...companyDetailed, photoTypes: companyPhotoTypes }));
  }

  async onRootSelected(organization) {
    const { history, dispatch } = this.props;

    if (organization.contactCenter) {
      return;
    }

    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      dispatch(OrganizationsActions.setSelectedOrganization(organization));
      const company = await dispatch(OrganizationsActions.fetchRootCompany(organization.id));
      dispatch(CompaniesActions.setSelectedRootCompany(company));
      dispatch(CompaniesActions.resetSubCompanies());
      dispatch(CompaniesActions.resetCompanyChecklist());
      dispatch(CompaniesActions.resetSubCompaniesFilters());
      dispatch(CompaniesActions.resetCompanyPricingPackages());
      await dispatch(CompaniesActions.fetchSubCompaniesAndLogos());
      await this.onInitializeCompanyDetails(company);
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(UsersActions.resetUsersData());
      dispatch(CompaniesActions.jumpToNewNavigationLevel(0));
      history.push(`/companies/${organization.id}/${company.id}`);
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('ORGANIZATION_DELETE_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('organization.organizationDetailsError'),
          },
        })
      );
    }
  }

  async onOpenCompanyPage(company) {
    const { dispatch } = this.props;
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      dispatch(CompaniesActions.resetSubCompanies());
      dispatch(CompaniesActions.resetSubCompaniesFilters());
      dispatch(CompaniesActions.resetCompanyChecklist());
      dispatch(OrganizationsActions.resetPricingPackagesData());
      dispatch(CompaniesActions.resetCompanyPricingPackages());
      dispatch(CompaniesActions.setSelectedRootCompany(company));
      await dispatch(CompaniesActions.fetchSubCompaniesAndLogos());
      dispatch(UsersActions.resetUsersData());
      dispatch(CompaniesActions.addNewNavigationLevel(company));
      await this.onInitializeCompanyDetails(company);
      dispatch(UtilsActions.setSpinnerVisibile(false));
      this.setState({ tabIndexSelected: 0 });
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('ORGANIZATION_DELETE_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('organization.organizationDetailsError'),
          },
        })
      );
    }
  }

  getAvailableTabs(isBoomTheRoot, isMyOrganization) {
    const canReadInvoicesItems = AbilityProvider.getCompanyAbilityHelper().hasPermission(
      [PERMISSIONS.BALANCE],
      PERMISSION_ENTITIES.COMPANY
    );
    const canReadPricingPackages = AbilityProvider.getCompanyAbilityHelper().hasPermission(
      [PERMISSIONS.READ],
      PERMISSION_ENTITIES.PRICINGPACKAGE
    );
    const canReadAuthService = AbilityProvider.getCompanyAbilityHelper().hasPermission(
      [PERMISSIONS.READ],
      PERMISSION_ENTITIES.AUTHORIZEDSERVICE
    );
    const canReadChecklist = AbilityProvider.getCompanyAbilityHelper().hasPermission([PERMISSIONS.READ], PERMISSION_ENTITIES.CHECKLIST);
    const canReadCompanyPenaltiesConfig = AbilityProvider.getCompanyAbilityHelper().hasPermission(
      [PERMISSIONS.READ],
      PERMISSION_ENTITIES.COMPANYPENALTIESCONFIG
    );

    const {
      companies: { selectedRootCompany },
      organizations: { selectedOrganization: organization },
    } = this.props;


    const isOrganization = selectedRootCompany.parentCompany === 1;

    const isB1Enabled = featureFlag.isFeatureEnabled('b1-new-company-structure');

    if (selectedRootCompany.tier === OrganizationTier.SMB || organization.segment === Segment.SMB) {
      return [
        {
          tab: (
            <Tab
              key="companyDetails"
              label={isB1Enabled ? translations.t('company.overview') : translations.t('company.overviewOld')}
              icon={<DetailsIcon />}
            />
          ),
          content: isOrganization ? <OrganizationDetailsView /> : <CompanyDetailsView />,
        },
        {
          tab: <Tab key="pricingPackage" label={translations.t('company.pricingPackage')} icon={<PricingPackagesIcon />} />,
          content: <PricingPackageView />,
        },
      ];
    }

    let tabsWithContent = [
      {
        tab: (
          <Tab
            key="companyDetails"
            label={isB1Enabled ? translations.t('company.overview') : translations.t('company.overviewOld')}
            icon={<DetailsIcon />}
          />
        ),
        content: isOrganization ? <OrganizationDetailsView /> : <CompanyDetailsView />,
      },
      {
        tab: (
          <Tab
            label={isB1Enabled ? translations.t('company.companies') : translations.t('company.companiesOld')}
            icon={<SubCompaniesIcon />}
          />
        ),
        content: <SubCompaniesView onOpenSubCompaniesCallback={() => this.setState({ tabIndexSelected: 0 })} />,
      },
    ];

    if (selectedRootCompany.contactCenter) {
      return tabsWithContent.slice(0, 1);
    }

    if (!isBoomTheRoot && canReadInvoicesItems) {
      tabsWithContent = [
        ...tabsWithContent,
        {
          tab: <Tab key="balance" label={translations.t('profile.accounting')} icon={<AccountingIcon />} />,
          content: (
            <div style={{ padding: 20 }}>
              <BalanceView organization={organization} onFetchBalance={() => this.onFetchBalance()} />
            </div>
          ),
        },
      ];
    }

    if (!isBoomTheRoot && canReadPricingPackages) {
      tabsWithContent = [
        ...tabsWithContent,
        {
          tab: <Tab key="pricingPackage" label={translations.t('company.pricingPackages')} icon={<PricingPackagesIcon />} />,
          content: <PricingPackageView />,
        },
      ];
    }

    if (!isBoomTheRoot && canReadAuthService && isMyOrganization) {
      tabsWithContent = [
        ...tabsWithContent,
        {
          tab: <Tab key="auth" label={translations.t('company.authorizedService')} icon={<AuthServiceIcon />} />,
          content: (
            <div style={{ padding: 20 }}>
              <AuthServicesView />
            </div>
          ),
        },
      ];
    }

    if ((!isBoomTheRoot && canReadChecklist) || !canReadAuthService) {
      tabsWithContent = [
        ...tabsWithContent,
        {
          tab: <Tab key="checklists" label={translations.t('company.organizationChecklists')} icon={<ChecklistIcon />} />,
          content: (
            <div style={{ padding: 20 }}>
              <ChecklistView />
            </div>
          ),
        },
      ];
    }

    if (!isBoomTheRoot && canReadCompanyPenaltiesConfig) {
      tabsWithContent = [
        ...tabsWithContent,
        {
          tab: <Tab key="penalties" label={translations.t('company.companyPenaltiesConfig')} icon={<SettingsIcon />} />,
          content: (
            <div style={{ padding: 20 }}>
              <CompanyPenaltiesConfigView onFetchBalance={() => this.onFetchBalance()} company={selectedRootCompany} />
            </div>
          ),
        },
      ];
    }

    return tabsWithContent;
  }

  render() {
    const {
      classes,
      companies: {
        navigation: { levels: navigationLevels },
        selectedRootCompany,
      },
      organizations: { selectedOrganization: organization },
      history,
      user: { data: userData },
    } = this.props;

    const { tabIndexSelected } = this.state;
    const isMyOrganization = userData.isBoom || selectedRootCompany.id === userData.organization;
    const tabsWithContent = this.getAvailableTabs(selectedRootCompany.id === 1, isMyOrganization);

    return (
      <MuiThemeProvider theme={theme}>
        <div style={{ backgroundColor: '#f5f6f7', display: 'flex', justifyContent: 'center', minHeight: '100%' }}>
          <div className={classes.container} style={{ width: 1440, marginBottom: 40 }}>
            <CompaniesNavigator
              rootLevel={userData.organization === 1 ? organization : null}
              titles={navigationLevels}
              onHomeLevelSelected={() => history.push('/rootCompanies')}
              onRootSelected={() => this.onRootSelected(organization)}
              onLevelSelected={(company, level) => this.onLevelSelected(company, level)}
            />
            <AppBar position="static" color="default" style={{ backgroundColor: 'white' }}>
              <Tabs
                value={tabIndexSelected}
                onChange={(event, index) => this.onTabChange(event, index)}
                variant="scrollable"
                scrollButtons="on"
                indicatorColor="primary"
                textColor="primary"
              >
                {tabsWithContent.map(({ tab }) => tab)}
              </Tabs>
            </AppBar>
            <Paper square className={classes.innerContainer}>
              {tabsWithContent[tabIndexSelected].content}
            </Paper>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = (state) => ({
  organizations: state.organizations,
  companies: state.companies,
  user: state.user,
});

export default connect(mapStateToProps)(withStyles(styles)(withRouter(CompanyTabbedView)));
