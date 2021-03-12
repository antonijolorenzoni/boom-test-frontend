import React, { useState, useMemo } from 'react';
import moment from 'moment';
import { range, inRange } from 'lodash';
import { useMediaQuery } from 'react-responsive';

import { Wrapper, AvailableHour, GridWrapper } from './styles';
import { Typography } from '../Typography';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { MediaQueryBreakpoint } from '../MediaQueryBreakpoint';

const isTimeValid = (time?: string | null) => (time ? /^([0-1]?[0-9]|2[0-3]):([0|3]0)(:0)?$/.test(time) : true);

const getInitialIndex = (time?: string | null): number | null => {
  if (time) {
    const minusHeight = moment(time, 'HH:mm').add(-8, 'hour');
    const hours = minusHeight.hours();
    const minutes = minusHeight.minutes();

    return (hours * 60 + minutes) / 30;
  }
  return null;
};

export interface TimePickerProps {
  initialTime?: string | null;
  minutesDuration: number;
  disabledAfter?: string;
  selectTimeLabel?: string;
  onSelectTime: (time: string) => void;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  initialTime,
  minutesDuration,
  disabledAfter = '18:00',
  selectTimeLabel,
  onSelectTime,
}) => {
  const isDisabledAfterValid = isTimeValid(disabledAfter);

  if (!isDisabledAfterValid) {
    console.warn('isDisabledAfter must match /^([0-1]?[0-9]|2[0-3]):([0|3]0)(:0)?$/');
  }

  const isInitialTimeValid = isTimeValid(initialTime);

  if (!isInitialTimeValid) {
    console.warn('isInitialTimeValid must match /^([0-1]?[0-9]|2[0-3]):([0|3]0)(:0)?$/');
  }

  const hours = range(8, 20, 0.5);
  const date = moment();

  const [selectedTime, setSelectedTime] = useState<string | null>(isInitialTimeValid && initialTime ? initialTime : null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(getInitialIndex(initialTime));
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(true);

  const isMobile = useMediaQuery({ query: `screen and (max-width: ${MediaQueryBreakpoint.Tablet}px)` });

  const disabledFrom = isDisabledAfterValid
    ? moment()
        .hour(Number(disabledAfter.split(':')[0]))
        .minute(Number(disabledAfter.split(':')[1]))
    : moment().hour(18).minute(0);

  const visibleTimeRange = useMemo(() => {
    if (selectedIndex === null || !isMobile || isOpenMobile) {
      return null;
    }

    const rowPosition = selectedIndex % 6;
    return [selectedIndex - rowPosition, selectedIndex + 5 - rowPosition + 1];
  }, [selectedIndex, isMobile, isOpenMobile]);

  return (
    <Wrapper isClosed={selectedTime !== null && !isOpenMobile}>
      {isMobile && selectedTime !== null && (
        <IconButton onClick={() => setIsOpenMobile((open) => !open)} style={{ position: 'absolute', top: 7, right: 15 }}>
          <Icon name={isOpenMobile ? 'unfold_less' : 'unfold_more'} size={22} color="#5ac0b1" />
        </IconButton>
      )}
      {selectTimeLabel && (
        <Typography variantName="title2" textColor="#A3ABB1" style={{ textAlign: 'center', marginBottom: 19 }}>
          {selectTimeLabel}
        </Typography>
      )}
      <GridWrapper data-testid="times-wrapper">
        {hours.map((h, i) => {
          const time = date
            .hour(h)
            .minute(i % 2 === 0 ? 0 : 30)
            .format('HH:mm');

          const isInDuration = selectedIndex !== null && i > selectedIndex && i <= selectedIndex + minutesDuration / 30;

          const isDisabled =
            Boolean(disabledAfter) &&
            date
              .hour(h)
              .minute(i % 2 === 0 ? 0 : 30)
              .isAfter(disabledFrom);

          const isHidden = Boolean(visibleTimeRange && !inRange(i, visibleTimeRange[0], visibleTimeRange[1]));

          return (
            <AvailableHour
              key={h}
              isSelected={time === selectedTime}
              isInDuration={isInDuration}
              isDisabled={isDisabled}
              isHidden={isHidden}
              onClick={() => {
                if (!isDisabled) {
                  setSelectedTime(time);
                  setSelectedIndex(i);
                  setIsOpenMobile(false);
                  onSelectTime(time);
                }
              }}
            >
              {time}
            </AvailableHour>
          );
        })}
      </GridWrapper>
    </Wrapper>
  );
};
