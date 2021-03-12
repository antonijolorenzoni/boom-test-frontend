import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Switch } from 'ui-boom-components';

export const CalendarTableSwitch: React.FC<{
  calendarVisible: boolean;
  onChangeCalendarVisible: React.Dispatch<boolean>;
}> = ({ calendarVisible, onChangeCalendarVisible }) => {
  const { t } = useTranslation();

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variantName={calendarVisible ? 'body2' : 'body1'} textColor={calendarVisible ? '#80888D' : '#000000'}>
        {t('dashboards.orderList')}
      </Typography>
      <Switch id="calendarVisible" checked={calendarVisible} onChange={() => onChangeCalendarVisible(!calendarVisible)} />
      <Typography variantName={calendarVisible ? 'body1' : 'body2'} textColor={calendarVisible ? '#000000' : '#80888D'}>
        {t('dashboards.calendar')}
      </Typography>
    </div>
  );
};
