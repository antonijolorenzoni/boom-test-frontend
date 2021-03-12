import React, { useState, useCallback, useMemo } from 'react';

import moment from 'moment';
import 'moment/locale/en-gb';
import 'moment/locale/it';
import 'moment/locale/es';
import 'moment/locale/nl';
import 'moment/locale/fr';

import { range, inRange } from 'lodash';
import { useMediaQuery } from 'react-responsive';

import { AvailableDay, DayName, UnavailableDay, GridWrapper, Wrapper } from './styles';
import { IconButton } from '../IconButton';
import { Icon } from '../Icon';
import { Typography } from '../Typography';
import { MediaQueryBreakpoint } from '../MediaQueryBreakpoint';

export interface DatePickerProps {
  initialDate?: string | null;
  onSelectDate: (value: string) => void;
  availableRange?: { from: string; to: string };
  selectDateLabel?: string;
  lang?: string;
  isDayBlocked?:(value: string) => boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  initialDate,
  onSelectDate,
  availableRange,
  selectDateLabel,
  lang = navigator.language,
  isDayBlocked,
}) => {
  moment.locale(lang);

  const [currentDate, setCurrentDate] = useState<string | null>(initialDate || moment().format('YYYY-MM-DD'));
  const [selectedDate, setSelectedDate] = useState<string | null>(initialDate || null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(initialDate ? moment(initialDate).date() - 1 : null);
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(true);

  const daysInMonth = moment(currentDate).daysInMonth();
  const firstDay = moment(currentDate).startOf('month').day();
  const weekDays = moment.weekdaysShort().map((d) => d[0]);

  const currentDateMoment = moment(currentDate);
  const selectedDateMoment = moment(selectedDate);

  const currentMonth = currentDateMoment.month();
  const currentYear = currentDateMoment.year();

  const isMobile = useMediaQuery({ query: `screen and (max-width: ${MediaQueryBreakpoint.Tablet}px)` });

  const onPickDate = (day: number, dayIndex: number) => {
    const selectedDate = moment().date(day).month(currentMonth).year(currentYear).format('YYYY-MM-DD');
    setSelectedDate(selectedDate);
    setIsOpenMobile(false);
    setSelectedIndex(dayIndex);
    onSelectDate(selectedDate);
  };

  const isAvailable = useCallback(
    (day: number, month: number, year: number) => {
      const momentDate = moment(`${year}-${month + 1}-${day}`, 'YYYY-MM-DD');
      const dayBlocked: boolean = isDayBlocked ? isDayBlocked(momentDate.format()) : false
      return (!availableRange || momentDate.isBetween(availableRange.from, availableRange.to, null, '[]')) && !dayBlocked;
    },
    [availableRange]
  );

  const visibleDaysRange = useMemo(() => {
    if (!selectedIndex || !isMobile || isOpenMobile) {
      return null;
    }

    const rowPosition = (firstDay + selectedIndex) % 7;
    return [selectedIndex - rowPosition + firstDay, selectedIndex + 6 - rowPosition + firstDay + 1];
  }, [firstDay, selectedIndex, isMobile, isOpenMobile]);

  return (
    <Wrapper isClosed={selectedDate !== null && !isOpenMobile}>
      {isMobile && selectedDate !== null && (
        <IconButton onClick={() => setIsOpenMobile((open) => !open)} style={{ position: 'absolute', top: 7, right: 15 }}>
          <Icon name={isOpenMobile ? 'unfold_less' : 'unfold_more'} size={22} color="#5ac0b1" />
        </IconButton>
      )}
      <Typography variantName="title2" textColor="#A3ABB1" style={{ textAlign: 'center', marginBottom: 5 }}>
        {selectDateLabel}
      </Typography>
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 14, marginBottom: 8 }}
        data-testid="change-month-wrapper"
      >
        <IconButton
          onClick={() => {
            setCurrentDate(currentDateMoment.subtract(1, 'month').format());
            setIsOpenMobile(true);
          }}
          style={{ backgroundColor: '#5ac0b1' }}
        >
          <Icon name="keyboard_arrow_left" size={17} color="#ffffff" />
        </IconButton>
        <Typography
          variantName="overline"
          textColor="#000000"
          style={{ textTransform: 'uppercase', margin: '0 30px', minWidth: 100, textAlign: 'center' }}
        >
          {moment().set('month', currentMonth).set('year', currentYear).format('MMMM yyyy')}
        </Typography>
        <IconButton
          onClick={() => {
            setCurrentDate(currentDateMoment.add(1, 'month').format());
            setIsOpenMobile(true);
          }}
          style={{ backgroundColor: '#5ac0b1' }}
        >
          <Icon name="keyboard_arrow_right" size={17} color="#ffffff" />
        </IconButton>
      </div>
      <GridWrapper style={{ height: 44, borderBottom: '0.5px solid #A3ABB1', marginBottom: 10 }}>
        {weekDays.map((d, i) => (
          <DayName key={i}>{d}</DayName>
        ))}
      </GridWrapper>
      <GridWrapper data-testid="days-wrapper">
        {range(firstDay).map((d, i) => {
          const isHidden = Boolean(visibleDaysRange && !inRange(i, visibleDaysRange[0], visibleDaysRange[1]));
          return (
            <div
              style={{
                color: '#000000',
                display: isHidden ? 'none' : 'initial',
              }}
              key={i}
            />
          );
        })}
        {range(1, daysInMonth + 1).map((d, i) => {
          const isHidden = Boolean(visibleDaysRange && !inRange(i + firstDay, visibleDaysRange[0], visibleDaysRange[1]));

          return isAvailable(d, currentMonth, currentYear) ? (
            <AvailableDay
              key={i}
              isSelected={
                d === selectedDateMoment.date() && currentYear === selectedDateMoment.year() && currentMonth === selectedDateMoment.month()
              }
              isHidden={isHidden}
              onClick={() => onPickDate(d, i)}
            >
              {d}
            </AvailableDay>
          ) : (
            <UnavailableDay key={i} isHidden={isHidden}>
              {d}
            </UnavailableDay>
          );
        })}
      </GridWrapper>
    </Wrapper>
  );
};
