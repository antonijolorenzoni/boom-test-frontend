import React from 'react';
import get from 'lodash/get';

import { SHOOTINGS_STATUSES, PERMISSIONS, PERMISSION_ENTITIES } from '../../../config/consts';
import { mapOrderStatus } from '../../../config/utils';

import { InfosWrapper } from './styles';
import { Typography } from 'ui-boom-components';
import { useTranslation } from 'react-i18next';

import { SalesInfo } from './/SalesInfo';
import { ShootingInfo } from './/ShootingInfo';
import { SalesInfoMatched } from './SalesInfoMatched';
import { ShootingInfoMatched } from './ShootingInfoMatched';
import AbilityProvider from '../../../utils/AbilityProvider';
import { featureFlag } from 'config/featureFlags';
import { useSelector } from 'react-redux';

const AdminPhotographerShootingInfoDetails = ({
  isBoom,
  isPhotographer,
  statusColor,
  shooting,
  onShowSalesInfo,
  onShowShootingInfoForm,
}) => {
  const { t } = useTranslation();
  const { selectedOrganization } = useSelector((state) => ({
    selectedOrganization: state.organizations.selectedOrganization,
  }));

  const isB1Enabled = featureFlag.isFeatureEnabled('b1-new-company-structure');

  const { state, company, pricingPackage } = shooting;
  const mappedShootingState = mapOrderStatus(isBoom, isPhotographer, state);
  const isMatched = mappedShootingState === SHOOTINGS_STATUSES.MATCHED;
  const isCompleted = mappedShootingState === SHOOTINGS_STATUSES.DONE;
  const isAccepted = mappedShootingState === SHOOTINGS_STATUSES.ACCEPTED;

  const canReadChecklist = AbilityProvider.getOrganizationAbilityHelper().hasPermission([PERMISSIONS.READ], PERMISSION_ENTITIES.CHECKLIST);
  const checklistUrl = get(shooting, 'checklist.checklistUrl');

  return (
    <InfosWrapper isMatched={isMatched}>
      <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <Typography variantName="title3" textColor="rgba(255, 255, 255, 0.7)" style={{ margin: '10px 0', textTransform: 'uppercase' }}>
          {isBoom ? t('shootings.salesInfo') : ''}
        </Typography>
        {isMatched ? (
          <SalesInfoMatched
            isBoom={isBoom}
            companyName={company.name}
            segment={isB1Enabled ? selectedOrganization.segment : company.tier}
            pricingPackage={pricingPackage}
            statusColor={statusColor}
            canReadChecklist={canReadChecklist}
            checklistUrl={checklistUrl}
          />
        ) : (
          <SalesInfo
            isBoom={isBoom}
            isPhotographer={isPhotographer}
            companyName={company.name}
            segment={isB1Enabled ? selectedOrganization.segment : company.tier}
            pricingPackage={pricingPackage}
            statusColor={statusColor}
            canReadChecklist={canReadChecklist}
            checklistUrl={checklistUrl}
            onShowSalesInfo={onShowSalesInfo}
          />
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <Typography variantName="title3" textColor="rgba(255, 255, 255, 0.7)" style={{ margin: '10px 0', textTransform: 'uppercase' }}>
          {isBoom ? t('shootings.shootingInfo') : ''}
        </Typography>
        {isMatched ? (
          <ShootingInfoMatched
            shooting={shooting}
            onShowShootingInfoForm={onShowShootingInfoForm}
            statusColor={statusColor}
            isPhotographer={isPhotographer}
          />
        ) : (
          <ShootingInfo
            shooting={shooting}
            onShowShootingInfoForm={onShowShootingInfoForm}
            statusColor={statusColor}
            isPhotographer={isPhotographer}
            isAccepted={isAccepted}
            showDeliveryStatus={isCompleted}
          />
        )}
      </div>
    </InfosWrapper>
  );
};

export { AdminPhotographerShootingInfoDetails };
