import React, { useMemo, useState } from 'react';
import { Tabs, Tab } from 'ui-boom-components';
import { useTranslation } from 'react-i18next';

import { UnscheduledTabContent } from 'components/Dashboards/UnscheduledTabContent';
import { featureFlag } from 'config/featureFlags';
import { AllTabContent } from 'components/Dashboards/AllTabContent';
import { useWhoAmI } from 'hook/useWhoAmI';
import { Permission } from 'types/Permission';
import { useIsUserEnabled } from 'components/Permission/ShowFor';

export const DashboardPage = () => {
  const isU2Enabled = featureFlag.isFeatureEnabled('dashboard-all-u2');
  const { isCcUser } = useWhoAmI();
  const [activeTab, setActiveTab] = useState(isU2Enabled && !isCcUser ? 'all' : 'unscheduling');
  const [unscheduledCounter, setUnscheduledCounter] = useState<number>();
  const [allCounter, setAllCounter] = useState<number>();

  const canScheduleOrder = useIsUserEnabled([Permission.ShootingSchedule]);

  const { t } = useTranslation();

  const tabs = useMemo(() => {
    let tabs: Array<JSX.Element> = [];

    if (canScheduleOrder) {
      tabs = [
        <Tab key="unscheduling" iconName="reorder" name="unscheduling" label={t('dashboards.scheduling')} counter={unscheduledCounter}>
          <UnscheduledTabContent onUpdateCounter={setUnscheduledCounter} />
        </Tab>,
      ];
    }

    if (isU2Enabled && !isCcUser) {
      tabs = [
        <Tab key="all" iconName="calendar_today" name="all" label={t('dashboards.all')} counter={allCounter}>
          <AllTabContent onUpdateCounter={setAllCounter} />
        </Tab>,
        ...tabs,
      ];
    }

    return tabs;
  }, [t, allCounter, unscheduledCounter, isU2Enabled, isCcUser, canScheduleOrder]);

  return (
    <div style={{ padding: '0 5px', backgroundColor: '#f5f6f7' }} data-testid="tabs-wrapper">
      <Tabs onClick={setActiveTab} activeTab={activeTab} color="#5AC0B1">
        {tabs}
      </Tabs>
    </div>
  );
};
