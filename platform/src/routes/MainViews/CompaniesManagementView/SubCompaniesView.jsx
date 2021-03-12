//
// ──────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: S U B C O M P A N I E S   N A V I G A T I O N   V I E W : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import { MuiThemeProvider, withStyles } from '@material-ui/core';
import CompanyIcon from '@material-ui/icons/DomainDisabled';
import { createMuiTheme } from '@material-ui/core/styles';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { initialize, reset, destroy } from 'redux-form';
import CompanyForm from '../../../components/Forms/ReduxForms/Companies/CompanyForm';
import ListComponent from '../../../components/ListComponent/ListComponent';
import CompanyRow from '../../../components/ListComponent/RowComponents/CompanyRow';
import * as CompaniesActions from '../../../redux/actions/companies.actions';
import * as UtilsActions from '../../../redux/actions/utils.actions';
import * as UserActions from '../../../redux/actions/user.actions';
import * as ModalsActions from '../../../redux/actions/modals.actions';
import translations from '../../../translations/i18next';
import { PERMISSION_ENTITIES, PERMISSIONS } from '../../../config/consts';
import AbilityProvider from '../../../utils/AbilityProvider';
import { photoTypesWithoutOthers } from 'utils/orders';
import { featureFlag } from 'config/featureFlags';

const styles = (theme) => ({
  container: {
    padding: 20,
  },
  innerContainer: {
    padding: 10,
  },
  noCompaniesContainer: {
    padding: 20,
    display: 'flex',
    alignItems: 'center',
  },
  noCompanyText: {
    margin: 0,
    color: '#7F888F',
  },
  noCompanyIcon: {
    fontSize: 40,
    color: '#7F888F',
    marginRight: 20,
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

class SubCompaniesView extends React.Component {
  async componentWillMount() {
    const {
      history,
      organizations: { selectedOrganization: organization },
    } = this.props;

    if (!organization || _.isEmpty(organization)) {
      history.push('/rootCompanies');
    }
  }

  async onCompanyFormSubmit(companyData) {
    if (companyData.id) {
      await this.onModifyCompany(companyData);
    } else {
      await this.onCreateNewCompany(companyData);
    }
  }

  async onModifyCompany(companyData) {
    const { dispatch } = this.props;
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await dispatch(CompaniesActions.updateCompany(companyData));
      await dispatch(CompaniesActions.updateCompanyDetails(companyData));
      if (companyData.logo && _.isArray(companyData.logo)) {
        await dispatch(CompaniesActions.deleteAndUpdateCompanyLogo(companyData.id, _.first(companyData.logo)));
      }
      dispatch(reset('CompanyForm'));
      dispatch(ModalsActions.hideModal('COMPANY_FORM'));
      dispatch(UtilsActions.setSpinnerVisibile(false));
      await dispatch(CompaniesActions.fetchSubCompaniesAndLogos());
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('COMPANY_MODIFY_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('company.modifyCompanyError'),
          },
        })
      );
    }
  }

  async onCreateNewCompany(companyData) {
    const { dispatch } = this.props;
    const isB1Enabled = featureFlag.isFeatureEnabled('b1-new-company-structure');
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      const createdCompany = await dispatch(CompaniesActions.createCompany(companyData));
      if (companyData.logo && _.isArray(companyData.logo)) {
        await dispatch(CompaniesActions.createCompanyLogo(createdCompany.id, _.first(companyData.logo)));
      }
      dispatch(reset('CompanyForm'));
      dispatch(ModalsActions.hideModal('COMPANY_FORM'));
      dispatch(UtilsActions.setSpinnerVisibile(false));
      await dispatch(CompaniesActions.fetchSubCompaniesAndLogos());
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('COMPANY_CREATE_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: isB1Enabled ? translations.t('company.createCompanyError') : translations.t('company.createCompanyErrorOld'),
          },
        })
      );
    }
  }

  async onAppendCompanies(page) {
    const { dispatch } = this.props;
    await dispatch(CompaniesActions.fetchAppendSubCompaniesWithLogos(page));
  }

  onNewCompany() {
    const {
      dispatch,
      user: { photoTypes },
    } = this.props;
    dispatch(destroy('CompanyForm'));
    dispatch(
      ModalsActions.showModal('COMPANY_FORM', {
        modalType: 'OPERATIONAL_VIEW',
        modalProps: {
          content: (
            <CompanyForm
              photoTypes={photoTypesWithoutOthers(photoTypes)}
              onSubmit={(companyData) => this.onCompanyFormSubmit(companyData)}
            />
          ),
        },
      })
    );
  }

  async onSearchCompany(filters) {
    const { dispatch } = this.props;
    dispatch(UtilsActions.setSpinnerVisibile(true));
    try {
      dispatch(CompaniesActions.setSubCompaniesFilter('name', filters.name));
      dispatch(CompaniesActions.resetSubCompanies());
      await dispatch(CompaniesActions.fetchSubCompaniesAndLogos());
      dispatch(UtilsActions.setSpinnerVisibile(false));
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
    }
  }

  async onResetCompanyFilters() {
    const { dispatch } = this.props;
    dispatch(UtilsActions.setSpinnerVisibile(true));
    try {
      dispatch(CompaniesActions.resetSubCompaniesFilters());
      await dispatch(CompaniesActions.fetchSubCompaniesAndLogos());
      dispatch(UtilsActions.setSpinnerVisibile(false));
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
    }
  }

  async onCompanyDetailsClick(company) {
    const {
      dispatch,
      user: { photoTypes },
    } = this.props;
    dispatch(UtilsActions.setSpinnerVisibile(true));
    let companyDetailed = company;
    try {
      companyDetailed = await dispatch(CompaniesActions.fetchCompanyDetails(company));
    } catch (error) {}
    const companyPhotoTypes = companyDetailed.photoTypes ? _.map(companyDetailed.photoTypes, (photoType) => photoType.id) : [];
    dispatch(initialize('CompanyForm', { ...companyDetailed, photoTypes: companyPhotoTypes }));
    dispatch(
      ModalsActions.showModal('COMPANY_FORM', {
        modalType: 'OPERATIONAL_VIEW',
        modalProps: {
          content: (
            <CompanyForm
              photoTypes={photoTypes}
              company={companyDetailed}
              onSubmit={(companyData) => this.onCompanyFormSubmit(companyData)}
            />
          ),
        },
      })
    );
    dispatch(UtilsActions.setSpinnerVisibile(false));
  }

  async onOpenSubCompanies(company) {
    const { history, dispatch, onOpenSubCompaniesCallback } = this.props;
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      dispatch(CompaniesActions.setSelectedRootCompany(company));
      dispatch(CompaniesActions.resetSubCompanies());
      await dispatch(CompaniesActions.fetchSubCompaniesAndLogos());
      dispatch(CompaniesActions.addNewNavigationLevel(company));
      await dispatch(UserActions.fetchCompanyAccessRules(company.id));
      dispatch(UserActions.setUserCompanyAbilityProvider(company.id));
      dispatch(UtilsActions.setSpinnerVisibile(false));
      history.push(`${this.props.location.pathname}/${company.id}`);
      onOpenSubCompaniesCallback();
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

  render() {
    const {
      classes,
      companies: {
        subCompanies: { content: companiesData, pagination: companiesPagination },
      },
    } = this.props;
    const canCreate = AbilityProvider.getCompanyAbilityHelper().hasPermission([PERMISSIONS.CREATE], PERMISSION_ENTITIES.COMPANY);

    const isB1Enabled = featureFlag.isFeatureEnabled('b1-new-company-structure');

    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.container}>
          <ListComponent
            pagination={companiesPagination}
            newElementText={isB1Enabled ? translations.t('company.createCompany') : translations.t('company.createCompanyOld')}
            containerstyle={{ width: '90%' }}
            onLoadMore={(page) => this.onAppendCompanies(page)}
            onCreateNew={canCreate ? () => this.onNewCompany() : null}
            onSearch={(values) => this.onSearchCompany(values)}
            onResetFilters={() => this.onResetCompanyFilters()}
          >
            {_.map(companiesData, (company) => (
              <CompanyRow
                key={company.id}
                company={company}
                outerContainerstyle={{ marginTop: 15 }}
                onClick={() => this.onOpenSubCompanies(company)}
              />
            ))}
          </ListComponent>
          {_.isEmpty(companiesData) && (
            <div className={classes.noCompaniesContainer}>
              <CompanyIcon className={classes.noCompanyIcon} />
              <h4 className={classes.noCompanyText}>
                {isB1Enabled ? translations.t('company.noCompaniesFound') : translations.t('company.noCompaniesFoundOld')}
              </h4>
            </div>
          )}
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

export default connect(mapStateToProps)(withStyles(styles)(withRouter(SubCompaniesView)));
