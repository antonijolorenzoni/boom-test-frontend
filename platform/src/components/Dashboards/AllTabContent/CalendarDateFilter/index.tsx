import React, { useMemo, useState } from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { CalendarViewType } from 'types/CalendarViewType';
import { Icon, IconButton, Typography, VariantName } from 'ui-boom-components';

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  padding: 0 10px;
  height: 22px;
  border: 1px solid #a3abb1;
`;

export const CalendarDateFilter: React.FC<{
  from: string;
  viewType: CalendarViewType;
  onChangeView: (viewType: CalendarViewType) => void;
  onTodaySelection: () => void;
  onPrevious: () => void;
  onNext: () => void;
}> = ({ from, viewType = CalendarViewType.Week, onChangeView, onTodaySelection, onPrevious, onNext }) => {
  const { t, i18n } = useTranslation();
  moment.locale(i18n.languages[0]);

  const [selectedViewType, setSelectedViewType] = useState<CalendarViewType>(viewType);

  const selectedRange = useMemo(() => {
    if (selectedViewType === CalendarViewType.Day) {
      return moment(from).format('DD MMMM yyyy');
    }

    if (selectedViewType === CalendarViewType.Week) {
      const momentFrom = moment(from);
      const startOfWeekDay = momentFrom.startOf('week').format('DD');
      const startOfWeekMonth = momentFrom.startOf('week').format('MMM');
      const endOfWeekDay = momentFrom.endOf('week').format('DD');
      const endOfWeekMonth = momentFrom.endOf('week').format('MMM');

      return `${startOfWeekMonth} ${startOfWeekDay} - ${endOfWeekMonth} ${endOfWeekDay}`;
    }

    return moment(from).format('MMMM yyyy');
  }, [from, selectedViewType]);

  const getTypographyStyle = (viewType: CalendarViewType): { variantName: VariantName; textColor: string } =>
    viewType === selectedViewType ? { variantName: 'body1', textColor: '#000000' } : { variantName: 'body2', textColor: '#80888D' };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Typography variantName="textButton" style={{ textDecoration: 'underline', marginRight: 8 }} onClick={onTodaySelection}>
        Today
      </Typography>
      <div style={{ display: 'flex', padding: '2px 0', cursor: 'pointer' }}>
        <ButtonWrapper
          onClick={(_) => {
            setSelectedViewType(CalendarViewType.Day);
            onChangeView(CalendarViewType.Day);
          }}
          style={{
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
            backgroundColor: selectedViewType === CalendarViewType.Day ? '#F5F6F7' : 'initial',
          }}
        >
          <Typography {...getTypographyStyle(CalendarViewType.Day)}>{t('general.day')}</Typography>
        </ButtonWrapper>
        <ButtonWrapper
          onClick={(_) => {
            setSelectedViewType(CalendarViewType.Week);
            onChangeView(CalendarViewType.Week);
          }}
          style={{
            borderLeftWidth: 0,
            borderRightWidth: 0,
            backgroundColor: selectedViewType === CalendarViewType.Week ? '#F5F6F7' : 'initial',
          }}
        >
          <Typography {...getTypographyStyle(CalendarViewType.Week)}>{t('general.week')}</Typography>
        </ButtonWrapper>
        <ButtonWrapper
          onClick={(_) => {
            setSelectedViewType(CalendarViewType.Month);
            onChangeView(CalendarViewType.Month);
          }}
          style={{
            borderTopRightRadius: 5,
            borderBottomRightRadius: 5,
            backgroundColor: selectedViewType === CalendarViewType.Month ? '#F5F6F7' : 'initial',
          }}
        >
          <Typography {...getTypographyStyle(CalendarViewType.Month)}>{t('general.month')}</Typography>
        </ButtonWrapper>
      </div>
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 180, marginLeft: 30 }}
        data-testid="range-wrapper"
      >
        <IconButton style={{ backgroundColor: '#5AC0B1', padding: 4 }} onClick={onPrevious}>
          <Icon name="navigate_before" color="#ffffff" size={12} />
        </IconButton>
        <Typography variantName="body1">{selectedRange}</Typography>
        <IconButton style={{ backgroundColor: '#5AC0B1', padding: 4 }} onClick={onNext}>
          <Icon name="navigate_next" color="#ffffff" size={12} />
        </IconButton>
      </div>
    </div>
  );
};
