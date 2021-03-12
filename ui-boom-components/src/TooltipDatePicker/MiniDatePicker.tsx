import React, { useState } from 'react';

import moment from 'moment';
import 'moment/locale/en-gb';
import 'moment/locale/it';
import 'moment/locale/es';
import 'moment/locale/nl';
import 'moment/locale/fr';

import { range } from 'lodash';

import { AvailableDay, DayName, GridWrapper, Wrapper, AvailableDayBox, Corner } from './styles';
import { IconButton } from '../IconButton';
import { Icon } from '../Icon';
import { Typography } from '../Typography';

export interface MiniDatePickerProps {
  initialDate?: Date | null;
  onSelectDate: (startDate: Date | null, endDate: Date | null) => void;
  availableRange?: { from: string; to: string };
  lang?: string;
  isDayBlocked?: (value: string) => boolean;
  doneLabel?: string;
  start?: Date | null;
  end?: Date | null;
}

export const MiniDatePicker: React.FC<MiniDatePickerProps> = ({
  onSelectDate,
  lang = navigator.language,
  doneLabel,
  start,
  end,
  isDayBlocked,
}) => {
  moment.locale(lang);

  const [currentDate, setCurrentDate] = useState<string | null>(start ? moment(start).format() : moment().format());
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(start ? moment(start).format() : null);
  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(end ? moment(end).format() : null);
  const [mouseOverDate, setMouseOverDate] = useState<string | null>(null);

  const selectedStartDateMoment = moment(selectedStartDate);
  const selectedEndDateMoment = moment(selectedEndDate);

  const daysInMonth = moment(currentDate).daysInMonth();
  const firstDay = moment(currentDate).startOf('month').day();
  const weekDays = moment.weekdaysShort();
  const currentDateMoment = moment(currentDate);
  const currentMonth = currentDateMoment.month();
  const currentYear = currentDateMoment.year();

  const onPickDate = (day: number, dayIndex: number) => {
    const selectedDate = moment().month(currentMonth).date(day).year(currentYear);
    if ((selectedStartDate === null && selectedEndDate === null) || (selectedStartDate !== null && selectedEndDate !== null)) {
      setSelectedStartDate(selectedDate.format());
      setSelectedEndDate(null);
    } else if (selectedStartDate !== null && selectedEndDate === null && selectedDate.isAfter(selectedStartDateMoment, 'day')) {
      setSelectedEndDate(selectedDate.format());
    } else if (selectedStartDate !== null && selectedEndDate === null && selectedDate.isBefore(selectedStartDateMoment, 'day')) {
      setSelectedStartDate(selectedDate.format());
    }
  };

  return (
    <Wrapper data-testid="mini-date-picker">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} data-testid="change-month-wrapper">
        <IconButton onClick={() => setCurrentDate(currentDateMoment.subtract(1, 'month').format())}>
          <Icon name="keyboard_arrow_left" size={17} color="#80888D" />
        </IconButton>
        <Typography variantName="body2" textColor="#000000" style={{ textTransform: 'capitalize', textAlign: 'center' }}>
          {moment().set('month', currentMonth).set('year', currentYear).format('MMMM yyyy')}
        </Typography>
        <IconButton onClick={() => setCurrentDate(currentDateMoment.add(1, 'month').format())}>
          <Icon name="keyboard_arrow_right" size={17} color="#80888D" />
        </IconButton>
      </div>
      <GridWrapper>
        {weekDays.map((d, i) => (
          <DayName key={i}>
            <Typography variantName="caption2" textColor="#A3ABB1">
              {d}
            </Typography>
          </DayName>
        ))}
      </GridWrapper>
      <GridWrapper data-testid="days-wrapper">
        {range(firstDay).map((d, i) => (
          <div style={{ color: '#000000' }} key={i} />
        ))}
        {range(1, daysInMonth + 1).map((d, i) => {
          const isSelected =
            (d === selectedStartDateMoment.date() &&
              currentYear === selectedStartDateMoment.year() &&
              currentMonth === selectedStartDateMoment.month()) ||
            (d === selectedEndDateMoment.date() &&
              currentYear === selectedEndDateMoment.year() &&
              currentMonth === selectedEndDateMoment.month());

          const isBetweenSelection = moment(currentDateMoment)
            .set('date', d)
            .isBetween(selectedStartDateMoment, selectedEndDateMoment, 'day');

          const fullRangeSelected = Boolean(selectedStartDate && selectedEndDate);

          const mouseOverMoment = moment(mouseOverDate);
          const fullRangeOver =
            Boolean(selectedStartDate) &&
            !selectedEndDate &&
            moment(currentDateMoment).set('date', d).isBetween(selectedStartDateMoment, mouseOverMoment, 'day');

          const isMouseOver =
            d === mouseOverMoment.date() && currentYear === mouseOverMoment.year() && currentMonth === mouseOverMoment.month();

          const showCorner =
            (isSelected &&
              ((Boolean(selectedStartDate) && Boolean(selectedEndDate)) ||
                (Boolean(mouseOverDate) && mouseOverMoment.isAfter(selectedStartDateMoment)))) ||
            (isMouseOver &&
              Boolean(selectedStartDate) &&
              ((!selectedEndDate && mouseOverMoment.isAfter(selectedStartDateMoment)) ||
                (Boolean(selectedEndDate) && mouseOverMoment.isBetween(selectedStartDateMoment, selectedEndDateMoment, 'day'))));

          return (
            <AvailableDayBox
              key={d}
              isSelected={isSelected}
              isBetweenSelection={isBetweenSelection}
              fullRangeOver={fullRangeOver}
              data-day-number={d}
              onMouseEnter={() => {
                setMouseOverDate(moment(currentDate).set('date', d).format());
              }}
              onMouseLeave={() => setMouseOverDate(null)}
            >
              {showCorner && (
                <Corner position={selectedStartDateMoment.date() === d ? 'right' : 'left'} fullRangeSelected={fullRangeSelected} />
              )}
              <AvailableDay
                key={i}
                isSelected={isSelected}
                isMouseOver={isMouseOver}
                onClick={() => onPickDate(d, i)}
                fullRangeSelected={fullRangeSelected && isBetweenSelection}
                fullRangeOver={fullRangeOver}
              >
                <Typography variantName="caption2" textColor="#000">
                  {d}
                </Typography>
              </AvailableDay>
            </AvailableDayBox>
          );
        })}
      </GridWrapper>
      <div
        style={{ display: 'flex', justifyContent: 'center' }}
        onClick={(e) => {
          e.stopPropagation();

          const startValid = moment(selectedStartDate).isValid();

          if (startValid) {
            onSelectDate(
              moment(selectedStartDate).isValid()
                ? moment(selectedStartDate).set('minute', 0).set('second', 0).set('millisecond', 0).toDate()
                : null,
              moment(selectedEndDate).isValid()
                ? moment(selectedEndDate).set('minute', 0).set('second', 0).set('millisecond', 0).toDate()
                : null
            );
          }
        }}
      >
        <Typography variantName="textButton" style={{ textDecoration: 'underline', cursor: selectedStartDate ? 'pointer' : 'not-allowed' }}>
          {doneLabel || 'Done'}
        </Typography>
      </div>
    </Wrapper>
  );
};
