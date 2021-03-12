//
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: C O M P A N Y   N A V I G A T I O N   F O R   P L A T F O R M   U S E R S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import { withStyles } from '@material-ui/core';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ListComponent from 'components/ListComponent/ListComponent';
import RootCompanyRow from 'components/ListComponent/RowComponents/RootCompanyRow';
import * as CompaniesActions from 'redux/actions/companies.actions';
import * as OrganizationsActions from 'redux/actions/organizations.actions';
import * as UsersActions from 'redux/actions/users.actions';
import * as UtilsActions from 'redux/actions/utils.actions';
import * as UserActions from 'redux/actions/user.actions';
import * as ModalsActions from 'redux/actions/modals.actions';
import Spinner from 'components/Spinner/Spinner';
import useSWR from 'swr';
import { axiosBoomInstance } from 'api/instances/boomInstance';
import { listContactCenters } from 'api/paths/contact-center';
import { useTranslation } from 'react-i18next';
import { USER_ROLES } from 'config/consts';
import { useIsUserEnabled } from 'components/Permission/ShowFor';
import { Permission } from 'types/Permission';
import { featureFlag } from 'config/featureFlags';

const styles = (theme) => ({
  container: {
    paddingLeft: 20,
    paddingTop: 20,
  },
});

const UsersCompaniesSelectorView = ({ classes }) => {
  const [isLoading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  const { t } = useTranslation();

  const { isBoom, isCcUser, userOrganization, rootCompanies, rootCompaniesPagination, companiesContent, companiesPagination } = useSelector(
    (state) => {
      return {
        isBoom: state.user.data.isBoom,
        isCcUser: _.get(state, 'user.data.roles', []).some((role) => role.name === USER_ROLES.ROLE_CONTACT_CENTER),
        userOrganization: state.user.data.organization,
        rootCompanies: state.companies.rootCompanies.content,
        rootCompaniesPagination: state.companies.rootCompanies.pagination,
        companiesContent: state.companies.data.content,
        companiesPagination: state.companies.data.pagination,
      };
    }
  );

  const canReadContactCenter = useIsUserEnabled([Permission.ContactCenterRead]);
  const contactCenterFF = featureFlag.isFeatureEnabled('c1-compliance') ? canReadContactCenter : true;

  const { data: listContactCentersResponse, error: contactCentersError } = useSWR(
    (isBoom || isCcUser) && contactCenterFF ? listContactCenters : null,
    axiosBoomInstance.get
  );

  const contactCenters = _.get(listContactCentersResponse, 'data', []);

  const isB1Enabled = featureFlag.isFeatureEnabled('b1-new-company-structure');

  useEffect(() => {
    if (contactCentersError) {
      dispatch(
        ModalsActions.showModal('LIST_CONTACT_CENTERS_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: t('contactCenter.listContactCenterError'),
          },
        })
      );
    }
  }, [dispatch, contactCentersError, t]);

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
      setLoading(true);
      try {
        await dispatch(CompaniesActions.fetchRootCompanies());
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
  }, [dispatch, isBoom, userOrganization]);

  useEffect(() => {
    dispatch(CompaniesActions.resetRootCompanies());
    dispatch(UsersActions.resetUsersData());
    onFetchRootCompaniesForUserRole();
  }, [dispatch, onFetchRootCompaniesForUserRole]);

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

  const onOpenUsers = async (rootCompany) => {
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      dispatch(OrganizationsActions.setSelectedOrganization(rootCompany));
      dispatch(CompaniesActions.resetCompaniesData());
      const company = await dispatch(OrganizationsActions.fetchRootCompany(rootCompany.id));
      dispatch(CompaniesActions.setSelectedRootCompany(company));
      await dispatch(UserActions.fetchCompanyAccessRules(company.id));
      dispatch(UserActions.setUserCompanyAbilityProvider(company.id));
      dispatch(UsersActions.resetUsersData());
      dispatch(UtilsActions.setSpinnerVisibile(false));
      history.push('/users');
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('ORGANIZATION_DELETE_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: t('organization.organizationDetailsError'),
          },
        })
      );
    }
  };

  const onOpenCompaniesUser = async (company) => {
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      dispatch(CompaniesActions.setSelectedRootCompany(company));
      dispatch(UsersActions.resetUsersData());
      dispatch(UsersActions.setUsersFilter('companyId', company.id));
      dispatch(CompaniesActions.addNewNavigationLevel(company));
      await dispatch(UserActions.fetchCompanyAccessRules(company.id));
      dispatch(UserActions.setUserCompanyAbilityProvider(company.id));
      dispatch(UtilsActions.setSpinnerVisibile(false));
      history.push('/users');
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('ORGANIZATION_DELETE_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: t('organization.organizationDetailsError'),
          },
        })
      );
    }
  };

  const onOpenContactCenterUsers = (contactCenter) => {
    dispatch(UtilsActions.setSpinnerVisibile(true));
    dispatch(CompaniesActions.setSelectedRootCompany({ ...contactCenter, contactCenter: true }));
    dispatch(OrganizationsActions.setSelectedOrganization({ ...contactCenter, contactCenter: true }));
    dispatch(UsersActions.resetUsersData());
    dispatch(UsersActions.setUsersFilter('companyId', contactCenters));
    dispatch(CompaniesActions.addNewNavigationLevel(contactCenters));
    dispatch(UtilsActions.setSpinnerVisibile(false));
    history.push('/users');
  };

  return (
    <div className={classes.container}>
      <h2 style={{ marginTop: 0 }}>{t('header.users')}</h2>
      <h3>{t('company.rootCompaniesUserDescription')}</h3>
      <ListComponent
        pagination={isBoom ? rootCompaniesPagination : companiesPagination}
        newElementText={isB1Enabled ? t('company.createCompany') : t('company.createCompanyOld')}
        containerstyle={{ width: '90%' }}
        onLoadMore={(page) => onAppendCompanies(page)}
        onResetFilters={() => onResetRootCompanyFilters()}
        onSearch={(values) => onSearchRootCompanies(values)}
      >
        {listContactCentersResponse && contactCenters[0] && (
          <RootCompanyRow
            rootCompany={{ name: contactCenters[0].name }}
            outerContainerstyle={{ marginTop: 15 }}
            onClick={() => onOpenContactCenterUsers(contactCenters[0])}
          />
        )}
        {_.map(isBoom ? rootCompanies : companiesContent, (company) => (
          <RootCompanyRow
            key={company.id}
            rootCompany={company}
            outerContainerstyle={{ marginTop: 15 }}
            onClick={() => (isBoom ? onOpenUsers(company) : onOpenCompaniesUser(company))}
          />
        ))}
        {isLoading && (
          <Spinner
            title={t('general.loading')}
            hideLogo
            spinnerStyle={{ color: '#5AC0B1', marginTop: 10 }}
            titleStyle={{ color: '#80888d', marginTop: 5, fontSize: 12 }}
          />
        )}
      </ListComponent>
    </div>
  );
};

export default withStyles(styles)(UsersCompaniesSelectorView);
