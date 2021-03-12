import moment from 'moment-timezone';

export const buildOrderStartDate = (date: moment.MomentInput) => {
  return moment(date)
    .set({
      seconds: 0,
      milliseconds: 0,
    })
    .utc()
    .valueOf();
};

export const isDayBlocked = (date: moment.MomentInput) => {
  const momentDate = moment(date);
  return [
    [1, 1],
    [12, 25],
  ].some((arr) => arr[0] === momentDate.get('month') + 1 && arr[1] === momentDate.get('date'));
};

export const toTime = (time: number, duration: number, timezone: string): string =>
  `${moment.tz(moment.utc(time), timezone).format('HH:mm')} - ${moment
    .tz(moment.utc(time), timezone)
    .add(duration / 60, 'hours')
    .format('HH:mm')}`;

export const getNumOfDaysFromToday = (date: string): number => {
  return moment(date).isValid() ? moment.utc(date).diff(moment.utc(), 'days') : 0;
};
