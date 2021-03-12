import React from 'react';
import ActivityIconSelected from '../../assets/header/activity-selected.svg';
import ActivityIcon from '../../assets/header/activity.svg';
import CalendarSelected from '../../assets/header/calendar-selected.svg';
import CalendarIcon from '../../assets/header/calendar.svg';
import CompaniesIconSelected from '../../assets/header/companies-selected.svg';
import CompaniesIcon from '../../assets/header/companies.svg';
import DownloadIconSelected from '../../assets/header/download-selected.svg';
import DownloadIcon from '../../assets/header/download.svg';
import PhotographersIconSelected from '../../assets/header/photographers-selected.svg';
import PhotographersIcon from '../../assets/header/photographers.svg';
import UsersIconSelected from '../../assets/header/users-selected.svg';
import UsersIcon from '../../assets/header/users.svg';
import AccountingHeaderIcon from '../../assets/header/accounting.svg';
import AccountingHeaderIconSelected from '../../assets/header/accounting-selected.svg';
import HeaderButton from '../../components/Header/HeaderButton';
import { useTranslation } from 'react-i18next';
import { PERMISSIONS, PERMISSION_ENTITIES, USER_ROLES } from '../../config/consts';
import { Icon } from 'ui-boom-components';
import { ShowForPermissions, ShowForRoles, useIsUserEnabled } from 'components/Permission/ShowFor';
import HideFor from 'components/Permission/HideFor';
import { Header } from './styles';
import { useWhoAmI } from 'hook/useWhoAmI';
import { featureFlag } from 'config/featureFlags';
import { Permission } from 'types/Permission';
import AbilityProvider from 'utils/AbilityProvider';
import PermissionOld from 'components/Permission/Permission';

const HeaderMenu = ({ isMobile }) => {
  const { t } = useTranslation();
  const isOpenDateEnabled = featureFlag.isFeatureEnabled('open-date');
  const isU3Enabled = featureFlag.isFeatureEnabled('client-dashboard-all-u3');
  const isB1Enabled = featureFlag.isFeatureEnabled('b1-new-company-structure');

  const { isBoom, isClient, isCcUser, isSMB } = useWhoAmI();
  const canReadAndCreateUser = useIsUserEnabled([Permission.UserRead, Permission.UserCreate]) || isCcUser;

  const getOrganizationLabel = () => {
    if (!isB1Enabled) {
      return 'header.companies';
    }
    if (isBoom) {
      return 'header.organizations';
    }
    return 'header.organization';
  };

  return (
    <Header isMobile={isMobile}>
      {(isBoom || isCcUser || (isClient && isU3Enabled) || isSMB) && isOpenDateEnabled && (
        <HeaderButton
          title={t('header.dashboard').toUpperCase()}
          iconComponent={<Icon name="dashboard" />}
          paths={['/', '/orders-dashboard']}
        />
      )}
      <ShowForRoles roles={[USER_ROLES.ROLE_PHOTOGRAPHER]}>
        <HeaderButton
          title={t('header.calendars').toUpperCase()}
          icon={CalendarIcon}
          iconSelected={CalendarSelected}
          paths={['/', '/calendar']}
        />
      </ShowForRoles>
      <PermissionOld
        do={[PERMISSIONS.PHOTOGRAPHER]}
        on={PERMISSION_ENTITIES.SHOOTING}
        abilityHelper={AbilityProvider.getOrganizationAbilityHelper()}
      >
        <HeaderButton
          title={t('header.activities').toUpperCase()}
          icon={ActivityIcon}
          iconSelected={ActivityIconSelected}
          paths={['/shootingsActivities']}
        />
      </PermissionOld>
      <ShowForRoles roles={[USER_ROLES.ROLE_PHOTOGRAPHER]}>
        <HeaderButton
          title={t('header.shootingsHistory').toUpperCase()}
          icon={DownloadIcon}
          iconSelected={DownloadIconSelected}
          paths={['/download']}
        />
      </ShowForRoles>
      <HideFor roles={[USER_ROLES.ROLE_CONTACT_CENTER, USER_ROLES.ROLE_SMB]}>
        <PermissionOld
          do={[PERMISSIONS.CREATE, PERMISSIONS.READ, PERMISSIONS.UPDATE, PERMISSIONS.DELETE, PERMISSIONS.ACL]}
          on={PERMISSION_ENTITIES.COMPANY}
          abilityHelper={AbilityProvider.getOrganizationAbilityHelper()}
        >
          <HeaderButton
            title={t(getOrganizationLabel()).toUpperCase()}
            icon={CompaniesIcon}
            iconSelected={CompaniesIconSelected}
            paths={['/rootCompanies', '/companies']}
          />
        </PermissionOld>
      </HideFor>
      <HideFor roles={[USER_ROLES.ROLE_SMB]}>
        {canReadAndCreateUser && (
          <HeaderButton
            title={t('header.users').toUpperCase()}
            icon={UsersIcon}
            iconSelected={UsersIconSelected}
            paths={['/usersRootCompanies', '/users']}
          />
        )}
      </HideFor>
      <ShowForPermissions permissions={[Permission.PhotographerRead, Permission.PhotographerCreate]}>
        <HeaderButton
          title={t('header.photographers').toUpperCase()}
          icon={PhotographersIcon}
          iconSelected={PhotographersIconSelected}
          paths={['/photographers']}
        />
      </ShowForPermissions>
      <ShowForRoles roles={[USER_ROLES.ROLE_PHOTOGRAPHER]}>
        <HeaderButton
          title={t('header.accounting').toUpperCase()}
          icon={AccountingHeaderIcon}
          iconSelected={AccountingHeaderIconSelected}
          paths={['/photographerAccounting']}
        />
      </ShowForRoles>
    </Header>
  );
};

export default HeaderMenu;
