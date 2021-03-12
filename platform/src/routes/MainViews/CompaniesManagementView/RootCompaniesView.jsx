//
// ────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: C O M P A N Y   N A V I G A T I O N   V I E W : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────
//

import _ from 'lodash';
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { initialize } from 'redux-form';

import { CreateOrganizationForm } from 'components/Forms/Organization/CreateOrganizationForm';
import ListComponent from 'components/ListComponent/ListComponent';
import RootCompanyRow from 'components/ListComponent/RowComponents/RootCompanyRow';
import MDButton from 'components/MDButton/MDButton';
import * as CompaniesActions from 'redux/actions/companies.actions';
import * as OrganizationsActions from 'redux/actions/organizations.actions';
import * as UsersActions from 'redux/actions/users.actions';
import * as UtilsActions from 'redux/actions/utils.actions';
import * as ModalsActions from 'redux/actions/modals.actions';
import * as UserActions from 'redux/actions/user.actions';
import translations from 'translations/i18next';
import AbilityProvider from 'utils/AbilityProvider';
import { PERMISSIONS, PERMISSION_ENTITIES } from 'config/consts';
import PermissionOLD from 'components/Permission/Permission';
import Spinner from 'components/Spinner/Spinner';
import useSWR from 'swr';
import { listContactCenters } from 'api/paths/contact-center';
import { axiosBoomInstance } from 'api/instances/boomInstance';
import { useIsUserEnabled } from 'components/Permission/ShowFor';
import { Permission } from 'types/Permission';
import { featureFlag } from 'config/featureFlags';

const RootCompaniesView = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const { isBoom, organization: userOrganization } = useSelector((state) => state.user.data);
  const { companiesData, companiesPagination, rootCompanies, rootCompaniesPagination } = useSelector((state) => ({
    companiesData: state.companies.data.content,
    companiesPagination: state.companies.data.pagination,
    rootCompanies: state.companies.rootCompanies.content,
    rootCompaniesPagination: state.companies.rootCompanies.pagination,
  }));

  const canReadContactCenter = useIsUserEnabled([Permission.ContactCenterRead]);
  const contactCenterFF = featureFlag.isFeatureEnabled('c1-compliance') ? canReadContactCenter : true;
  const isB1Enabled = featureFlag.isFeatureEnabled('b1-new-company-structure');

  const { data: listContactCentersResponse, error: contactCentersError } = useSWR(
    isBoom && contactCenterFF ? listContactCenters : null,
    axiosBoomInstance.get
  );

  const contactCenters = _.get(listContactCentersResponse, 'data', []);

  const history = useHistory();

  useEffect(() => {
    if (contactCentersError) {
      dispatch(
        ModalsActions.showModal('LIST_CONTACT_CENTERS_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('contactCenter.listContactCenterError'),
          },
        })
      );
    }
  }, [dispatch, contactCentersError]);

  const onFetchRootCompaniesForUserRole = useCallback(async () => {
    if (!isBoom) {
      setLoading(true);
      try {
        const organization = await dispatch(OrganizationsActions.fetchOrganizationDetails(userOrganization));
        dispatch(OrganizationsActions.setSelectedOrganization(organization));
        await dispatch(CompaniesActions.fetchCompanies());
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        await dispatch(CompaniesActions.fetchRootCompanies());
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
  }, [dispatch, isBoom, userOrganization]);

  const onSearchRootCompanies = async (value) => {
    if (!isBoom) {
      dispatch(CompaniesActions.setCompaniesFilter('name', value.name));
    } else {
      dispatch(CompaniesActions.setRootCompaniesFilter('name', value.name));
    }
    onFetchRootCompaniesForUserRole();
  };

  const onResetRootCompanyFilters = async () => {
    if (!isBoom) {
      dispatch(CompaniesActions.resetCompaniesFilters());
    } else {
      dispatch(CompaniesActions.resetRootCompaniesFilters());
    }
    onFetchRootCompaniesForUserRole();
  };

  const onAppendCompanies = async (page) => {
    if (!isBoom) {
      const organization = await dispatch(OrganizationsActions.fetchOrganizationDetails(userOrganization));
      dispatch(OrganizationsActions.setSelectedOrganization(organization));
      await dispatch(CompaniesActions.fetchAppendCompanies(page));
    } else {
      await dispatch(CompaniesActions.fetchAndAppendRootCompanies(page));
    }
  };

  const onInitializeCompanyDetails = async (company) => {
    const companyDetailed = await dispatch(CompaniesActions.fetchCompanyDetailsAndLogo(company));
    await dispatch(UserActions.fetchCompanyAccessRules(company.id));
    dispatch(CompaniesActions.setSelectedRootCompany(companyDetailed));
    dispatch(UserActions.setUserCompanyAbilityProvider(company.id));
    const companyPhotoTypes = companyDetailed.photoTypes ? _.map(companyDetailed.photoTypes, (photoType) => photoType.id) : [];
    dispatch(initialize('CompanyForm', { ...companyDetailed, photoTypes: companyPhotoTypes }));
  };

  const onOpenSubCompanies = async (rootCompany) => {
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      dispatch(OrganizationsActions.setSelectedOrganization(rootCompany));
      try {
        await dispatch(OrganizationsActions.fetchOrganizationAuthorizedService());
      } catch (error) {}
      const company = await dispatch(OrganizationsActions.fetchRootCompany(rootCompany.id));
      dispatch(CompaniesActions.setSelectedRootCompany(company));
      dispatch(CompaniesActions.resetSubCompanies());
      dispatch(CompaniesActions.resetCompanyPricingPackages());
      dispatch(OrganizationsActions.resetPricingPackagesData());
      dispatch(UsersActions.resetUsersData());
      await dispatch(CompaniesActions.fetchSubCompaniesAndLogos());
      await onInitializeCompanyDetails(company);
      dispatch(UtilsActions.setSpinnerVisibile(false));
      history.push(`/companies/${company.organization}/${company.id}`);
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
  };

  const onOpenOrganizationOverview = async (organization) => {
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      dispatch(OrganizationsActions.setSelectedOrganization(organization));
      try {
        await dispatch(OrganizationsActions.fetchOrganizationAuthorizedService());
      } catch (error) {}
      dispatch(CompaniesActions.resetSubCompanies());
      dispatch(CompaniesActions.resetCompanyPricingPackages());
      dispatch(OrganizationsActions.resetPricingPackagesData());
      dispatch(UsersActions.resetUsersData());
      //await dispatch(CompaniesActions.fetchSubCompaniesAndLogos()); FIXME when BE guys add the endpoint
      //await onInitializeCompanyDetails(company);
      dispatch(UtilsActions.setSpinnerVisibile(false));
      history.push(`/companies/${organization.id}`);
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
  };

  const onOpenCompaniesDetails = async (company) => {
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      dispatch(CompaniesActions.setSelectedRootCompany(company));
      dispatch(CompaniesActions.resetSubCompanies());
      dispatch(CompaniesActions.resetCompanyPricingPackages());
      dispatch(OrganizationsActions.resetPricingPackagesData());
      dispatch(UsersActions.resetUsersData());
      await dispatch(CompaniesActions.fetchSubCompaniesAndLogos());
      await onInitializeCompanyDetails(company);
      dispatch(CompaniesActions.addNewNavigationLevel(company));
      dispatch(UtilsActions.setSpinnerVisibile(false));
      history.push(`/companies/${company.organization}/${company.id}`);
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
  };

  const onOpenContactCenterDetails = async ({ id, name, ...rest }) => {
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      dispatch(CompaniesActions.setSelectedRootCompany({ id, name, contactCenter: true }));
      dispatch(OrganizationsActions.setSelectedOrganization({ id, name, contactCenter: true }));
      dispatch(CompaniesActions.resetSubCompanies());
      dispatch(CompaniesActions.resetCompanyPricingPackages());
      dispatch(OrganizationsActions.resetPricingPackagesData());
      dispatch(UsersActions.resetUsersData());
      dispatch(UtilsActions.setSpinnerVisibile(false));
      history.push(`/companies/contact-center`);
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
  };

  const onNewCompanyPressed = () => {
    dispatch(
      ModalsActions.showModal('ORGANIZATION_FORM', {
        modalType: 'OPERATIONAL_VIEW',
        modalProps: {
          containerstyle: { width: '33vw', minWidth: '540px' },
          content: <CreateOrganizationForm />,
        },
      })
    );
  };

  useEffect(() => {
    dispatch(CompaniesActions.resetRootCompanies());
    dispatch(UsersActions.resetUsersData());
    dispatch(CompaniesActions.jumpToNewNavigationLevel(0));
    onFetchRootCompaniesForUserRole();
  }, [dispatch, onFetchRootCompaniesForUserRole]);

  return (
    <div style={{ paddingLeft: 20, paddingTop: 20 }}>
      <h2 style={{ marginTop: 0 }}>{translations.t('header.companies')}</h2>
      <h3>{isB1Enabled ? translations.t('company.rootCompaniesDescription') : translations.t('company.rootCompaniesDescriptionOld')}</h3>
      <PermissionOLD
        do={[PERMISSIONS.CREATE]}
        on={PERMISSION_ENTITIES.ORGANIZATION}
        abilityHelper={AbilityProvider.getOrganizationAbilityHelper()}
      >
        <MDButton
          title={translations.t('forms.createNew')}
          className="gradient-button"
          titleStyle={{ fontSize: 15 }}
          containerstyle={{ width: '50%', marginTop: 20, marginBottom: 20 }}
          backgroundColor="#5AC0B1"
          onClick={onNewCompanyPressed}
        />
      </PermissionOLD>
      <ListComponent
        pagination={!isBoom ? companiesPagination : rootCompaniesPagination}
        newElementText={isB1Enabled ? translations.t('company.createCompany') : translations.t('company.createCompanyOld')}
        containerstyle={{ width: '90%' }}
        onSearch={onSearchRootCompanies}
        onResetFilters={onResetRootCompanyFilters}
        onLoadMore={onAppendCompanies}
      >
        {listContactCentersResponse && contactCenters[0] && (
          <RootCompanyRow
            rootCompany={{ name: contactCenters[0].name }}
            outerContainerstyle={{ marginTop: 15 }}
            onClick={() => onOpenContactCenterDetails(contactCenters[0])}
          />
        )}
        {_.map(!isBoom ? companiesData : rootCompanies, (company) => (
          <RootCompanyRow
            key={company.id}
            rootCompany={company}
            outerContainerstyle={{ marginTop: 15 }}
            onClick={() =>
              isBoom ? (isB1Enabled ? onOpenOrganizationOverview(company) : onOpenSubCompanies(company)) : onOpenCompaniesDetails(company)
            }
          />
        ))}
        {loading && (
          <Spinner
            title={translations.t('general.loading')}
            hideLogo
            spinnerStyle={{ color: '#5AC0B1', marginTop: 10 }}
            titleStyle={{ color: '#80888d', marginTop: 5, fontSize: 12 }}
          />
        )}
      </ListComponent>
    </div>
  );
};

export default RootCompaniesView;
