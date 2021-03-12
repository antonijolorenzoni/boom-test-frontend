import React, { useState } from 'react';
import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';
import { Order } from 'types/Order';
import { MediaQueryBreakpoint } from 'types/MediaQueryBreakpoint';
import { useMediaQuery } from 'react-responsive';
import { Wrapper, PickersWrapper, TimePickerWrapper, DatePickerWrapper, BottomRowResume } from './styles';
import { DatePicker, Icon, TimePicker, Typography } from 'ui-boom-components';

import { getDurationString } from 'utils/time';
import { isDayBlocked } from 'utils/date';

interface Props {
  order: Order;
  renderDateAndTimeButtons: (isDateValid: boolean, date: string | null, time: string | null) => JSX.Element;
}

export const DateAndTimePanel: React.FC<Props> = ({ order, renderDateAndTimeButtons }) => {
  const { t } = useTranslation();

  const isDesktop: boolean = useMediaQuery({ query: `screen and (max-width: ${MediaQueryBreakpoint.Desktop}px)` });

  const duration: number = order.details.shootingDuration;
  const stringDuration: string = getDurationString(duration);

  const firstDayAvailable: string = moment().add(6, 'days').format('YYYY-MM-DD');
  const lastDayAvailable: string = moment().add(42, 'days').format('YYYY-MM-DD');

  const startDate = order.startDate ? moment.tz(order.startDate, order.timezone) : moment.tz(order.suggestedDate, order.timezone);

  const isDateOutRange =
    startDate.isBefore(moment(firstDayAvailable, 'YYYY-MM-DD')) || startDate.isAfter(moment(lastDayAvailable, 'YYYY-MM-DD'));

  const [selectedDate, setSelectedDate] = useState<string | null>(startDate && !isDateOutRange ? startDate.format('YYYY-MM-DD') : null);
  const [selectedTime, setSelectedTime] = useState<string | null>(startDate && !isDateOutRange ? startDate.format('HH:mm') : null);

  const date: string = moment(selectedDate).format('DD/MM');

  const dayOfWeek: number = moment(selectedDate).isoWeekday();
  const dayOfWeekShort: string = t(`daysOfWeek.${dayOfWeek - 1}`).substr(0, 3);

  const timeEnd: string = moment(selectedTime, 'HH:mm').add(order.details.shootingDuration, 'minute').format('HH:mm');

  const selectedDateResume = (
    <>
      <Typography variantName="overline" style={{ marginBottom: 10 }}>
        {t('general.date')}
      </Typography>
      <div style={{ display: 'flex', alignItems: 'center' }} data-testid="selected-new-date">
        <Icon name="calendar_today" size={18} color="#A3ABB1" style={{ marginRight: 13 }} />
        <Typography variantName="kpi1">{selectedDate ? `${dayOfWeekShort} ${date}` : '-'}</Typography>
      </div>
    </>
  );

  const selectedTimeResume = (
    <>
      <Typography variantName="overline" style={{ marginBottom: 10 }}>
        {t('general.time')}
      </Typography>
      <div style={{ display: 'flex', alignItems: 'center' }} data-testid="selected-new-time">
        <Icon name="access_time" size={18} color="#A3ABB1" style={{ marginRight: 13 }} />
        <Typography variantName="kpi1">{selectedTime ? `${selectedTime} - ${timeEnd}` : '-'}</Typography>
      </div>
    </>
  );

  return (
    <Wrapper>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', marginBottom: isDesktop ? 10 : 22, justifyContent: 'center' }}>
          <Typography variantName="title3" style={{ marginRight: 5 }}>
            {`${t('orderInfo.photoshootDuration')}:`}
          </Typography>
          <Typography variantName="title3" style={{ fontWeight: 700 }}>
            {stringDuration}
          </Typography>
        </div>
        <PickersWrapper data-testid="pickers-wrapper">
          <DatePickerWrapper style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <DatePicker
              initialDate={selectedDate}
              onSelectDate={(value) => setSelectedDate(moment.tz(value, order.timezone).format('YYYY-MM-DD'))}
              selectDateLabel={t('general.selectDate')}
              availableRange={{ from: firstDayAvailable, to: lastDayAvailable }}
              lang={localStorage.i18nextLng}
              isDayBlocked={isDayBlocked}
            />
            {!isDesktop && <div style={{ marginTop: 30 }}>{selectedDateResume}</div>}
          </DatePickerWrapper>
          <TimePickerWrapper>
            <TimePicker
              initialTime={selectedTime}
              minutesDuration={duration}
              onSelectTime={setSelectedTime}
              selectTimeLabel={t('general.selectStartingTime')}
            />
            {!isDesktop && <div style={{ marginTop: 30 }}>{selectedTimeResume}</div>}
          </TimePickerWrapper>
        </PickersWrapper>
      </div>
      {isDesktop && (
        <BottomRowResume>
          <div style={{ width: 414, display: 'flex' }}>
            <div style={{ width: '50%' }}>{selectedDateResume}</div>
            <div style={{ width: '50%' }}>{selectedTimeResume}</div>
          </div>
        </BottomRowResume>
      )}
      {renderDateAndTimeButtons(Boolean(selectedDate && selectedTime), selectedDate, selectedTime)}
    </Wrapper>
  );
};
